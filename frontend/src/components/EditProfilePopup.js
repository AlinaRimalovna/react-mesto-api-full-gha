import React, { useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [userName, setUserName] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const currentUser = React.useContext(CurrentUserContext);

  useEffect(() => {
    setUserName(currentUser.name);
    setUserDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleNameChange(e) {
    setUserName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setUserDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser(userName, userDescription);
  }

  return (
    <PopupWithForm name="edit"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input type="text" className="popup__input popup__input_type_name" id="type_name" name="name" placeholder="Имя"
          required minLength="2" maxLength="40" value={userName || ""} onChange={handleNameChange} />
        <span className="popup__error popup__error_type_name"></span>
      </label>
      <label className="popup__field">
        <input type="text" className="popup__input popup__input_type_about" id="type_about" name="about" placeholder="Расскажите о себе"
          required minLength="2" maxLength="200" value={userDescription || ""} onChange={handleDescriptionChange} />
        <span className="popup__error popup__error_type_about"></span>
      </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;

