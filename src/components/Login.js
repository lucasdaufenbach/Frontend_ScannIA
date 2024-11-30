import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Define a URL base da API a partir da variável de ambiente ou usa uma URL padrão
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://df5b-2804-4bd0-485-5900-cbed-26c3-fa0f-269a.ngrok-free.app';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Faz a requisição para a API de login
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: String(password) }), // Ajuste do campo senha para corresponder ao backend
      });

      if (response.ok) {
        const data = await response.json();

        // Armazena o token e outros dados do usuário
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redireciona para o Dashboard
        navigate('/Dashboard');
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
