function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup popup_type_view ${card ? "popup_opened" : " "}`}   >
      <div className="popup__view">
        <img className="popup__image" src={card?.link} alt={card?.name}/>
        <p className="popup__caption">{card?.name}</p>
        <button className="popup__close-icon popup__close-icon_view" onClick={onClose} type="button">
        </button>
      </div>
    </div>
  );
}

export default ImagePopup;