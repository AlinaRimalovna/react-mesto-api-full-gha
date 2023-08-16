 class Api {
  constructor({ url, headers }) {
    this._url = url;
    this._headers = headers
  }
  _checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      credentials: 'include',
      headers: this._headers
    })
    .then(this._checkResponse);
  }
  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      credentials: 'include',
      headers: this._headers
    })
    .then(this._checkResponse);
  }

  changeUserInfo(name, about) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({ name, about })
    })
    .then(this._checkResponse);
  }
  addNewCard(name, link) {
    return fetch(`${this._url}/cards`, {
      method: "POST",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({ name, link })
    })
    .then(this._checkResponse);
  }
  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      credentials: 'include',
      headers: this._headers,
    })
    .then(this._checkResponse);
  }

  changeAvatar(avatar) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({ avatar })
    })
    .then(this._checkResponse);
  }
  changeLikeCardStatus(cardId, isLiked)  {
    if(isLiked) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "PUT",
      credentials: 'include',
      headers: this._headers,
    })
    .then(this._checkResponse);
  } else {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "DELETE",
      credentials: 'include',
      headers: this._headers,
    })
    .then(this._checkResponse);
  }
  }
}

export const api = new Api({
  url: 'https://api.alina-mesto.nomoreparties.co',
  headers: {
    // authorization: 'af28987c-eb8f-466e-946d-63fad4a279ae',
    'Content-Type': 'application/json'
  }
});

// https://mesto.nomoreparties.co/v1/cohort-65

// http://localhost:4000