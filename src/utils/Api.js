class Api {
    constructor ({baseUrl, token}) {
        this._baseUrl = baseUrl;
        this._token = token;
    }

    _getResponseData(res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json()
    } 

    getProfileInfo () {
        return fetch(`${this._baseUrl}/users/me`, {
        headers: {
            authorization: this._token}
        })
        .then(res => this._getResponseData(res))
            
    }

    patchProfileInfo (newName, newAbout) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newName,
                about: newAbout
            })
        })
        .then(res=> this._getResponseData(res))
    }

    getCardsData () {
        return fetch(`${this._baseUrl}/cards`, {
        headers: {
            authorization: this._token}
        })
        .then(res => this._getResponseData(res))
    }

    makeNewCardData (name, link) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                link: link
            })
        })
        .then(res => this._getResponseData(res))
    }

    deleteCardData (cardId) {
       return fetch(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                authorization: this._token,
            }
        })
        .then(res => this._getResponseData(res))
    }

    makeLike (cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'PUT',
            headers: {
                authorization: this._token,
            }
        })
        .then(res => this._getResponseData(res))
    }

    deleteLike(cardId){
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'DELETE',
            headers: {
                authorization: this._token,
            }
        })
        .then(res => this._getResponseData(res))
    }

    patchAvatar(link){
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avatar: link
              })
        })
        .then(res => this._getResponseData(res))
    }
}

const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-34',
    token: '01cce979-1d70-4bc2-9580-4862374310d8',
  }
);

export default api;