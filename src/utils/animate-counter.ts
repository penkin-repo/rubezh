/**
 * Утилита для анимации счетчиков с easing и IntersectionObserver
 */

/**
 * Easing функция для плавной анимации
 */
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Анимирует число от 0 до target с easing
 */
export function animateCount(
  element: HTMLElement,
  target: number,
  duration: number = 1400
): void {
  const start = performance.now();

  function update(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(easeOutQuart(progress) * target);
    element.textContent = String(current);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Настройки для IntersectionObserver счетчиков
 */
export interface CounterObserverOptions {
  threshold?: number;
  staggerDelay?: number;
  duration?: number;
}

/**
 * Создает IntersectionObserver для запуска анимации счетчиков при появлении в viewport
 */
export function createCounterObserver(
  selector: string = '.stat-card',
  options: CounterObserverOptions = {}
): IntersectionObserver {
  const {
    threshold = 0.4,
    staggerDelay = 120,
    duration = 1400
  } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const card = entry.target as HTMLElement;
        const target = parseInt(card.dataset.target ?? '0', 10);
        const numberEl = card.querySelector<HTMLElement>('.stat-number');
        
        if (!numberEl) return;

        // Задержка по индексу для эффекта "очереди"
        const index = parseInt(card.dataset.index ?? '0', 10);
        setTimeout(() => animateCount(numberEl, target, duration), index * staggerDelay);

        // Запустить анимацию только один раз
        observer.unobserve(card);
      });
    },
    { threshold }
  );

  return observer;
}

/**
 * Создает IntersectionObserver для scale-анимации карточек
 */
export function createScaleObserver(
  selector: string = '.stat-card',
  options: { threshold?: number; staggerDelay?: number } = {}
): IntersectionObserver {
  const { threshold = 0.2, staggerDelay = 100 } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target as HTMLElement;
        
        if (entry.isIntersecting) {
          const idx = parseInt(card.dataset.index ?? '0', 10);
          setTimeout(() => {
            card.style.transform = 'scale(1) translateY(0)';
            card.style.opacity = '1';
          }, idx * staggerDelay);
        }
      });
    },
    { threshold }
  );

  return observer;
}

/**
 * Инициализирует начальное состояние для scale-анимации
 */
export function initScaleAnimation(selector: string = '.stat-card'): void {
  document.querySelectorAll<HTMLElement>(selector).forEach((card) => {
    card.style.transform = 'scale(0.88) translateY(20px)';
    card.style.opacity = '0';
    card.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease';
  });
}
