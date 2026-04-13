/**
 * Модуль инициализации PhotoSwipe для галерей проектов
 * Используется в Projects.astro и proekty.astro
 * Все импорты динамические для оптимизации производительности
 */

export interface PhotoSwipeConfig {
  gallery: string;
  children?: string;
  bgOpacity?: number;
  padding?: { top: number; bottom: number; left: number; right: number };
  wheelToZoom?: boolean;
  showHideAnimationType?: 'zoom' | 'fade' | 'none';
}

/**
 * Инициализирует PhotoSwipe галерею с кастомными настройками
 */
export async function initPhotoSwipe(config: Partial<PhotoSwipeConfig> = {}): Promise<any> {
  // Динамический импорт PhotoSwipe и стилей
  const [{ default: PhotoSwipeLightbox }, _, __] = await Promise.all([
    import('photoswipe/lightbox'),
    import('photoswipe/style.css'),
    import('../styles/photoswipe-custom.css')
  ]);
  const defaultConfig: PhotoSwipeConfig = {
    gallery: '.project-gallery',
    children: 'a',
    bgOpacity: 0.9,
    padding: { top: 20, bottom: 20, left: 20, right: 20 },
    wheelToZoom: true,
    showHideAnimationType: 'zoom',
  };

  const finalConfig = { ...defaultConfig, ...config };

  const lightbox = new PhotoSwipeLightbox({
    ...finalConfig,
    pswpModule: () => import('photoswipe'),
  });

  // Регистрируем кастомный caption элемент
  lightbox.on('uiRegister', () => {
    const ui = lightbox.pswp?.ui;
    if (!ui) return;

    ui.registerElement({
      name: 'custom-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '',
      onInit: (el, pswp) => {
        const updateCaption = () => {
          const currSlideElement = pswp.currSlide?.data?.element;
          const captionHTML =
            currSlideElement instanceof HTMLElement
              ? currSlideElement.getAttribute('data-pswp-caption') || ''
              : '';
          el.innerHTML = captionHTML;
        };

        pswp.on('change', updateCaption);
        updateCaption();
      },
    });
  });

  lightbox.init();
  return lightbox;
}

/**
 * Ленивая инициализация PhotoSwipe - загружает библиотеку только при первом клике
 */
export function initPhotoSwipeLazy(
  triggerSelector: string = '.project-item',
  config: Partial<PhotoSwipeConfig> = {}
): void {
  let lightbox: PhotoSwipeLightbox | null = null;
  let isInitialized = false;

  const triggers = document.querySelectorAll(triggerSelector);

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', async (e) => {
      if (!isInitialized) {
        e.preventDefault();
        lightbox = initPhotoSwipe(config);
        isInitialized = true;
        
        // Открываем галерею после инициализации
        setTimeout(() => {
          (trigger as HTMLElement).click();
        }, 100);
      }
    }, { once: true });
  });
}
