'use strict';

(() => {
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
  const MAIN_PIN_FOOT_HEIGHT = 22;
  const COORDINATES = {
    MIN_Y: 130,
    MAX_Y: 630,
  };
  const map = document.querySelector(`.map`);
  const filtersForm = map.querySelector(`.map__filters`);
  const adForm = document.querySelector(`.ad-form`);
  const adFormResetButton = adForm.querySelector(`.ad-form__reset`);
  const disabledElements = document.querySelectorAll(ELEMENTS_TO_DISABLE.join(`, `));
  const mainPin = document.querySelector(`.map__pin--main`);
  const addressInput = adForm.querySelector(`#address`);
  let isActive = false;

  const mainPinLimits = {
    minY: COORDINATES.MIN_Y - mainPin.offsetHeight - MAIN_PIN_FOOT_HEIGHT,
    maxY: COORDINATES.MAX_Y - mainPin.offsetHeight - MAIN_PIN_FOOT_HEIGHT,
    minX: 0 - mainPin.offsetWidth / 2,
    maxX: map.offsetWidth - mainPin.offsetWidth / 2,
  };
  const mainPinDefaultPosition = {
    left: mainPin.style.left,
    top: mainPin.style.top,
  };

  /**
   * Заполняет поле адреса в зависимости от того активна ли страница
   * @param {Boolean} isPageActive - флаг указывающий на то активна ли страница
   */
  const fillAddress = (isPageActive) => {
    const mainPinCenterX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
    const mainPinCenterY = Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2);
    const mainPinBottomY = Math.round(mainPin.offsetTop + mainPin.offsetHeight);
    addressInput.value = isPageActive ? `${mainPinCenterX}, ${mainPinBottomY + MAIN_PIN_FOOT_HEIGHT}` : `${mainPinCenterX}, ${mainPinCenterY}`;
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
    isActive = false;
    // Добавляем классы
    map.classList.add(`map--faded`);
    adForm.classList.add(`ad-form--disabled`);
    for (const element of disabledElements) {
      element.disabled = true;
    }
    // Сбрасываем формы
    adForm.reset();
    filtersForm.reset();
    // Возвращаем пин
    mainPin.style.left = mainPinDefaultPosition.left;
    mainPin.style.top = mainPinDefaultPosition.top;
    // Корректируем адрес
    fillAddress(isActive);
    // Удаляем пины и карточки
    window.pins.remove();
    window.card.remove();
    // Event Listeners
    mainPin.addEventListener(`keydown`, onMainPinKeydown);
    adForm.removeEventListener(`submit`, onAdFormSubmit);
    adFormResetButton.removeEventListener(`click`, onResetButtonClick);
  };

  /**
   * Переводит страницу в активное состояние
   */
  const activatePage = () => {
    isActive = true;
    map.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);
    for (const element of disabledElements) {
      element.disabled = false;
    }
    window.request.load(onSuccessLoad, window.message.addError);
    // Event listeners
    mainPin.removeEventListener(`keydown`, onMainPinKeydown);
    adForm.addEventListener(`submit`, onAdFormSubmit);
    adFormResetButton.addEventListener(`click`, onResetButtonClick);
  };

  const onMainPinKeydown = (e) => {
    if (e.key === `Enter`) {
      activatePage();
      fillAddress(isActive);
    }
  };

  mainPin.addEventListener(`mousedown`, (e) => {
    e.preventDefault();
    if (e.button === 0 && !isActive) {
      activatePage();
    }

    let startCoords = {
      x: e.clientX,
      y: e.clientY,
    };

    const onMouseMove = (moveEvt) => {
      moveEvt.preventDefault();
      const shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };
      const newCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y,
      };

      newCoords.y = newCoords.y <= mainPinLimits.minY ? mainPinLimits.minY : newCoords.y;
      newCoords.y = newCoords.y >= mainPinLimits.maxY ? mainPinLimits.maxY : newCoords.y;
      newCoords.x = newCoords.x <= mainPinLimits.minX ? mainPinLimits.minX : newCoords.x;
      newCoords.x = newCoords.x >= mainPinLimits.maxX ? mainPinLimits.maxX : newCoords.x;

      mainPin.style.top = `${newCoords.y}px`;
      mainPin.style.left = `${newCoords.x}px`;
      fillAddress(isActive);

    };

    const onMouseUp = (upEvt) => {
      upEvt.preventDefault();
      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
      fillAddress(isActive);
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  });

  /**
   * При успешной отправке данных на сервер переводит страницу в неактивное состояние
   * и добавляет сообщение об отправке в DOM
   */
  const onSuccessUpload = () => {
    window.message.addSuccess();
    disablePage();
  };

  /**
   * Отправляет данные из формы с помощью xhr
   * @param {Object} e - объект события
   */
  const onAdFormSubmit = (e) => {
    e.preventDefault();
    window.request.upload(new FormData(adForm), onSuccessUpload, window.message.addError);
  };

  /**
   * При клике на кнопку сброса переводит страницу в неактивное состояние
   */
  const onResetButtonClick = () => {
    disablePage();
  };

  window.addEventListener(`load`, () => {
    disablePage();
  });

})();
