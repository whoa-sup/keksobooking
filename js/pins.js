'use strict';

const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;
const pinsList = document.querySelector(`.map__pins`);

/**
 * Отрисовывает метки объявлений на карте
 * @param {Array} ads массив объявлений для отрисовки меток
 */
const renderPins = (ads) => {
  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

  /**
   * Создает DOM-элемент метки объявления
   * @param {Object} ad объект объявления
   * @return {HTMLElement} элемент метки объявления
   */
  const renderPin = (ad) => {
    if (!ad.offer) {
      return false;
    }
    const pinElement = pinTemplate.cloneNode(true);
    const pinImage = pinElement.querySelector(`img`);

    pinElement.style.left = `${ad.location.x - PIN_WIDTH / 2}px`;
    pinElement.style.top = `${ad.location.y - PIN_HEIGHT}px`;
    pinImage.src = ad.author.avatar;
    pinImage.alt = ad.offer.title;
    pinElement.data = ad;

    return pinElement;
  };

  const adsFragment = document.createDocumentFragment();
  for (const ad of ads) {
    adsFragment.append(renderPin(ad));
  }
  pinsList.append(adsFragment);
};

const removePins = () => {
  while (!pinsList.lastElementChild.classList.contains(`map__pin--main`)) {
    pinsList.lastChild.remove();
  }
};

window.pins = {
  render: renderPins,
  remove: removePins,
};
