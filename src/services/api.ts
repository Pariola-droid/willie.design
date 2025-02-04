const BASE_URL = `/api`;

const formatUrl = (url: string) => {
  return url.includes('http') ? url : `${BASE_URL}${url}`;
};

const generateHeaders = async (headers: any) => {
  const options: any = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };

  return options;
};

const fetchReq = async <T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
  path: string,
  body: any,
  headers?: any
): Promise<{ data: T | any | null; error: any | null }> => {
  try {
    const headerOptions = await generateHeaders(headers);
    const response = await fetch(formatUrl(path), {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: headerOptions,
    });

    const responseData = await response.json();

    if (response?.status >= 400 && response?.status <= 500) {
      return { data: null, error: responseData };
    }

    return { data: responseData?.data ?? responseData, error: null };
  } catch (e: any) {
    return { data: null, error: e };
  }
};

export const request = {
  get: async <T>(path: string, headers?: any) => {
    return fetchReq<T>('GET', path, null, headers);
  },
  post: async <T>(path: string, body: any, headers?: any) => {
    return fetchReq<T>('POST', path, body, headers);
  },
  put: async <T>(path: string, body: any, headers?: any) => {
    return fetchReq<T>('PUT', path, body, headers);
  },
  patch: async <T>(path: string, body?: any, headers?: any) => {
    return fetchReq<T>('PATCH', path, body, headers);
  },
  delete: async <T>(path: string, body: any, headers?: any) => {
    return fetchReq<T>('DELETE', path, body, headers);
  },
};
