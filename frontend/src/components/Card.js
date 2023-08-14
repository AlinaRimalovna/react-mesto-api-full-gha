import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import React from 'react';

function Card({ card, name, link, likes, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some(i => i === currentUser._id);
  const cardLikeButtonClassName = (
    `element__like ${isLiked && 'element__like_active'}`
  );

  function handleCardClick() {
    onCardClick({ link, name });
    console.log(card);
  }

  function handleDeleteClick() {
    onCardDelete(card._id);
    console.log(card);
  }

  function handleLikeClick() {
    onCardLike(card);
    console.log(card);
  }
  return (
    <article className="element">
      <img className="element__image" src={link} alt={name} onClick={handleCardClick} />
      <div className="element__info">
        <h2 className="element__title">{name}</h2>
        <div className="element__like-box">
          <button className={cardLikeButtonClassName} type="button" aria-label="Нравится" onClick={handleLikeClick}>
          </button>
          <p className="element__like-amount">{likes.length}</p>
        </div>
      </div>
      {isOwn && <button className="element__delete" type="button" aria-label="Удалить" onClick={handleDeleteClick}>
      </button>}
    </article>
  );
}

export default Card;