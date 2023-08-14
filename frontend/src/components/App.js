import Header from './Header.js'
import Main from './Main'
import EditProfilePopup from './EditProfilePopup.js'
import EditAvatarPopup from './EditAvatarPopup.js'
import AddPlacePopup from './AddPlacePopup.js'
import ImagePopup from './ImagePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { Navigate, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ProtectedRouteElement from './ProtectedRoute.js'
import Login from './Login.js'
import Register from './Register.js'
import * as UserAuth from "../utils/UserAuth.js"
import InfoTooltip from "./InfoTooltip.js";

function App() {

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setselectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setloggedIn] = useState([false]);
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(null);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [isRegister, setRegister] = useState(false);

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleInfoTooltipOpen() {
    setRegister(true);
    setInfoTooltipOpen(true);
  }

  function handleInfoTooltipOpenFail() {
    setInfoTooltipOpen(true);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setselectedCard(null);
    setInfoTooltipOpen(null);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleCardDelete(id) {
    api.deleteCard(id)
      .then((newCard) => {
        setCards(cards => cards.filter((c) => c._id !== id));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateUser(name, about) {
    api.changeUserInfo(name, about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateAvatar(avatar) {
    api.changeAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleAddPlaceSubmit(name, link) {
    api.addNewCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleLogin(email, password) {
    UserAuth.login(email, password)
    .then((data) => {
      console.log(data);
      // localStorage.setItem("jwt", data.token);
      setloggedIn(true);
      navigate('/');
    })
       .catch((err) => {
      handleInfoTooltipOpenFail();
      console.log(err)
    });
  }

  function handleRegister(email, password) {
    UserAuth.register(email, password)
    .then((data) => {
      handleInfoTooltipOpen();
      navigate('/sign-in');
    })
    .catch((err) => {
      handleInfoTooltipOpenFail();
      console.log(err)
    });
  }

  const checkToken = () => {
    // const jwt = localStorage.getItem("jwt")
    UserAuth.checktoken()
      .then((data) => {
        if (data) {
          console.log(data);
          setUserEmail(data.email);
          setloggedIn(true);
          navigate(location.pathname)
        }
        else { return; }
      })
      .catch((err) => {
        setloggedIn(false);
        console.log(err)
      });
  }

  useEffect(() => {
  if (loggedIn) {  
    api.getUserInfo()
      .then((res) => {
        setCurrentUser(res)
      })
      .catch((err) => {
        console.log(err);
      })
    api.getInitialCards()
      .then((cards) => {
        setCards(cards)
      })
      .catch((err) => {
        console.log(err);
      })
   }
  }, [loggedIn, setloggedIn])

  useEffect(() => {
    checkToken();
  }, [])

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <Header email={userEmail} />
        <Routes>

          <Route path="/" element={
            <ProtectedRouteElement element={Main}
              cards={cards}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={setselectedCard}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              loggedIn={loggedIn}
            />
          } />
          <Route path="/sign-up" element={
            <Register onRegister={handleRegister} />
          } />
          <Route path="/sign-in" element={
            <Login onLogin={handleLogin} />
          } />
          <Route path="/" element={loggedIn ? <Navigate to="/sign-in" replace /> : <Navigate to="/sign-up" replace />} />
        </Routes>

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

        <AddPlacePopup card={cards} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

        {/* <PopupWithForm name="delete"
          title="Вы уверены?"
          buttonText="Да"
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups} /> */}

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <ImagePopup card={selectedCard}
          onClose={closeAllPopups}
        />
        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} isRegister={isRegister} />
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
