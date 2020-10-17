'use strict';

(() => {
  const MAX_ADS_COUNT = 5;
  const filterTypeSelect = document.querySelector(`#housing-type`);
  const filterRoomsSelect = document.querySelector(`#housing-rooms`);

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
    }
  };

  /**
   * Возвращает отфильтрованный массив с количеством элементов не более MAX_ADS_COUNT
   * @param {Array} data - массив который необходимо отфильтровать
   * @return {Array} - Отфильтрованный массив
   */
  const filterData = (data) => {
    let filteredData = data.filter((ad) => {
      let flag = true;
      for (const rule in filterRules) {
        if (flag) {
          flag = filterRules[rule].isMatches(ad);
        }
      }
      return flag;
    });

    return filteredData.splice(0, MAX_ADS_COUNT);
  };

  window.filter = filterData;
})();
