import { mergeConfig, UserConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig({}, baseConfig as UserConfig);
