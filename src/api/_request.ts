import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import { HttpRes } from '@/constants/httpMsg/_httpResTemplate';
import { Message } from '@arco-design/web-vue';
import i18n from '@/locale';
import { HR_BASE_URL } from '@/constants';

// const { t } = useI18n();

export default function request<T = object>(config: AxiosRequestConfig) {
  const instance: AxiosInstance = axios.create({
    baseURL: HR_BASE_URL,
    timeout: 60000,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (
      internalConfig: InternalAxiosRequestConfig,
    ): InternalAxiosRequestConfig => {
      return internalConfig;
    },
    (err: any): any => {
      console.error(err);
      Message.error(err.message);
    },
  );

  instance.interceptors.response.use(
    // 这一部分没按响应拦截器的标准ts类型来，待优化。
    (response) => {
      // data的类型是 HttpRes
      const data = response.data || {};
      if (response.status === 200) {
        return data;
      }
      if (data.msg) {
        Message.error(data.msg);
      } else {
        console.error('# error', { response });
        Message.error(i18n.global.t('request.unknowErr'));
      }
      return null;
    },
    (err: any): any => {
      console.error(err);
      if (err.response?.data?.msg) {
        Message.error(err.response.data.msg);
      } else {
        Message.error(err.message);
      }
      return null;
    },
  );

  return new Promise<HttpRes<T>>((resolve, reject) => {
    // 这里的res的类型为 data ｜ null ，在请求的时候记得判断是否为null
    instance(config).then(
      (res) => {
        resolve(res as unknown as HttpRes<T>);
      },
      (reason) => {
        reject(reason);
      },
    );
  });
}
