const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const customFetch = (url: string, options?: RequestInit): Promise<Response> =>
  fetch(`${BASE_URL}${url}`, options);
