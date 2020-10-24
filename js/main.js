'use strict';

const DEBOUNCE_INTERVAL = 500; // ms
const MAIN_MOUSE_BUTTON_KEYCODE = 0;
const DisableClasses = {
  AD_FORM_ELEMENTS: [
    `.ad-form`,
    `.ad-form fieldset`,
    `.ad-form input`,
    `.ad-form textarea`,
    `.ad-form select`,
    `.ad-form button`,
  ],
  MAP_FILTERS_ELEMENTS: [
    `.map__filters input`,
    `.map__filters select`,
    `.map__filters fieldset`,
  ],
};
const MAIN_PIN_FOOT_HEIGHT = 22; // px
const Url = {
  GET: `https://21.javascript.pages.academy/keksobooking/data`,
  POST: `https://21.javascript.pages.academy/keksobooking`,
};
const Coordinates = {
  MIN_Y: 130,
  MAX_Y: 630,
};
const map = document.querySelector(`.map`);
const filtersForm = map.querySelector(`.map__filters`);
const adForm = document.querySelector(`.ad-form`);
const adFormResetButton = adForm.querySelector(`.ad-form__reset`);
const adFormElementsToDisable = document.querySelectorAll(DisableClasses.AD_FORM_ELEMENTS.join(`, `));
const mapFiltersElementsToDisable = document.querySelectorAll(DisableClasses.MAP_FILTERS_ELEMENTS.join(`, `));
const mainPin = document.querySelector(`.map__pin--main`);
const addressInput = adForm.querySelector(`#address`);
let isActive = false;

const mainPinLimits = {
  minY: Coordinates.MIN_Y - mainPin.offsetHeight - MAIN_PIN_FOOT_HEIGHT,
  maxY: Coordinates.MAX_Y - mainPin.offsetHeight - MAIN_PIN_FOOT_HEIGHT,
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
  for (const element of mapFiltersElementsToDisable) {
    element.disabled = false;
  }
  const ads = window.filter(data);
  window.pins.render(ads);

  /**
   * Обработчик клика по пину объявления, добавляет карточку объявления
   * @param {Object} e - объект события
   */
  const onAdsPinClick = (e) => {
    const target = e.target;
    const isPin = target.classList.contains(`map__pin`);
    const isMainPin = target.classList.contains(`map__pin--main`);
    const isPinImage = target.parentElement.classList.contains(`map__pin`);
    const isMainPinImage = target.parentElement.classList.contains(`map__pin--main`);
    if (!isMainPin && !isMainPinImage && (isPin || isPinImage)) {
      window.card.render(isPin ? target.data : target.parentElement.data);
    }
  };
  map.addEventListener(`click`, onAdsPinClick);

  /**
   * Обработчик смены фильтров
   * Удаляет пины и карточку, затем перерисовывает по отфильтрованнным данным
   */
  const onFilterFormChange = window.util.debounce(() => {
    window.pins.remove();
    window.card.remove();
    const newAds = window.filter(data);
    window.pins.render(newAds);
  }, DEBOUNCE_INTERVAL);

  filtersForm.addEventListener(`change`, onFilterFormChange);
};

/**
 * При ошибке загрузки выводит сообщение
 * @param {String} message - текст сообщения об ошибке
 */
const onErrorLoad = (message) => {
  window.message.addError(message);
};

/**
 * Переводит страницу в неактивное састояние
 */
const disablePage = () => {
  isActive = false;
  // Добавляем классы
  map.classList.add(`map--faded`);
  adForm.classList.add(`ad-form--disabled`);
  for (const element of adFormElementsToDisable) {
    element.disabled = true;
  }
  for (const element of mapFiltersElementsToDisable) {
    element.disabled = true;
  }
  // Сбрасываем формы
  adForm.reset();
  window.form.check();
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
  for (const element of adFormElementsToDisable) {
    element.disabled = false;
  }
  window.request.send(`GET`, Url.GET)
      .then(onSuccessLoad)
      .catch(onErrorLoad);
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
  if (e.button === MAIN_MOUSE_BUTTON_KEYCODE && !isActive) {
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
 * При успешной отправке данных на сервер переводит страницу в неактивное состояние
 * и добавляет сообщение об отправке в DOM
 */
const onErrorUpload = () => {
  window.message.addError();
};

/**
 * Отправляет данные из формы с помощью xhr
 * @param {Object} e - объект события
 */
const onAdFormSubmit = (e) => {
  e.preventDefault();
  window.request.send(`POST`, Url.POST, new FormData(adForm))
    .then(onSuccessUpload)
    .catch(onErrorUpload);
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
