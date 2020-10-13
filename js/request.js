'use strict';

(() => {
  const STATUS_CODE = {
    OK: 200,
  };
  const TIMEOUT_IN_MS = 10000;

  const sendRequest = (method, address, data) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = `json`;
      xhr.open(method, address);
      xhr.addEventListener(`load`, () => {
        if (xhr.status === STATUS_CODE.OK) {
          resolve(xhr.response);
        } else {
          reject(`Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
        }
      });
      xhr.addEventListener(`error`, function () {
        reject(`Произошла ошибка соединения`);
      });
      xhr.addEventListener(`timeout`, function () {
        reject(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
      });

      xhr.timeout = TIMEOUT_IN_MS;
      xhr.send(data);
    });
  };

  window.request = {
    send: sendRequest
  };
})();
