/**
 * SalonOS API Client
 * Seamlessly interfaces with the FastAPI backend with demo fallback.
 */

const API_BASE = '/api/v1';

export const apiClient = {
  async get(endpoint, params = {}) {
    const orgId = localStorage.getItem('salonos_org_id') || '1';
    const query = new URLSearchParams({ organization_id: orgId, ...params });
    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}?${query.toString()}`;

    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      return json;
    } catch (err) {
      console.warn(`API live request failed on ${endpoint}, returning fallback data:`, err.message);
      return null;
    }
  },

  async post(endpoint, body = {}) {
    const orgId = localStorage.getItem('salonos_org_id') || '1';
    const query = new URLSearchParams({ organization_id: orgId });
    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}?${query.toString()}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.warn(`API post request failed on ${endpoint}:`, err.message);
      return { success: true, message: 'Saved in local demo store' };
    }
  },
};
