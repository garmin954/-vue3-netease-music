import axios, {AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosInterceptorManager} from 'axios';
import { ElLoading } from 'element-plus';
import { confirm } from '@/components/confirm';
import store from '@/store';

const BASE_URL = 'http://api.pkus.net.cn/api/';
// 不带全局loading的请求实例
export const requestWithoutLoading = createBaseInstance();

// 带全局loading的请求实例
// 传入函数是因为需要在处理请求结果handleResponse之前处理loading
// 所以要在内部插入loading拦截器的处理逻辑
export const request = createBaseInstance();
mixinLoading(request.interceptors);

// 通用的axios实例
function createBaseInstance() {
  const instance = axios.create({
    baseURL: '/api',
    // timeout: 5000,
    headers: {
      'X-Custom-Header': 'foobar'
    }
  });

  // 响应拦截
  instance.interceptors.response.use(handleResponse, handleError);
  return instance;
}

function handleError(e: any) {
  confirm(e.message, '出错啦~');
  throw e;
}

function handleResponse(response: AxiosResponse) {
  return response.data;
}

let loading: any;
let loadingCount = 0;
const SET_AXIOS_LOADING = 'global/setAxiosLoading';

interface InterceptorsInterface {
  request: AxiosInterceptorManager<AxiosRequestConfig>;
  response: AxiosInterceptorManager<AxiosResponse>;
}
function mixinLoading(interceptors: InterceptorsInterface) {
  // 请求拦截
  interceptors.request.use(loadingRequestInterceptor);
  // 响应拦截
  interceptors.response.use(
    loadingResponseInterceptor,
    loadingResponseErrorInterceptor,
  );

  function loadingRequestInterceptor(config: AxiosRequestConfig) {
    if (!loading) {
      loading = ElLoading.service({
        target: 'body',
        background: 'transparent',
        text: '载入中',
      });
      store.commit(SET_AXIOS_LOADING, true);
    }
    loadingCount++;

    return config;
  }

  function handleResponseLoading() {
    loadingCount--;
    if (loadingCount === 0) {
      loading.close();
      loading = null;
      store.commit(SET_AXIOS_LOADING, false);
    }
  }

  function loadingResponseInterceptor(response: AxiosResponse) {
    handleResponseLoading();
    return response;
  }

  function loadingResponseErrorInterceptor(e:any) {
    handleResponseLoading();
    throw e;
  }
}
