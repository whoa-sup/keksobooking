'use strict';

const FormRules = {
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
const imagesInput = adForm.querySelector(`#images`);
const avatarPreview = adForm.querySelector(`.ad-form-header__preview img`);
const photoPreview = adForm.querySelector(`.ad-form__photo`);
const imagesRegExp = /image\/(jpeg|jpg|png|gif)/;

// title

titleInput.required = true;
titleInput.minLength = FormRules.title.MIN_LENGTH;
titleInput.maxLength = FormRules.title.MAX_LENGTH;

// price

priceInput.required = true;
priceInput.max = FormRules.price.MAX_VALUE;

// type

/**
 * Проверяет соответствие минимальной цены - типу жилья
 */
const checkPriceValidity = () => {
  const value = typeSelect.value;
  priceInput.min = FormRules.type.minPrice[value];
  priceInput.placeholder = FormRules.type.minPrice[value];
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

/**
 * Если данные переданные в inputElement подходят под список расширений
 * то вызывает resolve, усди нет то reject
 * @param {HTMLElement} inputElement - input в котором выбирается файл
 * @return {Promise}
 */
const changeImages = function (inputElement) {
  const imageFile = inputElement.files[0];

  return new Promise((resolve, reject) => {

    if (imageFile.type.match(imagesRegExp)) {
      const reader = new FileReader();

      reader.addEventListener(`load`, () => {
        resolve(reader.result);
      });

      reader.readAsDataURL(imageFile);
    } else {
      reject(`Фотография должна быть в формате jpg, png или gif`);
    }
  });
};

// avatar

avatarInput.addEventListener(`change`, () => {
  changeImages(avatarInput)
    .then((result) => {
      avatarPreview.src = result;
    })
    .catch(window.message.addError);
});

// Ad images

photoPreview.style.backgroundSize = `contain`;

imagesInput.addEventListener(`change`, () => {
  changeImages(imagesInput)
    .then((result) => {
      photoPreview.style.backgroundImage = `url(${result})`;
    })
    .catch(window.message.addError);
});

// rooms

/**
 * Проверяет валидность полей количества комнат и гостей
 */
const checkRoomsCapacityValidity = () => {
  const rooms = +roomsSelect.value;
  const guests = +capacitySelect.value;
  if (!FormRules.rooms.capacity[rooms].includes(guests)) {
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
