import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // Estados de visibilidade para os formulários
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [showClassroomForm, setShowClassroomForm] = useState(false);
  const [showPersonForm, setShowPersonForm] = useState(false);

  // Estados para controle do formulário de escola
  const [school, setSchool] = useState();
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
    fetch('http://localhost:8082/api/escolas/')
      .then((response) => response.json())
      .then((data) => setSchools(data))
      .catch((error) => console.error('Erro ao buscar escolas:', error));
  }, []);

  // Obter as turmas de acordo com a escola selecionada
  useEffect(() => {
    if (person.school) {
      fetch(`http://localhost:8082/api/turmas/?schoolId=${person.school}`)
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
      const response = await fetch('http://localhost:8082/api/escolas/', {
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
      const response = await fetch('http://localhost:8082/api/turmas/', {
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
  // Submeter formulário de aluno
  const handlePersonSubmit = async (e) => {
    e.preventDefault();

    // Verifica se a imagem foi capturada
    if (!capturedImage) {
      alert('Por favor, capture uma foto antes de cadastrar o aluno.');
      return;
    }

    try {
      // Inclui a imagem no objeto da pessoa
      const personWithImage = {
        ...person,
        photo: capturedImage, // Adiciona a imagem capturada
      };

      const response = await fetch('http://localhost:8082/api/alunos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personWithImage),
      });

      const newPerson = await response.json();

      // Limpa os campos após o cadastro
      setPerson({ nome: '', birthDate: '', escola: '', salaDeAula: '' });
      setCapturedImage(null); // Reseta a imagem capturada
      setShowPersonForm(false);
      setShowCaptureButton(true); // Exibe o botão de captura novamente
      setShowTryAgainButton(false);

      console.log('Aluno cadastrado com sucesso:', newPerson);
      alert('Aluno cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      alert('Erro ao cadastrar aluno. Tente novamente.');
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





  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [showCaptureButton, setShowCaptureButton] = useState(true); // Para mostrar o botão de capturar
  const [showTryAgainButton, setShowTryAgainButton] = useState(false); // Para mostrar o botão de tentar novamente
  const [capturedImage, setCapturedImage] = useState(null); // Para armazenar a imagem capturada

  const [status, setStatus] = useState('Posicione seu rosto no círculo...');

  useEffect(() => {
    if (showCaptureButton && !capturedImage) {
      // Ativa a câmera quando o botão "Capturar" é exibido
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
    // Captura a foto ao clicar no botão "Capturar"
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setCapturedImage(canvas.toDataURL('image/jpeg')); // Armazena a foto como base64
    setShowCaptureButton(false); // Esconde o botão de capturar após a foto ser tirada
    setShowTryAgainButton(true); // Mostra o botão de tentar novamente após a captura
    setStatus('Foto capturada, você pode tentar novamente ou salvar!');
  };

  const handleTryAgainClick = () => {
    setCapturedImage(null); // Limpa a imagem capturada
    setShowCaptureButton(true); // Mostra o botão de capturar novamente
    setShowTryAgainButton(false); // Esconde o botão de tentar novamente
    setStatus('Posicione seu rosto no círculo...');
  };

  const handleSaveClick = () => {
    // Envia a foto para a API (substitua pela sua URL real da API)
    fetch('http://localhost:8082/api/captura', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: capturedImage })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Foto salva com sucesso:', data);
        // Resetar o estado após salvar
        setCapturedImage(null);
        setShowCaptureButton(true);
        setShowTryAgainButton(false);
        setStatus('Foto salva com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao salvar foto:', error);
        setStatus('Erro ao salvar a foto.');
      });
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
                  console.log(school)
                  console.log(schools)
                  {Array.isArray(schools) && schools.map((school) => (
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
