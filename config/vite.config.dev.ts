import { mergeConfig, UserConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    server: {
      proxy: {
        '^/api': {
          target: 'https://dev.back.recruitment2023.hustunique.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          cookieDomainRewrite: {
            '*': 'hustunique.com',
          },
        },
      },
      Credential: true,
    },
  },
  baseConfig as UserConfig,
);
