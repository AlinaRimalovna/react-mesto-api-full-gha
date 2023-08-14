import React, { useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm.js';

function AddPlacePopup({ card, isOpen, onClose, onAddPlace }) {
  const [cardName, setCardName] = useState("");
  const [cardLink, setCardLink] = useState("");

  useEffect(() => {
    setCardName(card.name);
    setCardLink(card.link);
  }, []);

  React.useEffect(() => {
    setCardName('');
    setCardLink('');
}, [isOpen]);


  function handleNewCardName(e) {
    setCardName(e.target.value);
  }

  function handleNewCardLink(e) {
    setCardLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace(cardName, cardLink);
  }

  return (
    <PopupWithForm name="add"
      title="Новое&nbsp;место"
      buttonText="Создать"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input type="text" className="popup__input popup__input_type_location" id="type_location" name="name" placeholder="Название"
          required minLength="2" maxLength="30" value={cardName || ""} onChange={handleNewCardName} />
        <span className="popup__error popup__error_type_location"></span>
      </label>
      <label className="popup__field">
        <input type="url" className="popup__input popup__input_type_image" id="type_image" name="link" placeholder="Ссылка на картинку"
          required value={cardLink || ""} onChange={handleNewCardLink} />
        <span className="popup__error popup__error_type_image"></span>
      </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;

