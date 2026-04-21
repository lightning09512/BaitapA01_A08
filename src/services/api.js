import axios from 'axios';
import Constants from 'expo-constants';

const SERVER_PORT = 3000;

function getHostFromExpo() {
  try {
    const hostUri =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoGo?.developer?.hostUri ||
      Constants?.manifest?.debuggerHost;
    if (typeof hostUri === 'string' && hostUri.length > 0) {
      return hostUri.split(':')[0];
    }
  } catch {
    // ignore
  }
  return null;
}

const EXPO_HOST = getHostFromExpo();
const SERVER_HOST = EXPO_HOST || '10.0.2.2';

const api = axios.create({
  baseURL: `http://${SERVER_HOST}:${SERVER_PORT}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let currentToken = null;

export function setAuthToken(token) {
  currentToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Global interceptor to handle 401s or common errors if needed
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('Unauthorized - possible expired token');
    }
    return Promise.reject(error);
  }
);

// We keep the wrappers ONLY if we need special logic, but we make them use the 'api' instance
// to ensure Authorization headers are preserved.
const originalGet = api.get;
api.get = async (url, config) => {
  try {
    // Use the 'api' instance, not the global axios import
    return await originalGet.call(api, url, config);
  } catch (error) {
    console.log(`GET ${url} failed:`, error.message);
    
    // MOCK DATA FALLBACK - ONLY for specific endpoints and IF the server is down
    if (url.includes('/products') && error.code === 'ECONNREFUSED') {
       // Returning minimal mock data to keep UI alive during dev
       return { data: [], status: 200, mock: true };
    }
    
    throw error;
  }
};

export default api;
