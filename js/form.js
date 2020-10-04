'use strict';

(() => {
  const ROOMS_CAPACITY = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0],
  };
  const adForm = document.querySelector(`.ad-form`);
  const roomsSelect = adForm.querySelector(`#room_number`);
  const capacitySelect = adForm.querySelector(`#capacity`);

  /**
   * Проверяет валидность полей количества комнат и гостей
   */
  const checkRoomsCapacityValidity = () => {
    const rooms = +roomsSelect.value;
    const guests = +capacitySelect.value;
    if (!ROOMS_CAPACITY[rooms].includes(guests)) {
      capacitySelect.setCustomValidity(`Выберите другое количество гостей, не превышающее количества комнат`);
    } else {
      capacitySelect.setCustomValidity(``);
    }
  };

  roomsSelect.addEventListener(`change`, () => {
    checkRoomsCapacityValidity();
  });
  capacitySelect.addEventListener(`change`, () => {
    checkRoomsCapacityValidity();
  });

  window.form = {
    check: checkRoomsCapacityValidity,
  };
})();
