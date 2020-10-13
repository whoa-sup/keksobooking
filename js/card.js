'use strict';

(() => {
  const FLAT_TYPES = {
    flat: `Квартира`,
    bungalow: `Бунгало`,
    house: `Дом`,
    palace: `Дворец`,
  };
  const mapFiltersContainer = document.querySelector(`.map__filters-container`);
  let isCard = document.querySelector(`.map__card`);

  const removeCard = () => {
    if (isCard) {
      isCard.remove();
    }
  };

  /**
   * Создает DOM-элемент карточки объявления
   * @param {Object} ad объект объявления
   */
  const renderCard = (ad) => {
    removeCard();
    const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
    const cardElement = cardTemplate.cloneNode(true);

    const cardTitle = cardElement.querySelector(`.popup__title`);
    const title = ad.offer.title;
    window.util.renderTextContent(title, cardTitle);

    const cardAddress = cardElement.querySelector(`.popup__text--address`);
    const address = ad.offer.address;
    window.util.renderTextContent(address, cardAddress);

    const cardPrice = cardElement.querySelector(`.popup__text--price`);
    const price = ad.offer.price;
    window.util.renderTextContent(price, cardPrice, price + `₽/ночь`);

    const cardType = cardElement.querySelector(`.popup__type`);
    const type = ad.offer.type;
    window.util.renderTextContent(type, cardType, FLAT_TYPES[type]);

    const cardCapacity = cardElement.querySelector(`.popup__text--capacity`);
    const rooms = ad.offer.rooms;
    const guests = ad.offer.guests;
    if (rooms && guests) {
      cardCapacity.textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
    } else {
      cardCapacity.remove();
    }

    const cardTime = cardElement.querySelector(`.popup__text--time`);
    const checkin = ad.offer.checkin;
    const checkout = ad.offer.checkout;
    if (checkin && checkout) {
      cardTime.textContent = `Заезд после ${ad.offer.checkin}, выезд\u00A0до ${ad.offer.checkout}`;
    } else {
      cardTime.remove();
    }

    const cardFeatures = cardElement.querySelector(`.popup__features`);
    const features = ad.offer.features;
    if (features) {
      cardFeatures.innerHTML = ``;
      features.forEach((feature) => {
        const featureElement = document.createElement(`li`);
        featureElement.classList.add(`popup__feature`, `popup__feature--${feature}`);
        cardFeatures.append(featureElement);
      });
    } else {
      cardFeatures.remove();
    }

    const cardDescription = cardElement.querySelector(`.popup__description`);
    const description = ad.offer.description;
    window.util.renderTextContent(description, cardDescription);

    const cardPhotos = cardElement.querySelector(`.popup__photos`);
    const photoTemplate = cardPhotos.querySelector(`.popup__photo`);
    const photos = ad.offer.photos;
    if (photos) {
      cardPhotos.innerHTML = ``;
      photos.forEach((photo) => {
        const photoElement = photoTemplate.cloneNode(true);
        photoElement.src = photo;
        cardPhotos.append(photoElement);
      });
    } else {
      cardPhotos.remove();
    }

    const cardAvatar = cardElement.querySelector(`.popup__avatar`);
    const avatar = ad.author.avatar;
    if (avatar) {
      cardAvatar.src = avatar;
    } else {
      cardAvatar.remove();
    }

    const cardCloseButton = cardElement.querySelector(`.popup__close`);
    const onCardEscPress = (e) => {
      if (e.key === `Escape`) {
        e.preventDefault();
        document.removeEventListener(`keydown`, onCardEscPress);
        removeCard();
      }
    };
    document.addEventListener(`keydown`, onCardEscPress);
    cardCloseButton.addEventListener(`click`, () => {
      removeCard();
    });
    isCard = cardElement;
    mapFiltersContainer.before(cardElement);
  };

  window.card = {
    render: renderCard,
    remove: removeCard,
  };
})();
