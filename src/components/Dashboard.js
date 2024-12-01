import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Ajuste o caminho conforme sua estrutura
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // Estados de visibilidade para os formulários
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [showClassroomForm, setShowClassroomForm] = useState(false);
  const [showPersonForm, setShowPersonForm] = useState(false);

  // Estados para controle do formulário de escola
  const [school, setSchool] = useState({ nome: '', endereco: '', telefone: '' });
  const [schools, setSchools] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  // Estados para formulário de turma
  const [classroom, setClassroom] = useState({
    serie: '',
    nome: '',
    ano_letivo: '',
    escola_id: '',
  });

  // Estado para pessoa (aluno)
  const [person, setPerson] = useState({
    nome: '',
    data_nascimento: '',
    turma: '',
    foto: '',
  });

  // Estados relacionados à captura de imagem
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCaptureButton, setShowCaptureButton] = useState(true);
  const [showTryAgainButton, setShowTryAgainButton] = useState(false);
  const [status, setStatus] = useState('Posicione seu rosto no círculo...');
  // Função para carregar escolas
  const fetchSchools = async () => {
    try {
      console.log('Carregando escolas...');
      const response = await api.get('https://599e-2804-4bd0-485-5900-842a-8d71-c552-d2e3.ngrok-free.app/api/escolas/', {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      console.log('Resposta da API:', response.data);
      setSchools(response.data);
    } catch (error) {
      console.error('Erro ao carregar escolas:', error);
    }
  };
  

  // Função para carregar turmas de acordo com a escola selecionada
  useEffect(() => {
    if (person.school) {
      const fetchClassrooms = async () => {
        try {
          const response = await api.get(`/api/turmas/?schoolId=${person.school}`);
          setClassrooms(response.data);
        } catch (error) {
          console.error('Erro ao buscar turmas:', error);
        }
      };
      fetchClassrooms();
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
      const response = await api.post('/api/escolas', school);
      setSchools([...schools, response.data]);
      setSchool({ nome: '', endereco: '', telefone: '' });
      setShowSchoolForm(false);
    } catch (error) {
      console.error('Erro ao cadastrar escola:', error);
    }
  };

  // Submeter formulário de turma
  const handleClassroomSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('https://599e-2804-4bd0-485-5900-842a-8d71-c552-d2e3.ngrok-free.app/api/turmas', classroom);
      setClassrooms([...classrooms, response.data]);
      setClassroom({ serie: '', nome: '', ano_letivo: '', escola_id: '' });
      setShowClassroomForm(false);
    } catch (error) {
      console.error('Erro ao cadastrar turma:', error);
    }
  };

  // Submeter formulário de aluno
  const handlePersonSubmit = async (e) => {
    e.preventDefault();

    if (!capturedImage) {
      alert('Por favor, capture uma foto antes de cadastrar o aluno.');
      return;
    }

    try {
      const personWithImage = { ...person, foto: capturedImage };
      await api.post('/api/alunos', personWithImage);
      setPerson({ nome: '', data_nascimento: '', turma: '', foto: '' });
      setCapturedImage(null);
      setShowCaptureButton(true);
      setShowTryAgainButton(false);
      alert('Aluno cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      alert('Erro ao cadastrar aluno. Tente novamente.');
    }
  };

  // Funções de captura de imagem
  useEffect(() => {
    if (showCaptureButton && !capturedImage) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
        } catch (error) {
          console.error('Erro ao acessar a câmera:', error);
        }
      };
      startCamera();
    }
  }, [showCaptureButton, capturedImage]);

  const handleCaptureClick = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setCapturedImage(canvas.toDataURL('image/jpeg'));
    setShowCaptureButton(false);
    setShowTryAgainButton(true);
    setStatus('Foto capturada. Você pode tentar novamente ou salvar.');
  };

  const handleTryAgainClick = () => {
    setCapturedImage(null);
    setShowCaptureButton(true);
    setShowTryAgainButton(false);
    setStatus('Posicione seu rosto no círculo...');
  };

  const handleNavigateToFacialRecognition = () => {
    navigate('/ReconhecimentoFacial');
  };

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
                  name="nome"
                  value={school.nome}
                  onChange={(e) => handleInputChange(e, setSchool)}
                  required
                />
                <label htmlFor="address">Endereço</label>
                <input
                  className="inputForm"
                  type="text"
                  name="endereco"
                  value={school.endereco}
                  onChange={(e) => handleInputChange(e, setSchool)}
                  required
                />
                <label htmlFor="number">Número</label>
                <input
                  className="inputForm"
                  type="text"
                  name="telefone"
                  value={school.telefone}
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
                <label htmlFor="escola_id">Selecione a Escola</label>
                <select
                  name="escola_id"
                  value={classroom.escola_id}
                  onFocus={fetchSchools} // Dispara o GET ao focar no select
                  onChange={(e) => handleInputChange(e, setClassroom)}
                  required
                >
                  <option value="">Escolha uma escola</option>
                  {Array.isArray(schools) && schools.length > 0 ? (
                  schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.nome}
                  </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Nenhuma escola disponível
                    </option>
                  )}
                </select>
                <label htmlFor="number">Série</label>
                <input
                  className="inputForm"
                  type="text"
                  name="serie"
                  value={classroom.serie}
                  onChange={(e) => handleInputChange(e, setClassroom)}
                  required
                />
                <label htmlFor="nome">Nome</label>
                <input
                  className="inputForm"
                  type="text"
                  name="nome"
                  value={classroom.nome}
                  onChange={(e) => handleInputChange(e, setClassroom)}
                  required
                />
                <label htmlFor="year">Ano Letivo</label>
                <input
                  className="inputForm"
                  type="text"
                  name="ano_letivo"
                  value={classroom.ano_letivo}
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
                  onFocus={fetchSchools}
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


                <div>
                  <div className="center">
                    <div className="container">
                      <h2>Cadastro</h2>

                      {/* Status */}
                      <div>
                        <p>{status}</p>
                      </div>

                      {/* Camera */}
                      {!capturedImage ? (
                        <div>
                          <video
                            ref={videoRef}
                            autoPlay
                            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                          />
                          <canvas
                            ref={canvasRef}
                            width="640"
                            height="480"
                            style={{ display: 'none' }}
                          />
                        </div>
                      ) : (
                        <div>
                          <img
                            src={capturedImage}
                            alt="Captura"
                            style={{ width: '100%', maxWidth: '640px', borderRadius: '8px' }}
                          />
                        </div>
                      )}

                      {/* Botão de Capturar */}
                      {showCaptureButton && !capturedImage && (
                        <div>
                          <button className="buttonSecundario" onClick={handleCaptureClick}>
                            Capturar
                          </button>
                        </div>
                      )}

                      {/* Botão de Tentar Novamente */}
                      {showTryAgainButton && (
                        <div>
                          <button className="buttonSecundario" onClick={handleTryAgainClick}>
                            Tentar Novamente
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                </div>



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