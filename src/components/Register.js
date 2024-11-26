import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate para navegação
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Estado para nome do usuário
  const [role, setRole] = useState(''); // Estado para papel do usuário
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate para redirecionar

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
          role,
        }),
      });

      if (response.ok) {
        setSuccess('Cadastro realizado com sucesso!');
        setEmail('');
        setPassword('');
        setUsername('');
        setRole('');
      } else {
        const errorData = await response.json();
        setError(`Erro ao cadastrar: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique sua conexão.');
    }
  };

  // redirecionar para a página de login
  const handleGoToLogin = () => {
    navigate('/'); // Altera o caminho da rota para a tela de login
  };

  return (
    <div className="center">
      <div className="container">
        <h2>Cadastro</h2>
        <input
          className="cadastroInput"
          type="text"
          placeholder="Digite seu nome"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="cadastroInput"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="cadastroInput"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="cadastroInput"
          type="text"
          placeholder="Digite seu papel (ex: Admin, Usuário)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        {success && <p className="alert" style={{ color: 'green' }}>{success}</p>}
        {error && <p className="alert" style={{ color: 'red' }}>{error}</p>}
        <button className="buttonPrimario" onClick={handleRegister}>Cadastrar</button>

        <button className="buttonSecundario" onClick={handleGoToLogin} style={{ marginTop: '10px' }}>
          Voltar para Login
        </button>
      </div>
    </div>
  );
};

export default Register;
