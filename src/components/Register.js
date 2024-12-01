import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate para navegação
import './Register.css';

const Register = () => {
  const [nome, setNome] = useState(''); // Estado para nome do usuário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState(''); // Estado para senha
  const [papel, setPapel] = useState(''); // Estado para papel do usuário
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate para redirecionar

  // Obtém a URL base da API da variável de ambiente
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://f6d1-2804-4bd0-485-5900-aae-6533-c4d-92fc.ngrok-free.app';

  const handleRegister = async () => {
    if (!nome || !email || !senha || !papel) {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          papel,
        }),
      });

      if (response.ok) {
        setSuccess('Cadastro realizado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
        setPapel('');
        setError('');
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
          value={nome}
          onChange={(e) => setNome(e.target.value)}
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
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <input
          className="cadastroInput"
          type="text"
          placeholder="Digite seu papel (ex: Admin, Usuário)"
          value={papel}
          onChange={(e) => setPapel(e.target.value)}
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
