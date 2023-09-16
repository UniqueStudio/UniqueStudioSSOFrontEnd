import { vitePluginForArco } from '@arco-plugins/vite-vue';

export default function configArcoStyleImportPlugin() {
  const arcoResolverPlugin = vitePluginForArco({});
  return arcoResolverPlugin;
}