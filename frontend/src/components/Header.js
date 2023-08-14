import logo from '../images/logo.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header({ email }) {
  const navigate = useNavigate();
  const location = useLocation();

  function signOut() {
    localStorage.removeItem("jwt");
    navigate('/sign-up');
  }

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип сайта Место" />
      <div className="header__info">
        {location.pathname === "/" && <p className="header__email">{email}</p>}
        {location.pathname === "/" && <button className="header__button" onClick={signOut}>Выйти</button>}
        {location.pathname === "/sign-up" && <Link to="/sign-in" className="auth__link">Войти</Link>}
        {location.pathname === "/sign-in" && <Link to="/sign-up" className="auth__link">Регистрация</Link>}
      </div>
    </header>
  );
}

export default Header;