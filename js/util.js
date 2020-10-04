'use strict';

(() => {

  /**
   * Возвращает случайное целое число в заданном промежутке
   * @param {number} min - минимальное значение диапазона
   * @param {number} max - максимальное значение диапазона
   * @return {number} случайное число в диапазоне min - max
   */
  const getRandomNumberFromRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Возвращает случайный элемент массива
   * @param {Array} array - массив из которого необходимо взять случайный элемент
   * @return {*} случайный элемент массива
   */
  const getRandomArrayElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  /**
   * Перемешивает заданный массив в случайном порядке
   * @param {Array} array - массив который необходимо перемешать
   * @return {Array} массив, перемешанный в случайном порядке
   */
  const shuffleArray = (array) => {
    let temp;
    let j;
    for (let i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }
    return array;
  };

  /**
   * Копирует случайное количество элементов массива
   * @param {Array} array - массив из которого необходимо скопировать элементы
   * @return {Array} новый массив произвольной длины
   */
  const copyArrayRandomElements = (array) => array.slice(0, getRandomNumberFromRange(0, array.length - 1));

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

  window.util = {
    getRandomNumberFromRange: getRandomNumberFromRange,
    getRandomArrayElement: getRandomArrayElement,
    shuffleArray: shuffleArray,
    copyArrayRandomElements: copyArrayRandomElements,
    renderTextContent: renderTextContent,
  };
})();