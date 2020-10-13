'use strict';

(() => {
  const formRules = {
    title: {
      MIN_LENGTH: 30,
      MAX_LENGTH: 100,
    },
    price: {
      MAX_VALUE: 1000000,
    },
    type: {
      minPrice: {
        bungalow: 0,
        flat: 1000,
        house: 5000,
        palace: 10000,
      },
    },
    rooms: {
      capacity: {
        1: [1],
        2: [1, 2],
        3: [1, 2, 3],
        100: [0],
      }
    },
  };

  const adForm = document.querySelector(`.ad-form`);
  const roomsSelect = adForm.querySelector(`#room_number`);
  const capacitySelect = adForm.querySelector(`#capacity`);
  const typeSelect = adForm.querySelector(`#type`);
  const timeOutSelect = adForm.querySelector(`#timeout`);
  const timeInSelect = adForm.querySelector(`#timein`);
  const titleInput = adForm.querySelector(`#title`);
  const addressInput = adForm.querySelector(`#address`);
  const priceInput = adForm.querySelector(`#price`);
  const avatarInput = adForm.querySelector(`#avatar`);
  const imagesInput = adForm.querySelector(`#avatar`);

  // title

  titleInput.required = true;
  titleInput.minLength = formRules.title.MIN_LENGTH;
  titleInput.maxLength = formRules.title.MAX_LENGTH;

  // price

  priceInput.required = true;
  priceInput.max = formRules.price.MAX_VALUE;

  // type

  /**
   * Проверяет соответствие минимальной цены - типу жилья
   */
  const checkPriceValidity = () => {
    const value = typeSelect.value;
    priceInput.min = formRules.type.minPrice[value];
    priceInput.placeholder = formRules.type.minPrice[value];
  };
  checkPriceValidity();

  typeSelect.addEventListener(`change`, () => {
    checkPriceValidity();
  });

  // address

  addressInput.readOnly = true;

  // timeIn timeOut

  const equalValue = (firstElement, secondElement) => {
    secondElement.value = firstElement.value;
  };

  timeInSelect.addEventListener(`change`, () => {
    equalValue(timeInSelect, timeOutSelect);
  });
  timeOutSelect.addEventListener(`change`, () => {
    equalValue(timeOutSelect, timeInSelect);
  });

  // images

  avatarInput.accept = imagesInput.accept = `image/*`;

  // rooms

  /**
   * Проверяет валидность полей количества комнат и гостей
   */
  const checkRoomsCapacityValidity = () => {
    const rooms = +roomsSelect.value;
    const guests = +capacitySelect.value;
    if (!formRules.rooms.capacity[rooms].includes(guests)) {
      capacitySelect.setCustomValidity(`Выберите другое количество гостей, не превышающее количества комнат`);
    } else {
      capacitySelect.setCustomValidity(``);
    }
  };
  checkRoomsCapacityValidity();

  roomsSelect.addEventListener(`change`, () => {
    checkRoomsCapacityValidity();
  });
  capacitySelect.addEventListener(`change`, () => {
    checkRoomsCapacityValidity();
  });
})();
