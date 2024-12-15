import axios from 'axios';
import { MessageBox } from 'element-ui';

const instance = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 不需要自动添加merchantId的API白名单
const NO_MERCHANT_ID_APIS = [
  '/admin/orderDetail/list',
  '/admin/order/checkout',
  '/admin/order/receiving'
];

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }

    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params
    });
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response.data;
  },
  error => {
    console.error('Response Error:', error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          MessageBox.alert('登录已过期，请重新登录', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            showClose: false,
            closeOnClickModal: false
          }).then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = '/login';
          });
          break;
        case 500:
          MessageBox.alert('服务器错误', '错误', {
            confirmButtonText: '确定',
            type: 'error'
          });
          break;
        default:
          let errorMsg = '请求失败';
          if (error.response.data && error.response.data.msg) {
            errorMsg = error.response.data.msg;
          }
          MessageBox.alert(errorMsg, '错误', {
            confirmButtonText: '确定',
            type: 'error'
          });
      }
    }
    return Promise.reject(error);
  }
);

const request = class {
  constructor(url, arg) {
    this.url = url;
    this.arg = arg || {};
  }
  
  modepost() {
    // 检查是否在白名单中
    const isExempt = NO_MERCHANT_ID_APIS.some(api => this.url.includes(api));
    
    // 如果不在白名单中，则添加merchantId
    const data = {
      ...this.arg
    };
    
    if (!isExempt) {
      data.merchantId = this.arg.merchantId || JSON.parse(localStorage.getItem('currentMerchant') || '{}').id;
    }
    
    return instance.post(this.url, data);
  }
  
  modeget() {
    // 检查是否在白名单中
    const isExempt = NO_MERCHANT_ID_APIS.some(api => this.url.includes(api));
    
    // 如果不在白名单中，则添加merchantId
    const params = {
      ...this.arg
    };
    
    if (!isExempt) {
      params.merchantId = this.arg.merchantId || JSON.parse(localStorage.getItem('currentMerchant') || '{}').id;
    }
    
    return instance.get(this.url, { params });
  }

  modedelete() {
    // 检查是否在白名单中
    const isExempt = NO_MERCHANT_ID_APIS.some(api => this.url.includes(api));
    
    // 如果不在白名单中，则添加merchantId
    const params = {
      ...this.arg
    };
    
    if (!isExempt) {
      params.merchantId = this.arg.merchantId || JSON.parse(localStorage.getItem('currentMerchant') || '{}').id;
    }
    
    return instance.delete(this.url, { params });
  }

  modeput() {
    // 检查是否在白名单中
    const isExempt = NO_MERCHANT_ID_APIS.some(api => this.url.includes(api));
    
    // 如果不在白名单中，则添加merchantId
    const data = {
      ...this.arg
    };
    
    if (!isExempt) {
      data.merchantId = this.arg.merchantId || JSON.parse(localStorage.getItem('currentMerchant') || '{}').id;
    }
    
    return instance.put(this.url, data);
  }
}

export default request;