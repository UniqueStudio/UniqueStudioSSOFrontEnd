import axios ,{ AxiosRequestConfig ,AxiosInstance ,InternalAxiosRequestConfig} from 'axios';

import { HttpRes } from '@/constants/httpMsg/_httpResTemplate';
import { Message } from '@arco-design/web-vue';
import i18n from '@/locale';
import { SERVER_BASE_URL} from '@/constants';

//const { t } = useI18n();

export default function request<T = {}>(
  config:AxiosRequestConfig
){
  const instance:AxiosInstance = axios.create({
    baseURL:SERVER_BASE_URL,
    timeout:60000,
    withCredentials:true,
  });

  instance.interceptors.request.use(
    (config:InternalAxiosRequestConfig):InternalAxiosRequestConfig => {
      return config;
    },
    (err:any):any => {
      console.error(err);
      Message.error(err.message);
    }
  );

  instance.interceptors.response.use(
    // 这一部分没按响应拦截器的标准ts类型来，待优化。
    (response) => {
      // data的类型是 HttpRes
      const data = response.data || {};
      if (response.status === 200) {
        return data;
      } else {
        if (data.message) {
          Message.error(data.message);
        } else {
          console.error("# error", { response });
          Message.error(i18n.global.t('request.unknowErr'));
        }
        return null;
      }
    },
    (err:any):any => {
      console.error(err);
      if(err.response.data.message){
        Message.error(err.response.data.message);
      } else {
        Message.error(err.message);
      }
      return null;
    }
  );

  return new Promise<HttpRes<T>>(async (resolve) => {
    // 这里的res的类型为 data ｜ null ，在请求的时候记得判断是否为null
    const res = await instance(config);
    resolve((res as unknown) as HttpRes<T>);
  })
}