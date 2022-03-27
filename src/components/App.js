import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ProtectedRoute from "./ProtectedRoute";

import api from "../utils/Api.js";
import auth from "../utils/Auth.js";

import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Route, useHistory } from "react-router-dom";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";

function App() {
  const history = useHistory();
  const [path, setPath] = React.useState(history.location.pathname);
  const [email, setEmail] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(true);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    api
      .getProfileInfo()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });

    api
      .getCardsData()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        console.log(err);
      });
    tokenCheck();
  }, []);

  React.useEffect(() => {
    tokenCheck();
  });

  function tokenCheck() {
    // если у пользователя есть токен в localStorage,
    // эта функция проверит валидность токена
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      // проверим токен
      auth.checkToken(jwt).then((res) => {
        if (res) {
          setEmail(res.data.email);
          setLoggedIn(true);
        }
      });
    } else {
      setLoggedIn(false);
    }
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(false);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(name, about) {
    api
      .patchProfileInfo(name, about)
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(avatar) {
    api
      .patchAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    if (!isLiked) {
      api
        .makeLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleCardDelete(card) {
    api
      .deleteCardData(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(name, link) {
    api
      .makeNewCardData(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLogOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    history.push("./sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <ProtectedRoute
          path="/"
          loggedIn={loggedIn}
          component={Header}
          handleLoggedIn={setLoggedIn}
          child={
            <div className="header__nav-container">
              <p className="header__text">{email}</p>
              <a className="header__link" onClick={handleLogOut}>
                Выйти
              </a>
            </div>
          }
        />
        <ProtectedRoute
          path="/"
          loggedIn={loggedIn}
          component={Main}
          onCardClick={handleCardClick}
          onAddPlace={handleAddPlaceClick}
          onEditProfile={handleEditProfileClick}
          onEditAvatar={handleEditAvatarClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />
        <Route path="/sign-in">
          <Header
            child={
              <a href="./sign-up" className="header__link">
                Регистрация
              </a>
            }
          />
          <Login setLoggedIn={setLoggedIn}/>
        </Route>
        <Route path="/sign-up">
          <Header
            child={
              <a href="./sign-in" className="header__link">
                Войти
              </a>
            }
          />
          <Register/>
        </Route>
        <Footer />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <PopupWithForm
          name={"editForm"}
          title={"Вы уверены?"}
          isOpen={false}
          onClose={closeAllPopups}
          buttonName={"Да"}
        ></PopupWithForm>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
