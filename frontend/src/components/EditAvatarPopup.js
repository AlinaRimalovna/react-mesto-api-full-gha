import React, { useEffect, useState, useRef } from 'react';
import PopupWithForm from './PopupWithForm.js';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarRef = React.useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar(avatarRef.current.value);
  }

  return (
    <PopupWithForm name="avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >

      <label className="popup__field">
        <input type="url" className="popup__input popup__input_type_avatar" id="type_avatar" name="avatar" placeholder="Ссылка на аватар"
          required ref={avatarRef} />
        <span className="popup__error popup__error_type_avatar"></span>
      </label>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;

