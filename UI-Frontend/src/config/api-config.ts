// src/config/api-config.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const API_URLS = {
    AUTH: `${API_BASE_URL}/auth`,
    ENTITIES: `${API_BASE_URL}/entities`,
    IMPORT_EXPORT: `${API_BASE_URL}/data`
};

export default API_BASE_URL;
