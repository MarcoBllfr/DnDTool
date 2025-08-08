async function concatUint8Arrays(uint8arrays: Uint8Array[]): Promise<Uint8Array> {
  const blob = new Blob(uint8arrays);
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

async function compress(str: string): Promise<string> {
  const stream = new Blob([str]).stream();
  const compressedStream = stream.pipeThrough(new CompressionStream("gzip"));
  const chunks: Uint8Array[] = [];
  
  const reader = compressedStream.getReader();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  
  const compressedBytes = await concatUint8Arrays(chunks);
  
  // Convert to Base64 string with URL-safe encoding
  return btoa(String.fromCharCode(...compressedBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function decompress(compressedString: string): Promise<string> {
  // Restore standard Base64 format
  let base64 = compressedString.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  
  // Convert from Base64 back to Uint8Array
  const compressedBytes = new Uint8Array(
    atob(base64).split('').map(char => char.charCodeAt(0))
  );
  
  const stream = new Blob([compressedBytes]).stream();
  const decompressedStream = stream.pipeThrough(new DecompressionStream("gzip"));
  const chunks: Uint8Array[] = [];
  
  const reader = decompressedStream.getReader();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  
  const stringBytes = await concatUint8Arrays(chunks);
  return new TextDecoder().decode(stringBytes);
}

// Legacy base64 encoding functions (fallback for older browsers)
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad) {
    str += '='.repeat(4 - pad);
  }
  return atob(str);
}

// Check if compression APIs are supported
function isCompressionSupported(): boolean {
  return typeof CompressionStream !== 'undefined' && 
         typeof DecompressionStream !== 'undefined';
}

export async function buildCompactUrl(basePath: string, state: Record<string, any>): Promise<string> {
  const json = JSON.stringify(state);
  
  if (isCompressionSupported()) {
    try {
      const compressed = await compress(json);
      // Use 'c' parameter for compressed data
      return `${basePath}?c=${compressed}`;
    } catch (error) {
      console.warn('Compression failed, falling back to base64:', error);
      // Fallback to base64 encoding
      const encoded = base64UrlEncode(json);
      return `${basePath}?s=${encoded}`;
    }
  } else {
    // Fallback for browsers that don't support compression
    const encoded = base64UrlEncode(json);
    return `${basePath}?s=${encoded}`;
  }
}

export async function decodeStateFromUrl(search: string): Promise<Record<string, any> | null> {
  const params = new URLSearchParams(search);
  
  // Try compressed format first
  const compressed = params.get("c");
  if (compressed && isCompressionSupported()) {
    try {
      const json = await decompress(compressed);
      return JSON.parse(json);
    } catch (error) {
      console.error("Errore nella decompressione dello stato:", error);
      return null;
    }
  }
  
  // Fallback to legacy base64 format
  const encoded = params.get("s");
  if (!encoded) return null;

  try {
    const json = base64UrlDecode(encoded);
    return JSON.parse(json);
  } catch (error) {
    console.error("Errore nella decodifica dello stato:", error);
    return null;
  }
}

// Utility function to estimate compression ratio
export async function getCompressionRatio(state: Record<string, any>): Promise<{ 
  original: number, 
  compressed: number, 
  ratio: number,
  supported: boolean 
}> {
  const json = JSON.stringify(state);
  const originalSize = new Blob([json]).size;
  
  if (!isCompressionSupported()) {
    const base64Size = new Blob([base64UrlEncode(json)]).size;
    return {
      original: originalSize,
      compressed: base64Size,
      ratio: base64Size / originalSize,
      supported: false
    };
  }
  
  try {
    const compressed = await compress(json);
    const compressedSize = new Blob([compressed]).size;
    return {
      original: originalSize,
      compressed: compressedSize,
      ratio: compressedSize / originalSize,
      supported: true
    };
  } catch (error) {
    const base64Size = new Blob([base64UrlEncode(json)]).size;
    return {
      original: originalSize,
      compressed: base64Size,
      ratio: base64Size / originalSize,
      supported: false
    };
  }
}