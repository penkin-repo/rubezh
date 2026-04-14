/**
 * Утилита для маски телефона в формате 8 (___) ___-__-__
 * Обрабатывает ввод, вставку из буфера обмена и корректно работает с номерами +7
 */

export interface PhoneMaskOptions {
  onInput?: (formatted: string, raw: string) => void;
}

export class PhoneMask {
  private input: HTMLInputElement;
  private options: PhoneMaskOptions;

  constructor(input: HTMLInputElement, options: PhoneMaskOptions = {}) {
    this.input = input;
    this.options = options;
    this.init();
  }

  private init() {
    this.input.addEventListener('input', this.handleInput.bind(this));
    this.input.addEventListener('paste', this.handlePaste.bind(this));
  }

  private handleInput(e: Event) {
    const input = this.input;
    const selStart = input.selectionStart ?? input.value.length;
    const oldValue = input.value;

    const formatted = this.formatPhone(oldValue);

    // Вычисляем сдвиг курсора на основе разницы длин
    const diff = formatted.length - oldValue.length;
    const newCursor = Math.max(0, selStart + diff);

    input.value = formatted;

    // Восстанавливаем позицию курсора
    input.setSelectionRange(newCursor, newCursor);

    if (this.options.onInput) {
      const raw = this.getRawPhone(formatted);
      this.options.onInput(formatted, raw);
    }
  }

  private handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const pastedText = e.clipboardData?.getData('text') || '';
    const formatted = this.formatPhone(pastedText);
    this.input.value = formatted;
    
    // Trigger input event для валидации
    this.input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private formatPhone(value: string): string {
    // Удаляем все нецифровые символы
    let raw = value.replace(/\D/g, '');
    
    // Обрабатываем номера, начинающиеся с +7 или 7
    if (raw.startsWith('7')) {
      raw = '8' + raw.slice(1);
    }
    
    // Если номер не начинается с 8 и не пустой, добавляем 8
    if (!raw.startsWith('8') && raw.length > 0) {
      raw = '8' + raw;
    }
    
    // Ограничиваем длину до 11 цифр
    raw = raw.slice(0, 11);
    
    // Форматируем: 8 (___) ___-__-__
    let formatted = '8';
    if (raw.length > 1) {
      formatted += ' (' + raw.slice(1, 4);
    }
    if (raw.length >= 4) {
      formatted += ') ' + raw.slice(4, 7);
    }
    if (raw.length >= 7) {
      formatted += '-' + raw.slice(7, 9);
    }
    if (raw.length >= 9) {
      formatted += '-' + raw.slice(9, 11);
    }
    
    return formatted;
  }

  /**
   * Получить "сырой" номер телефона (только цифры)
   */
  public getRawPhone(formatted?: string): string {
    const value = formatted || this.input.value;
    return value.replace(/\D/g, '');
  }

  /**
   * Проверить, заполнен ли номер полностью
   */
  public isComplete(): boolean {
    return this.getRawPhone().length === 11;
  }

  /**
   * Очистить маску
   */
  public destroy() {
    this.input.removeEventListener('input', this.handleInput.bind(this));
    this.input.removeEventListener('paste', this.handlePaste.bind(this));
  }
}

/**
 * Простая функция для одноразового форматирования
 */
export function formatPhoneNumber(value: string): string {
  let raw = value.replace(/\D/g, '');
  
  if (raw.startsWith('7')) {
    raw = '8' + raw.slice(1);
  }
  
  if (!raw.startsWith('8') && raw.length > 0) {
    raw = '8' + raw;
  }
  
  raw = raw.slice(0, 11);
  
  let formatted = '8';
  if (raw.length > 1) formatted += ' (' + raw.slice(1, 4);
  if (raw.length >= 4) formatted += ') ' + raw.slice(4, 7);
  if (raw.length >= 7) formatted += '-' + raw.slice(7, 9);
  if (raw.length >= 9) formatted += '-' + raw.slice(9, 11);
  
  return formatted;
}
