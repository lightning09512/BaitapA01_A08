import axios from 'axios';
import Constants from 'expo-constants';

// ==== CẤU HÌNH CƠ BẢN ====
// Server Node đang chạy ở PORT 3000 (xem trong Server/server.js)
const SERVER_PORT = 3000;

// Lấy host của Metro/Expo (thường là IP máy tính khi chạy LAN)
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
    // bỏ qua
  }
  return null;
}

// Chỉ chọn 1 host duy nhất để gọi API (không thử lần lượt nhiều host nữa)
// - Khi chạy cùng WiFi (LAN): dùng IP từ Expo (ưu tiên)
// - Nếu không lấy được: fallback 10.0.2.2 (emulator Android)
const EXPO_HOST = getHostFromExpo();
const SERVER_HOST = EXPO_HOST || '10.0.2.2';

const api = axios.create({
  baseURL: `http://${SERVER_HOST}:${SERVER_PORT}`,
  timeout: 7000, // 7s là đủ, tránh chờ quá lâu khi server không phản hồi
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lưu token tạm trong bộ nhớ (không phụ thuộc AsyncStorage)
let currentToken = null;

export function setAuthToken(token) {
  currentToken = token;
  if (token) {
    api.defaults.headers.common = api.defaults.headers.common || {};
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else if (api.defaults.headers.common) {
    delete api.defaults.headers.common['Authorization'];
  }
}

function getQueryParam(url, key) {
  const qIndex = url.indexOf('?');
  if (qIndex === -1) return '';
  const query = url.slice(qIndex + 1);
  const pairs = query.split('&');
  for (const pair of pairs) {
    if (!pair) continue;
    const [k, v] = pair.split('=');
    if (decodeURIComponent(k || '') === key) return decodeURIComponent(v || '');
  }
  return '';
}

// Mock data for products in case API fails
const mockProducts = [
  {
    id: 1,
    name: 'iPhone 13 Pro',
    price: 999,
    image: 'https://via.placeholder.com/150x150/2196F3/FFFFFF?text=iPhone',
    category: 'electronics',
    description: 'Latest iPhone with amazing features'
  },
  {
    id: 2,
    name: 'MacBook Pro',
    price: 1299,
    image: 'https://via.placeholder.com/150x150/4CAF50/FFFFFF?text=MacBook',
    category: 'electronics',
    description: 'Powerful laptop for professionals'
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 249,
    image: 'https://via.placeholder.com/150x150/FF9800/FFFFFF?text=AirPods',
    category: 'electronics',
    description: 'Wireless earbuds with noise cancellation'
  },
  {
    id: 4,
    name: 'iPad Air',
    price: 599,
    image: 'https://via.placeholder.com/150x150/9C27B0/FFFFFF?text=iPad',
    category: 'electronics',
    description: 'Versatile tablet for work and play'
  },
  {
    id: 5,
    name: 'Apple Watch',
    price: 399,
    image: 'https://via.placeholder.com/150x150/F44336/FFFFFF?text=Watch',
    category: 'electronics',
    description: 'Smart watch with health tracking'
  },
  {
    id: 6,
    name: 'Samsung Galaxy',
    price: 799,
    image: 'https://via.placeholder.com/150x150/009688/FFFFFF?text=Samsung',
    category: 'electronics',
    description: 'Android flagship smartphone'
  }
];

// Hợp nhất headers mặc định (bao gồm Authorization) với headers truyền thêm
function mergeConfigWithDefaults(config = {}) {
  const defaultHeaders = api.defaults.headers?.common || {};
  return {
    ...config,
    headers: {
      ...defaultHeaders,
      ...(config.headers || {}),
    },
  };
}

// Enhanced get method with fallback to mock data
api.get = async (url, config) => {
  try {
    const mergedConfig = mergeConfigWithDefaults(config);
    const response = await axios.get(`${api.defaults.baseURL}${url}`, mergedConfig);
    return response;
  } catch (error) {
    console.log('API failed, using mock data:', error.message);

    // Return mock data for products endpoint
    if (url.includes('/products')) {
      const search = getQueryParam(url, 'search') || '';

      const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );

      return {
        data: filteredProducts,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        request: {}
      };
    }

    // Handle single product endpoint
    if (url.match(/\/products\/\d+/)) {
      const productId = parseInt(url.split('/').pop());
      const product = mockProducts.find(p => p.id === productId);

      if (product) {
        return {
          data: product,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
          request: {}
        };
      }
    }

    // Handle profile endpoint (mock khi server không chạy) - dùng dữ liệu giả, không phải thông tin thật
    if (url === '/profile') {
      return {
        data: {
          id: 1,
          name: 'Khách Hàng',
          email: 'guest@example.com',
          phone: '',
          avatar: 'https://via.placeholder.com/120x120/2196F3/FFFFFF?text=Profile'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        request: {}
      };
    }

    throw error;
  }
};

// Enhanced post method for authentication - calls real server
api.post = async (url, data, config) => {
  try {
    const mergedConfig = mergeConfigWithDefaults(config);
    const response = await axios.post(`${api.defaults.baseURL}${url}`, data, mergedConfig);
    return response;
  } catch (error) {
    console.log('API failed:', error.message, error.code);
    // Giữ nguyên error để màn hình có thể kiểm tra e.code (ECONNREFUSED, ETIMEDOUT)
    throw error;
  }
};

// Enhanced put method for profile updates
api.put = async (url, data, config) => {
  try {
    const mergedConfig = mergeConfigWithDefaults(config);
    const response = await axios.put(`${api.defaults.baseURL}${url}`, data, mergedConfig);
    return response;
  } catch (error) {
    console.log('PUT API failed:', error.message);
    throw error;
  }
};

// DELETE method (dùng cho admin xóa sản phẩm, v.v.)
api.delete = async (url, config) => {
  try {
    const mergedConfig = mergeConfigWithDefaults(config);
    const response = await axios.delete(`${api.defaults.baseURL}${url}`, mergedConfig);
    return response;
  } catch (error) {
    console.log('DELETE API failed:', error.message);
    throw error;
  }
};

export default api;
