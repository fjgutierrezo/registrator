import React, { useState } from 'react';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Por ahora solo mostramos los datos en consola
    console.log('Iniciando sesión con:', { email, password });

    // Aquí podrías hacer la llamada a la API
    if (onLogin) {
      onLogin({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Iniciar Sesión</h2>
      <div>
        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Contraseña:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Entrar</button>
    </form>
  );
}

const formStyle = {
  maxWidth: '300px',
  margin: '0 auto',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '10px',
  marginTop: '5rem'
};

export default LoginForm;
