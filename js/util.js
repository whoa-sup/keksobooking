'use strict';

/**
 * Debounce
 * @param {Function} func - функция к которой применяется debounce
 * @param {Number} delay - задержка debounce в ms
 * @return {Function} функция которая применяется не чаще чем delay
 */
const debounce = (func, delay) => {
  let timerId;

  return (...args) => {
    const boundFunc = func.bind(null, ...args);
    clearTimeout(timerId);
    timerId = setTimeout(boundFunc, delay);
  };
};

/**
 * Проверяет наличие данных, если они есть - запписывает в элемент textContent, если нет - удаляет элемент
 * @param {string | number} data данные по которым необходимо добавить textContent
 * @param {HTMLElement} element DOM элемент в который необходимо записать textContent
 * @param {string | number} text по-умолчанию = data, дает возможность изменить содержимое textContent
 */
const renderTextContent = (data, element, text = data) => {
  if (data) {
    element.textContent = text;
  } else {
    element.remove();
  }
};

/**
 * При нажатии на ESC вызывает cb
 * @param {event} e - объект события
 * @param {function} cb - callback function
 */
const isEscPressed = (e, cb) => {
  if (e.key === `Escape`) {
    e.preventDefault();
    cb();
  }
};

window.util = {
  debounce,
  renderTextContent,
  isEscPressed,
};
