<script lang="tsx">
import { defineComponent, ref, h, computed, compile } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
import type { RouteMeta } from 'vue-router';
import { useAppStore } from '@/store';
import { openWindow, regexUrl } from '@/utils';
import { listenerRouteChange } from '@/utils/route-listener';
import useMenuTree from './useMenuTree';

export default defineComponent({
  emit: ['collapse'],
  setup() {
    const { t } = useI18n();
    const appStore = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const { menuTree } = useMenuTree();
    const collapsed = computed({
      get() {
        if (appStore.device === 'desktop') return appStore.menuCollapse;
        return false;
      },
      set(value: boolean) {
        appStore.updateSettings({ menuCollapse: value });
      },
    });
    const topMenu = computed(() => appStore.topMenu);
    const openKeys = ref<string[]>([]);
    const selectedKey = ref<string[]>([]);

    const setCollapse = (val: boolean) => {
      if (appStore.device === 'desktop')
        appStore.updateSettings({ menuCollapse: val });
    };
    const goto = (item: RouteRecordRaw) => {
      // 打开外部链接
      if (regexUrl.test(item.path)) {
        openWindow(item.path);
        selectedKey.value = [item.name as string];
        return;
      }
      // Eliminate external link side effects
      const { hideInMenu, activeMenu } = item.meta as RouteMeta;
      if (route.name === item.name && !hideInMenu && !activeMenu) {
        selectedKey.value = [item.name as string];
        return;
      }
      // 触发路由变化
      router.push({
        name: item.name,
      });
    };
    // menu的open-keys是展开子菜单的key数组
    const findMenuOpenKeys = (target: string) => {
      const result: string[] = [];
      let isFind = false;
      const backtrack = (item: RouteRecordRaw, keys: string[]) => {
        if (item.name === target) {
          isFind = true;
          result.push(...keys);
          return;
        }
        if (item.children?.length) {
          item.children.forEach((el) => {
            backtrack(el, [...keys, el.name as string]);
          });
        }
      };
      menuTree.value.forEach((el: RouteRecordRaw) => {
        if (isFind) return;
        backtrack(el, [el.name as string]);
      });
      console.log(result);
      return result;
    };
    listenerRouteChange((newRoute) => {
      const { requiresAuth, activeMenu, hideInMenu } = newRoute.meta;
      console.log(newRoute.meta);
      if (requiresAuth && (!hideInMenu || activeMenu)) {
        const menuOpenKeys = findMenuOpenKeys(
          (activeMenu || newRoute.name) as string,
        );

        const keySet = new Set([...menuOpenKeys, ...openKeys.value]);
        openKeys.value = [...keySet];

        selectedKey.value = [
          activeMenu || menuOpenKeys[menuOpenKeys.length - 1],
        ];
        console.log(selectedKey.value);
      }
    }, true);
    const renderSubMenu = () => {
      function travel(_route: RouteRecordRaw[], nodes = []) {
        if (_route) {
          _route.forEach((element) => {
            const icon = element?.meta?.icon
              ? () => h(compile(`<${element?.meta?.icon}/>`))
              : null;
            const node =
              element?.children && element?.children.length !== 0 ? (
                <a-sub-menu
                  key={element?.name}
                  v-slots={{
                    icon,
                    title: () =>
                      h(compile(t((element?.meta?.locale as string) || ''))),
                  }}
                >
                  {travel(element?.children)}
                </a-sub-menu>
              ) : (
                <a-menu-item
                  key={element?.name}
                  v-slots={{
                    icon,
                  }}
                  onClick={() => goto(element)}
                >
                  {t((element?.meta?.locale as string) || '')}
                </a-menu-item>
              );
            nodes.push(node as never);
          });
        }
        return nodes;
      }
      return travel(menuTree.value);
    };

    return () => (
      <a-menu
        mode={topMenu.value ? 'horizontal' : 'vertical'}
        v-model:collapsed={collapsed.value}
        v-model:open-keys={openKeys.value}
        show-collapse-button={appStore.device !== 'mobile'}
        auto-open={false}
        selected-keys={selectedKey.value}
        auto-open-selected={true}
        level-indent={34}
        style="height: 100%;width:100%;"
        onCollapse={setCollapse}
      >
        {renderSubMenu()}
      </a-menu>
    );
  },
});
</script>

<style lang="less" scoped>
:deep(.arco-menu-inner) {
  .arco-menu-inline-header {
    display: flex;
    align-items: center;
  }
  .arco-icon {
    &:not(.arco-icon-down) {
      font-size: 18px;
    }
  }
}
</style>
