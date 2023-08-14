import React from 'react';
import union from '../images/union.png'
import fail from '../images/fail.svg'

function InfoTooltip({ isOpen, onClose, isRegister }) {
  return (
    <>
      <div className={`popup ${isOpen ? "popup_opened" : ""}`}  >
        <div className="popup__container">
          <div className="popup__register">
            <img className="popup__register-image" src={`${isRegister ? union : fail}`} alt="регистрация" />
            <p className="popup__register-heading">{`${isRegister ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте еще раз!"}`}</p>
          </div>
          <button className="popup__close-icon" onClick={onClose} type="button">
          </button>
        </div>
      </div>
    </>
  );
}
export default InfoTooltip;