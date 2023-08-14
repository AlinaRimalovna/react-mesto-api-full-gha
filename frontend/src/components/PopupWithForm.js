function PopupWithForm({ name, title, buttonText, children, isOpen, onClose, onSubmit }) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}  >
      <div className="popup__container">
        <form className="popup__form" name={`${name}form`} noValidate onSubmit={onSubmit}>
          <h2 className={`popup__heading popup__heading-${name}`}>{title}</h2>
          {children}
          <button className={`popup__button popup__button-${name}`} type="submit">{buttonText || 'Сохранить'}</button>
        </form>
        <button className={`popup__close-icon popup__close-icon_${name}`} onClick={onClose} type="button">
        </button>
      </div>
    </div>
  );
}

export default PopupWithForm;