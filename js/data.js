'use strict';

(() => {
  /**
   * Генерирует заданное количество моков объявлений
   * @param {number} count - число необходимых моков
   * @return {Array} массив объявлений
   */
  const generateMockAds = (count) => {
    const map = document.querySelector(`.map`);
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

    const avatarUrls = window.util.shuffleArray(generateAvatarUrls(count));

    const ads = [];
    for (let i = 0; i < count; i++) {
      const ad = {
        author: {
          avatar: `img/avatars/user${avatarUrls[i]}.png`,
        },
        offer: {
          title: window.util.getRandomArrayElement(TITLES),
          price: window.util.getRandomNumberFromRange(MIN_PRICE, MAX_PRICE),
          type: window.util.getRandomArrayElement(TYPES),
          rooms: window.util.getRandomArrayElement(ROOMS_NUMBER),
          guests: window.util.getRandomArrayElement(GUESTS_NUMBER),
          checkin: window.util.getRandomArrayElement(CHECKINS),
          checkout: window.util.getRandomArrayElement(CHECKOUTS),
          features: window.util.copyArrayRandomElements(FEATURES),
          description: window.util.getRandomArrayElement(DESCRIPTIONS),
          photos: window.util.copyArrayRandomElements(PHOTOS),
        },
        location: {
          x: window.util.getRandomNumberFromRange(MIN_X, MAX_X),
          y: window.util.getRandomNumberFromRange(MIN_Y, MAX_Y),
        },
      };
      ad.offer.address = `${ad.location.x}, ${ad.location.y}`;
      ads.push(ad);
    }
    return ads;
  };

  window.data = {
    generateAds: generateMockAds,
  };

})();
