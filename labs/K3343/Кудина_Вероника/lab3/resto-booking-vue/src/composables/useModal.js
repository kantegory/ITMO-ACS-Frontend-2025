import { onUnmounted } from 'vue';

export function useModal() {
  const cleanupModal = () => {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
  };

  onUnmounted(() => {
    cleanupModal();
  });

  return { cleanupModal };
}
