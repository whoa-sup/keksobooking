'use strict';

(() => {
  const ADS_COUNT = 8;
  const map = document.querySelector(`.map`);
  map.classList.remove(`map--faded`);

  /**
   * Возвращает случайное целое число в заданном промежутке
   * @param {number} min минимальное значение диапазона
   * @param {number} max максимальное значение диапазона
   * @return {number} случайное число в диапазоне min - max
   */
  const randomRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Возвращает случайный элемент массива
   * @param {Array} array массив из которого необходимо взять случайный элемент
   * @return {number|string|object|array} случайный элемент массива
   */
  const randomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  /**
   * Перемешивает заданный массив в случайном порядке
   * @param {Array} array массив который необходимо перемешать
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
   * @param {Array} array массив из которого необходимо скопировать элементы
   * @return {Array} новый массив произвольной длины
   */
  const copyArray = (array) => array.slice(0, randomRange(0, array.length - 1));

  /**
   * Генерирует заданное количество моков объявлений
   * @param {number} count число необходимых моков
   * @return {Array} массив объявлений
   */
  const generateMockADS = (count) => {
    const TITLES = [
      `Мило, уютно`,
      `Мило,но дорого`,
      `Неуютно, но снимите`,
      `Просто объявление`,
      `Ужасно дорого`,
      `Не стоит снимать у меня квартиру`,
    ];
    const DESCRIPTIONS = [
      `О господи, какое это замечательно жилье`,
      `Квартира то замечательная, но соседи просто ад`,
      `В окне на против вы сможете увидеть - ничего не сможете увидеть`,
      `Терпеть не могу придумывать описания для всяких вещей`,
      `ААААААААААА, снимите, срочно нужны деньги`,
    ];
    const TYPES = [
      `palace`,
      `flat`,
      `house`,
      `bungalow`,
    ];
    const FEATURES = [
      `wifi`,
      `dishwasher`,
      `parking`,
      `washer`,
      `elevator`,
      `conditioner`,
    ];
    const PHOTOS = [
      `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
      `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
      `http://o0.github.io/assets/images/tokyo/hotel3.jpg`,
    ];
    const ROOMS_NUMBER = [1, 2, 3, 100];
    const GUESTS_NUMBER = [1, 2, 3, 0];
    const CHECKINS = [`12:00`, `13:00`, `14:00`];
    const CHECKOUTS = [`12:00`, `13:00`, `14:00`];
    const MIN_PRICE = 0;
    const MAX_PRICE = 10000;
    const MIN_X = 0;
    const MAX_X = map.offsetWidth;
    const MIN_Y = 130;
    const MAX_Y = 630;

    /**
     * Генерирует массив номеров аватаров
     * @param {number} size количество номеров аватаров
     * @return {Array} масиив строк типа "0" + number, заданной длины
     */
    const generateAvatarUrls = (size) => {
      const array = [];
      for (let i = 1; i <= size; i++) {
        array.push(`0` + i);
      }
      return array;
    };

    const avatarUrls = shuffleArray(generateAvatarUrls(count));

    const ads = [];
    for (let i = 0; i < count; i++) {
      const ad = {
        author: {
          avatar: `img/avatars/user${avatarUrls[i]}.png`,
        },
        offer: {
          title: randomElement(TITLES),
          price: randomRange(MIN_PRICE, MAX_PRICE),
          type: randomElement(TYPES),
          rooms: randomElement(ROOMS_NUMBER),
          guests: randomElement(GUESTS_NUMBER),
          checkin: randomElement(CHECKINS),
          checkout: randomElement(CHECKOUTS),
          features: copyArray(FEATURES),
          description: randomElement(DESCRIPTIONS),
          photos: copyArray(PHOTOS),
        },
        location: {
          x: randomRange(MIN_X, MAX_X),
          y: randomRange(MIN_Y, MAX_Y),
        },
      };
      ad.offer.address = `${ad.location.x}, ${ad.location.y}`;
      ads.push(ad);
    }

    return ads;
  };

  /**
   * Отрисовывает метки объявлений на карте
   * @param {Array} ads массив объявлений для отрисовки меток
   */
  const renderAds = (ads) => {
    const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
    const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
    const pinsList = document.querySelector(`.map__pins`);

    /**
     * Создает DOM-элемент метки объявления
     * @param {Object} ad объект объявления
     * @return {HTMLElement} элемент метки объявления
     */
    const renderPin = (ad) => {
      const pinElement = pinTemplate.cloneNode(true);
      const PIN_WIDTH = 50;
      const PIN_HEIGHT = 70;

      pinElement.style.left = `${ad.location.x - PIN_WIDTH / 2}px`;
      pinElement.style.top = `${ad.location.y - PIN_HEIGHT}px`;
      pinElement.querySelector(`img`).src = ad.author.avatar;
      pinElement.querySelector(`img`).alt = ad.offer.title;

      return pinElement;
    };

    /**
     * Создает DOM-элемент карточки объявления
     * @param {Object} ad объект объявления
     * @return {HTMLElement} элемент карточки объявления
     */
    const renderCard = (ad) => {
      const cardElement = cardTemplate.cloneNode(true);

      const cardTitle = cardElement.querySelector(`.popup__title`);
      const title = ad.offer.title;
      if (title) {
        cardTitle.textContent = title;
      } else {
        cardTitle.remove();
      }

      const cardAddress = cardElement.querySelector(`.popup__text--address`);
      const address = ad.offer.address;
      if (address) {
        cardAddress.textContent = address;
      } else {
        cardAddress.remove();
      }

      const cardPrice = cardElement.querySelector(`.popup__text--price`);
      const price = ad.offer.price;
      if (price) {
        cardPrice.textContent = price + `₽/ночь`;
      } else {
        cardPrice.remove();
      }

      const cardType = cardElement.querySelector(`.popup__type`);
      const type = ad.offer.type;
      if (type) {
        switch (type) {
          case `flat`:
            cardType.textContent = `Квартира`;
            break;
          case `bungalow`:
            cardType.textContent = `Бунгало`;
            break;
          case `house`:
            cardType.textContent = `Дом`;
            break;
          case `palace`:
            cardType.textContent = `Дворец`;
            break;
          default:
            cardType.textContent = `Неверный тип размещения`;
            break;
        }
      } else {
        cardType.remove();
      }

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
      if (description) {
        cardDescription.textContent = description;
      } else {
        cardDescription.remove();
      }

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

      return cardElement;
    };

    const adsFragment = document.createDocumentFragment();
    for (const ad of ads) {
      adsFragment.append(renderPin(ad));
      adsFragment.append(renderCard(ad));
    }
    pinsList.append(adsFragment);
  };

  const ads = generateMockADS(ADS_COUNT);
  renderAds(ads);
})();
