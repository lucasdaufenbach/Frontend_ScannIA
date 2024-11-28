import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      // Faz a requisição para a API de login
      const response = await fetch('http://localhost:8082/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: String(password) })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Armazena o token no localStorage
        navigate('/Dashboard'); // Redireciona para o Dashboard
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Erro ao fazer login.');
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar com o servidor.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Redireciona para a tela de Cadastro
  };

  return (
    <div className="center">
      <div className="container">
        <h1>EntrAI</h1>
        <h2>Bem Vindo</h2>
        {errorMessage && <p className="alert">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <input
            className="inputLogin"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="inputLogin"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="buttonSecundario" type="submit">Entrar</button>
        </form>

        <button className="register-btn" onClick={handleRegisterRedirect}>
          Cadastrar Email
        </button>
      </div>
    </div>
  );
};

export default Login;
