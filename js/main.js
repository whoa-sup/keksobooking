'use strict';

(() => {
  const ADS_COUNT = 8;
  const map = document.querySelector(`.map`);
  map.classList.remove(`map--faded`);

  /**
   * Генерирует заданное количество моков объявлений
   * @param {number} count число необходимых моков
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
     * Возвращает случайное целое число в заданном промежутке
     * @param {number} min минимальное значение диапазона
     * @param {number} max максимальное значение диапазона
     */

    const randomRange = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Возвращает случайный элемент массива
     * @param {Array} array массив из которого необходимо взять случайный элемент
     */

    const randomElement = (array) => {
      return array[Math.floor(Math.random() * array.length)];
    };

    /**
     * Перемешивает заданный массив в случайном порядке
     * @param {Array} array массив который необходимо перемешать
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
     */

    const copyArray = (array) => {
      const newArray = [];
      const length = randomRange(1, array.length);
      for (let i = 0; i < length; i++) {
        newArray.push(array[i]);
      }
      return newArray;
    };

    /**
     * Генерирует массив номеров аватаров
     * @param {number} size количество номеров аватаров
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

  const renderPins = (ads) => {
    const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
    const pinsList = document.querySelector(`.map__pins`);

    /**
     * Создает DOM-элемент метки объявления
     * @param {Object} ad объект объявления
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

    const adsFragment = document.createDocumentFragment();
    for (const ad of ads) {
      adsFragment.appendChild(renderPin(ad));
    }
    pinsList.appendChild(adsFragment);
  };

  const ads = generateMockADS(ADS_COUNT);
  renderPins(ads);
})();
