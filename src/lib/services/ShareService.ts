export function buildUrlFromState(basePath: string, params: Record<string, any>) {
    const searchParams = new URLSearchParams();
  
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'object') {
        searchParams.set(key, encodeURIComponent(JSON.stringify(value)));
      } else if (value !== null && value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    }
  
    return `${basePath}?${searchParams.toString()}`;
  }
  
  export function applyStateFromUrl(search: string, callback: (key: string, value: any) => void) {
    const searchParams = new URLSearchParams(search);
  
    for (const [key, value] of searchParams.entries()) {
      try {
        const decoded = decodeURIComponent(value);
        const parsed = JSON.parse(decoded);
        callback(key, parsed);
      } catch {
        callback(key, value);
      }
    }
  }
  