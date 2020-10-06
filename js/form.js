'use strict';

(() => {
  const FORM_RULES = {
    TITLE: {
      MIN_LENGTH: 30,
      MAX_LENGTH: 100,
    },
    PRICE: {
      MAX_VALUE: 1000000,
    },
    TYPE: {
      MIN_PRICE: {
        bungalow: 0,
        flat: 1000,
        house: 5000,
        palace: 10000,
      },
    },
    ROOMS: {
      CAPACITY: {
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
  titleInput.minLength = FORM_RULES.TITLE.MIN_LENGTH;
  titleInput.maxLength = FORM_RULES.TITLE.MAX_LENGTH;

  // price

  priceInput.required = true;
  priceInput.max = FORM_RULES.PRICE.MAX_VALUE;

  // type

  /**
   * Проверяет соответствие минимальной цены - типу жилья
   */
  const checkPriceValidity = () => {
    const value = typeSelect.value;
    priceInput.min = FORM_RULES.TYPE.MIN_PRICE[value];
    priceInput.placeholder = FORM_RULES.TYPE.MIN_PRICE[value];
  };

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
    if (!FORM_RULES.ROOMS.CAPACITY[rooms].includes(guests)) {
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
