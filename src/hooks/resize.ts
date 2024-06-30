import { ref, computed, onMounted, onUnmounted } from 'vue';

export default function useWindowResize() {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);
  const handleResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };
  const widthType = computed(() => {
    if (width.value <= 640) return 'sm';
    if (width.value <= 960) return 'md';
    return 'lg';
  });

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return {
    width,
    height,
    widthType,
  };
}
