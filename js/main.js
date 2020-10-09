'use strict';

(() => {
  const MAIN_PIN_FOOT_HEIGHT = 22;
  const ELEMENTS_TO_DISABLE = [
    `.ad-form`,
    `.ad-form fieldset`,
    `.ad-form input`,
    `.ad-form textarea`,
    `.ad-form select`,
    `.ad-form button`,
    `.map__filters input`,
    `.map__filters select`,
    `.map__filters fieldset`,
  ];
  const main = document.querySelector(`main`);
  const map = document.querySelector(`.map`);
  const adForm = document.querySelector(`.ad-form`);
  const disabledElements = document.querySelectorAll(ELEMENTS_TO_DISABLE.join(`, `));
  const mainPin = document.querySelector(`.map__pin--main`);
  const mainPinCenterX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
  const mainPinCenterY = Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2);
  const mainPinBottomY = Math.round(mainPin.offsetTop + mainPin.offsetHeight);
  const addressInput = adForm.querySelector(`#address`);

  addressInput.value = `${mainPinCenterX}, ${mainPinCenterY}`;

  /**
   * Добавляет в DOM сообщение об ошибке, по шаблону #error
   * @param {String} message - текст сообщения
   */
  const renderError = (message) => {
    const errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
    const errorElement = errorTemplate.cloneNode(true);
    const errorMessage = errorElement.querySelector(`.error__message`);
    const errorButton = errorElement.querySelector(`.error__button`);
    errorMessage.textContent = message;
    errorButton.addEventListener(`click`, () => {
      errorElement.remove();
    });
    const onErrorButtonEscPress = (e) => {
      if (e.key === `Escape`) {
        e.preventDefault();
        errorElement.remove();
        document.removeEventListener(`keydown`, onErrorButtonEscPress);
      }
    };
    document.addEventListener(`keydown`, onErrorButtonEscPress);
    main.append(errorElement);
  };

  /**
   * Отрисовывает на карте пины с объявлениями
   * @param {Array} data - массив с данными
   */
  const onSuccessLoad = (data) => {
    const ads = data;
    window.pins.render(data);
    const pins = Array.from(map.querySelectorAll(`.map__pin:not(.map__pin--main)`));

    /**
     * Обработчик клика по пину объявления, добавляет карточку объявления
     * @param {Object} e - объект события
     */
    const onAdsPinClick = (e) => {
      const target = e.target;
      const isPinImage = pins.indexOf(target.parentElement);
      const isPin = pins.indexOf(target);
      if (target && isPin !== -1 || isPinImage !== -1) {
        const cardIndex = isPin === -1 ? isPinImage : isPin;
        window.card.render(ads[cardIndex]);
      }
    };
    map.addEventListener(`click`, onAdsPinClick);
  };

  /**
   * Переводит страницу в неактивное састояние
   */
  const disablePage = () => {
    map.classList.add(`map--faded`);
    adForm.classList.add(`ad-form--disabled`);
    for (const element of disabledElements) {
      element.disabled = true;
    }
    mainPin.addEventListener(`mousedown`, onMainPinMousedown);
    mainPin.addEventListener(`keydown`, onMainPinKeydown);
  };

  /**
   * Переводит страницу в активное состояние
   */
  const activatePage = () => {
    map.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);
    for (const element of disabledElements) {
      element.disabled = false;
    }
    addressInput.value = `${mainPinCenterX}, ${mainPinBottomY + MAIN_PIN_FOOT_HEIGHT}`;
    window.form.check();
    mainPin.removeEventListener(`mousedown`, onMainPinMousedown);
    mainPin.removeEventListener(`keydown`, onMainPinKeydown);
    window.request.load(onSuccessLoad, renderError);
  };

  const onMainPinMousedown = (e) => {
    if (e.button === 0) {
      activatePage();
    }
  };

  const onMainPinKeydown = (e) => {
    if (e.key === `Enter`) {
      activatePage();
    }
  };

  window.addEventListener(`load`, () => {
    disablePage();
  });

})();
