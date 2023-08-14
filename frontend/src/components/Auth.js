function Auth({ name, title, button, children, onSubmit, onChange, email, password, error }) {
  return (
    <div className="auth">
      <form className="popup__form" name={`${name}form`} onSubmit={onSubmit}>
        <h2 className="auth__heading">{title}</h2>
        <label className="popup__field">
          <input type="email" className="auth__input" id="email" name="email" placeholder="Email"
            value={email} onChange={onChange} required />
          {/* <span className="auth__error"></span> */}
        </label>
        <label className="popup__field">
          <input type="password" className="auth__input" id="password" name="password" placeholder="Пароль"
            value={password} onChange={onChange} required />
          <span className="auth__error">{error}</span>
        </label>
        <button className="auth__button" type="submit">{button}</button>
        {children}
      </form>

    </div>
  );
}

export default Auth;