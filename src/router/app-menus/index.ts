import { appRoutes } from '../routes';

// 这里也可以添加外部路由
const mixinRoutes = [...appRoutes];

const appClientMenus = mixinRoutes.map((el) => {
  const { name, path, meta, redirect, children } = el;
  return {
    name,
    path,
    meta,
    redirect,
    children,
  };
});

export default appClientMenus;