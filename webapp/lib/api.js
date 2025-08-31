export function getAuthHeaders(session, extra = {}) {
    const headers = { ...extra };
    if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
    return headers;
  }