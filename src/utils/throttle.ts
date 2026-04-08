/**
 * Утилита для throttling функций (ограничение частоты вызова)
 * Используется для оптимизации обработчиков scroll, resize и т.д.
 */

/**
 * Throttle функция с использованием requestAnimationFrame
 * Гарантирует, что callback выполнится не чаще 60fps
 */
export function throttleRAF<T extends (...args: any[]) => void>(
  callback: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function throttled(...args: Parameters<T>) {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      callback(...args);
      rafId = null;
    });
  };
}

/**
 * Классический throttle с заданным интервалом
 */
export function throttle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 100
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: number | null = null;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      callback(...args);
    } else {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        lastCall = Date.now();
        callback(...args);
      }, delay - timeSinceLastCall);
    }
  };
}
