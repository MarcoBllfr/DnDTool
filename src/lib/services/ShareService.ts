function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')  // sostituisci '+' con '-'
    .replace(/\//g, '_')  // sostituisci '/' con '_'
    .replace(/=+$/, '');  // rimuovi padding
}

function base64UrlDecode(str: string): string {
  // Ripristina padding
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad) {
    str += '='.repeat(4 - pad);
  }
  return atob(str);
}

export function buildCompactUrl(basePath: string, state: Record<string, any>) {
  const json = JSON.stringify(state);
  const encoded = base64UrlEncode(json);
  return `${basePath}?s=${encoded}`;
}

export function decodeStateFromUrl(search: string): Record<string, any> | null {
  const params = new URLSearchParams(search);
  const encoded = params.get("s");
  if (!encoded) return null;

  try {
    const json = base64UrlDecode(encoded);
    const parsed = JSON.parse(json);
    return parsed;
  } catch (e) {
    console.error("Errore nella decodifica dello stato:", e);
    return null;
  }
}
