'use strict';

const main = document.querySelector(`main`);
const errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
const errorElement = errorTemplate.cloneNode(true);
const errorMessage = errorElement.querySelector(`.error__message`);
const errorDefaultMessage = errorMessage.textContent;
const errorButton = errorElement.querySelector(`.error__button`);
const successTemplate = document.querySelector(`#success`).content.querySelector(`.success`);
const successElement = successTemplate.cloneNode(true);

/**
 * Добавляет в DOM сообщение об ошибке, по шаблону #error
 * @param {String} message - текст сообщения
 */
const renderErrorMessage = (message) => {
  errorMessage.textContent = message ? message : errorDefaultMessage;
  errorButton.addEventListener(`click`, () => {
    errorElement.remove();
  });

  /**
   * Обработчик нажатия кнопки ESC при открытом сообщении об ошибке
   * @param {event} e - объект события
   */
  const onErrorEscPress = (e) => {
    window.util.isEscPressed(e, closeError);
  };

  /**
   * Удаляет сообщение об ошибке из DOM и его обработчики
   */
  const closeError = () => {
    errorElement.remove();
    document.removeEventListener(`keydown`, onErrorEscPress);
  };

  errorElement.addEventListener(`click`, () => {
    closeError();
  });
  document.addEventListener(`keydown`, onErrorEscPress);
  main.append(errorElement);
};

/**
 * Добавляет в DOM сообщение о успешной отправке объявления, по шаблону #error
 */
const renderSuccessMessage = () => {
  /**
   * Обработчик нажатия кнопки ESC при открытом сообщении
   * @param {event} e - объект события
   */
  const onSuccessEscPress = (e) => {
    window.util.isEscPressed(e, closeSuccess);
  };

  /**
   * Удаляет сообщение и его обработчики из DOM
   */
  const closeSuccess = () => {
    successElement.remove();
    document.removeEventListener(`keydown`, onSuccessEscPress);
  };

  successElement.addEventListener(`click`, () => {
    closeSuccess();
  });
  document.addEventListener(`keydown`, onSuccessEscPress);
  main.append(successElement);
};

window.message = {
  addError: renderErrorMessage,
  addSuccess: renderSuccessMessage,
};
