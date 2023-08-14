import Card from './Card.js';
import Footer from './Footer.js'
import React, { useEffect, useState } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Main({ cards, onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardLike, onCardDelete }) {

  const currentUser = React.useContext(CurrentUserContext);

  return (
    <>
    <main className="content">
      <section className="profile">
        <div className="profile__main">
          <div className="profile__avatar-box" onClick={onEditAvatar}>
            <img className="profile__avatar" alt="аватар пользователя" src={currentUser.avatar} />
          </div>
          <div className="profile__info">
            <div className="profile__info-user">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button className="profile__button-edit"
                onClick={onEditProfile} type="button" aria-label="Редактировать">
              </button>
            </div>
            <p className="profile__info-about">{currentUser.about}</p>
          </div>
        </div>
        <button className="profile__button-add" onClick={onAddPlace} type="button" aria-label="Добавить">
        </button>
      </section>
      <section className="elements">
        {
          cards.map((card) => (
            <Card key={card._id}
              name={card.name}
              link={card.link}
              likes={card.likes}
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />))
        }
      </section>
    </main>
    <Footer />
    </>
  );
}

export default Main;