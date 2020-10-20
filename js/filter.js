'use strict';

(() => {
  const MAX_ADS_COUNT = 5;
  const filterTypeSelect = document.querySelector(`#housing-type`);
  const filterRoomsSelect = document.querySelector(`#housing-rooms`);
  const filterGuestsSelect = document.querySelector(`#housing-guests`);
  const filterPriceSelect = document.querySelector(`#housing-price`);
  const filterFeaturesCollection = document.querySelectorAll(`#housing-features input[type="checkbox"]`);

  const filterRules = {
    'housing-type': {
      elem: filterTypeSelect,
      isMatches: function (data) {
        return (this.elem.value === `any`) ? true : this.elem.value === data.offer.type;
      },
    },
    'housing-rooms': {
      elem: filterRoomsSelect,
      isMatches: function (data) {
        return (this.elem.value === `any`) ? true : this.elem.value === data.offer.rooms.toString();
      },
    },
    'housing-guests': {
      elem: filterGuestsSelect,
      isMatches: function (data) {
        return (this.elem.value === `any`) ? true : this.elem.value === data.offer.guests.toString();
      },
    },
    'housing-price': {
      elem: filterPriceSelect,
      map: {
        low: {
          start: 0,
          end: 10000
        },
        middle: {
          start: 10000,
          end: 50000
        },
        high: {
          start: 50000,
          end: Infinity
        },
      },
      isMatches: function (data) {
        return (this.elem.value === `any`) ? true : data.offer.price >= this.map[this.elem.value].start && data.offer.price <= this.map[this.elem.value].end;
      },
    },
    'housing-features': {
      checkboxes: filterFeaturesCollection,
      isMatches: function (data) {
        let match = true;
        for (const checkbox of this.checkboxes) {
          if (match) {
            match = checkbox.checked === false ? true : data.offer.features.includes(checkbox.value);
          }
        }
        return match;
      },
    },
  };

  /**
   * Возвращает отфильтрованный массив с количеством элементов не более MAX_ADS_COUNT
   * @param {Array} data - массив который необходимо отфильтровать
   * @return {Array} - Отфильтрованный массив
   */
  const filterData = (data) => {
    const filteredData = [];

    for (let i = 0; i < data.length; i++) {
      if (filteredData.length < MAX_ADS_COUNT) {
        let flag = true;
        for (const rule in filterRules) {
          if (flag) {
            flag = filterRules[rule].isMatches(data[i]);
          }
        }
        if (flag) {
          filteredData.push(data[i]);
        }
      }
    }

    return filteredData;
  };

  window.filter = filterData;
})();
