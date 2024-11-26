import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // Estados de visibilidade para os formulários
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [showClassroomForm, setShowClassroomForm] = useState(false);
  const [showPersonForm, setShowPersonForm] = useState(false);

  // Estados para controle do formulário de escola
  const [school, setSchool] = useState({
    name: '',
    address: '',
    number: ''
  });

  const [schools, setSchools] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  // Estados para formulário de turma
  const [classroom, setClassroom] = useState({
    number: '',
    year: '',
    school: ''
  });

  // Estado para pessoa (aluno)
  const [person, setPerson] = useState({
    name: '',
    birthDate: '',
    school: '',
    classroom: ''
  });

  // Obter as escolas ao carregar o componente
  useEffect(() => {
    fetch('/api/schools')
      .then((response) => response.json())
      .then((data) => setSchools(data))
      .catch((error) => console.error('Erro ao buscar escolas:', error));
  }, []);

  // Obter as turmas de acordo com a escola selecionada
  useEffect(() => {
    if (person.school) {
      fetch(`/api/classrooms?schoolId=${person.school}`)
        .then((response) => response.json())
        .then((data) => setClassrooms(data))
        .catch((error) => console.error('Erro ao buscar turmas:', error));
    }
  }, [person.school]);

  // Atualizar os campos dos formulários
  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  // Submeter formulário de escola
  const handleSchoolSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(school)
      });
      const newSchool = await response.json();
      setSchools([...schools, newSchool]);
      setSchool({ name: '', address: '', number: '' });
      setShowSchoolForm(false);
      console.log('Escola cadastrada com sucesso:', newSchool);
    } catch (error) {
      console.error('Erro ao cadastrar escola:', error);
    }
  };

  // Submeter formulário de turma
  const handleClassroomSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classroom)
      });
      const newClassroom = await response.json();
      setClassrooms([...classrooms, newClassroom]);
      setClassroom({ number: '', year: '', school: '' });
      setShowClassroomForm(false);
      console.log('Turma cadastrada com sucesso:', newClassroom);
    } catch (error) {
      console.error('Erro ao cadastrar turma:', error);
    }
  };

  // Submeter formulário de aluno
  const handlePersonSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person)
      });
      const newPerson = await response.json();
      setPerson({ name: '', birthDate: '', school: '', classroom: '' });
      setShowPersonForm(false);
      console.log('Aluno cadastrado com sucesso:', newPerson);
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
    }
  };

  // Navegar para reconhecimento facial
  const handleNavigateToFacialRecognition = () => {
    navigate('/ReconhecimentoFacial');
  };

  // Logout
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="center">
        <div className="container">
          <h2>Cadastro</h2>

          {/* Cadastro de Escola */}
          <button
            className="buttonSecundario"
            onClick={() => setShowSchoolForm(!showSchoolForm)}
          >
            {showSchoolForm ? 'Fechar Cadastro de Escola' : 'Abrir Cadastro de Escola'}
          </button>
          {showSchoolForm && (
            <div className="box">
              <h3>Cadastro de Escola</h3>
              <form onSubmit={handleSchoolSubmit}>
                <label htmlFor="name">Nome da Escola</label>
                <input
                  className="inputForm"
                  type="text"
                  name="name"
                  value={school.name}
                  onChange={(e) => handleInputChange(e, setSchool)}
                  required
                />
                <label htmlFor="address">Endereço</label>
                <input
                  className="inputForm"
                  type="text"
                  name="address"
                  value={school.address}
                  onChange={(e) => handleInputChange(e, setSchool)}
                  required
                />
                <label htmlFor="number">Número</label>
                <input
                  className="inputForm"
                  type="text"
                  name="number"
                  value={school.number}
                  onChange={(e) => handleInputChange(e, setSchool)}
                  required
                />
                <button className="buttonPrimario" type="submit">Cadastrar Escola</button>
              </form>
            </div>
          )}

          {/* Cadastro de Turma */}
          <button
            className="buttonSecundario"
            onClick={() => setShowClassroomForm(!showClassroomForm)}
          >
            {showClassroomForm ? 'Fechar Cadastro de Turma' : 'Abrir Cadastro de Turma'}
          </button>
          {showClassroomForm && (
            <div className="box">
              <h3>Cadastro de Turma</h3>
              <form onSubmit={handleClassroomSubmit}>
                <label htmlFor="school">Selecione a Escola</label>
                <select
                  name="school"
                  value={classroom.school}
                  onChange={(e) => handleInputChange(e, setClassroom)}
                  required
                >
                  <option value="">Escolha uma escola</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="number">Série</label>
                <input
                  className="inputForm"
                  type="text"
                  name="number"
                  value={classroom.number}
                  onChange={(e) => handleInputChange(e, setClassroom)}
                  required
                />
                <label htmlFor="year">Ano Letivo</label>
                <input
                  className="inputForm"
                  type="text"
                  name="year"
                  value={classroom.year}
                  onChange={(e) => handleInputChange(e, setClassroom)}
                  required
                />
                <button className="buttonPrimario" type="submit">Cadastrar Turma</button>
              </form>
            </div>
          )}

          {/* Cadastro de Aluno */}
          <button
            className="buttonSecundario"
            onClick={() => setShowPersonForm(!showPersonForm)}
          >
            {showPersonForm ? 'Fechar Cadastro de Aluno' : 'Abrir Cadastro de Aluno'}
          </button>
          {showPersonForm && (
            <div className="box">
              <h3>Cadastro de Aluno</h3>
              <form onSubmit={handlePersonSubmit}>
                <label htmlFor="name">Nome do Aluno</label>
                <input
                  className="inputForm"
                  type="text"
                  name="name"
                  value={person.name}
                  onChange={(e) => handleInputChange(e, setPerson)}
                  required
                />
                <label htmlFor="birthDate">Data de Nascimento</label>
                <input
                  className="inputForm"
                  type="date"
                  name="birthDate"
                  value={person.birthDate}
                  onChange={(e) => handleInputChange(e, setPerson)}
                  required
                />
                <label htmlFor="school">Selecione a Escola</label>
                <select
                  name="school"
                  value={person.school}
                  onChange={(e) => handleInputChange(e, setPerson)}
                  required
                >
                  <option value="">Escolha uma escola</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="classroom">Selecione a Turma</label>
                <select
                  name="classroom"
                  value={person.classroom}
                  onChange={(e) => handleInputChange(e, setPerson)}
                  required
                >
                  <option value="">Escolha uma sala</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.number}
                    </option>
                  ))}
                </select>
                <button className="buttonPrimario" type="submit">Cadastrar Aluno</button>
              </form>
            </div>
          )}

          <button
            className="buttonPrimario"
            onClick={handleNavigateToFacialRecognition}
          >
            Ir para Reconhecimento Facial
          </button>
          <button className="buttonSecundario" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
