'use strict';

(() => {
  const ADS_COUNT = 8;
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
  const ads = window.data.generateAds(ADS_COUNT);
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

  window.pins.render(ads);
  window.card.render(ads[0]);
})();
