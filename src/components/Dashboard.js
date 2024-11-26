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
    number: '',
    cnpj: '',
    studentCount: '',
    foundationYear: '',
    classroomCount: '',
    courses: []
  });

  const [newCourse, setNewCourse] = useState('');
  const [tempCourses, setTempCourses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  // Estados para formulário de turma
  const [classroom, setClassroom] = useState({
    number: '',
    studentCount: '',
    location: '',
    course: '',
    selectedSchool: ''
  });

  // Estado para pessoa (aluno)
  const [person, setPerson] = useState({
    name: '',
    email: '',
    birthDate: '',
    school: '',
    course: '',
    classroom: ''
  });

  // Lógica para obter as escolas ao carregar
  useEffect(() => {
    fetch('/api/schools') // Substitua pela URL da sua API
      .then((response) => response.json())
      .then((data) => {
        setSchools(data);
      })
      .catch((error) => console.error('Erro ao buscar escolas:', error));
  }, []);

  // Atualizar os campos da escola
  const handleSchoolChange = (e) => {
    setSchool({ ...school, [e.target.name]: e.target.value });
  };

  const handleAddCourse = () => {
    if (newCourse && !tempCourses.includes(newCourse)) {
      setTempCourses([...tempCourses, newCourse]);
      setNewCourse('');
    }
  };

  const handleSchoolSubmit = (e) => {
    e.preventDefault();

    const schoolWithCourses = { ...school, courses: tempCourses };
    fetch('/api/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schoolWithCourses)
    })
      .then((response) => response.json())
      .then((data) => {
        setSchools([...schools, data]);
        setSchool({
          name: '',
          address: '',
          number: '',
          cnpj: '',
          studentCount: '',
          foundationYear: '',
          classroomCount: '',
          courses: []
        });
        setTempCourses([]);
        console.log('Escola cadastrada com sucesso:', data);
      })
      .catch((error) => console.error('Erro ao cadastrar escola:', error));
  };

  const handleClassroomChange = (e) => {
    setClassroom({ ...classroom, [e.target.name]: e.target.value });
  };

  const handleSchoolSelect = (e) => {
    const selectedSchool = e.target.value;
    setClassroom({ ...classroom, selectedSchool });
    setPerson({ ...person, school: selectedSchool });

    const schoolData = schools.find((school) => school.name === selectedSchool);
    if (schoolData) {
      setCourses(schoolData.courses);
    }
  };

  const handleClassroomSubmit = (e) => {
    e.preventDefault();

    fetch('/api/classrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classroom)
    })
      .then((response) => response.json())
      .then((data) => {
        setClassrooms([...classrooms, data]);
        setClassroom({
          number: '',
          studentCount: '',
          location: '',
          course: '',
          selectedSchool: ''
        });
        console.log('Turma cadastrada com sucesso:', data);
      })
      .catch((error) => console.error('Erro ao cadastrar turma:', error));
  };

  const handlePersonChange = (e) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

  const handleCourseSelect = (e) => {
    const selectedCourse = e.target.value;
    setPerson({ ...person, course: selectedCourse });

    fetch(`/api/classrooms?school=${person.school}&course=${selectedCourse}`) // Exemplo de URL com filtro
      .then((response) => response.json())
      .then((data) => {
        setClassrooms(data);
      })
      .catch((error) => console.error('Erro ao buscar turmas:', error));
  };

  const handlePersonSubmit = (e) => {
    e.preventDefault();

    fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Aluno cadastrado com sucesso:', data);
        setPerson({
          name: '',
          email: '',
          birthDate: '',
          school: '',
          course: '',
          classroom: ''
        });
      })
      .catch((error) => console.error('Erro ao cadastrar aluno:', error));
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Arquivo selecionado:', file);
    }
  };

  const handleNavigateToFacialRecognition = () => {
    navigate('/ReconhecimentoFacial');
  };

  return (
    <div>
      <div className="center">
        <div className="container">
          <h2>Cadastro</h2>

          {/*Cadastro de Escola */}
          <button class="buttonSecundario" onClick={() => setShowSchoolForm(!showSchoolForm)}>
            {showSchoolForm ? 'Fechar Cadastro de Escola' : 'Abrir Cadastro de Escola'}
          </button>
          {showSchoolForm && (
            <div className="box">
              <h3>Cadastro de Escola</h3>
              <form onSubmit={handleSchoolSubmit}>
                <label htmlFor="name">Nome da Escola</label>
                <input
                  class="inputForm"
                  type="text"
                  name="name"
                  placeholder="Insira o nome da escola"
                  value={school.name}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="address">Endereço</label>
                <input
                  class="inputForm"
                  type="text"
                  name="address"
                  placeholder="Endereço"
                  value={school.address}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="number">Número</label>
                <input
                  class="inputForm"
                  type="text"
                  name="number"
                  placeholder="Número"
                  value={school.number}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="cnpj">CNPJ</label>
                <input
                  class="inputForm"
                  type="text"
                  name="cnpj"
                  placeholder="CNPJ"
                  value={school.cnpj}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="studentCount">Número de Estudantes</label>
                <input
                  class="inputForm"
                  type="number"
                  name="studentCount"
                  placeholder="Quantidade de estudantes"
                  value={school.studentCount}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="foundationYear">Ano de Fundação</label>
                <input
                  class="inputForm"
                  type="text"
                  name="foundationYear"
                  placeholder="Ano de Fundação"
                  value={school.foundationYear}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="classroomCount">Número de Salas</label>
                <input
                  class="inputForm"
                  type="number"
                  name="classroomCount"
                  placeholder="Número de salas"
                  value={school.classroomCount}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="courses">Cursos</label>
                <input
                  class="inputForm"
                  type="text"
                  name="courses"
                  placeholder="Adicionar novo curso"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                />
                <div class="btCadastroEscola">
                  <button class="buttonPrimario" type="button" onClick={handleAddCourse}>Adicionar Curso</button>
                  <ul>
                    {tempCourses.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                  <button class="buttonPrimario" type="submit">Cadastrar Escola</button>
                </div>

              </form>
            </div>
          )}

          {/*Cadastro de Turma */}
          <button class="buttonSecundario" onClick={() => setShowClassroomForm(!showClassroomForm)}>
            {showClassroomForm ? 'Fechar Cadastro de Turma' : 'Abrir Cadastro de Turma'}
          </button>
          {showClassroomForm && (
            <div className="box">
              <h3>Cadastro de Turma</h3>
              <form onSubmit={handleClassroomSubmit}>
                <label htmlFor="selectedSchool">Selecione a Escola</label> <br />
                <select name="selectedSchool" value={classroom.selectedSchool} onChange={handleSchoolSelect} required>
                  <option value="">Escolha uma escola</option>
                  {schools.map((school, index) => (
                    <option key={index} value={school.name}>
                      {school.name}
                    </option>
                  ))}
                </select> <br />
                <label htmlFor="number">Número da Sala</label>
                <input
                  class="inputForm"
                  type="text"
                  name="number"
                  placeholder="Número da sala"
                  value={classroom.number}
                  onChange={handleClassroomChange}
                  required
                />
                <label htmlFor="studentCount">Número de Estudantes</label>
                <input
                  class="inputForm"

                  type="number"
                  name="studentCount"
                  placeholder="Quantidade de estudantes"
                  value={classroom.studentCount}
                  onChange={handleClassroomChange}
                  required
                />
                <label htmlFor="location">Localização</label>
                <input
                  class="inputForm"
                  type="text"
                  name="location"
                  placeholder="Localização"
                  value={classroom.location}
                  onChange={handleClassroomChange}
                  required
                />
                <label htmlFor="course">Selecione o Curso</label>
                <select name="course" value={classroom.course} onChange={handleClassroomChange} required>
                  <option value="">Escolha um curso</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                <button class="btCadastrarDosForm" type="submit">Cadastrar Turma</button>
              </form>
            </div>
          )}

          {/*Cadastro de Aluno */}
          <button className="buttonSecundario" onClick={() => setShowPersonForm(!showPersonForm)}>
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
                  placeholder="Insira o nome do aluno"
                  value={person.name}
                  onChange={handlePersonChange}
                  required
                />

                <label htmlFor="email">Email do Aluno</label>
                <input
                  className="inputForm"
                  type="email"
                  name="email"
                  placeholder="Insira o email do aluno"
                  value={person.email}
                  onChange={handlePersonChange}
                  required
                />

                <label htmlFor="birthDate">Data de Nascimento</label>
                <input
                  className="inputForm"
                  type="date"
                  name="birthDate"
                  placeholder="Insira a data de nascimento"
                  value={person.birthDate}
                  onChange={handlePersonChange}
                  required
                />

                <label htmlFor="school">Selecione a Escola</label>
                <select name="school" value={person.school} onChange={handleSchoolSelect} required>
                  <option value="">Escolha uma escola</option>
                  {schools.map((school, index) => (
                    <option key={index} value={school.name}>
                      {school.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="course">Selecione o Curso</label>
                <select name="course" value={person.course} onChange={handleCourseSelect} required>
                  <option value="">Escolha um curso</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>

                <label htmlFor="classroom">Selecione a Sala</label>
                <select name="classroom" value={person.classroom} onChange={handlePersonChange} required>
                  <option value="">Escolha uma sala</option>
                  {classrooms.map((classroom, index) => (
                    <option key={index} value={classroom.number}>
                      {classroom.number}
                    </option>
                  ))}
                </select>

                {/* Campo para upload de imagem */}
                <label class="upload" htmlFor="photo">Imagens do Rosto</label>
                <input
                  className="inputForm"
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required
                />

                <button className="btCadastrarDosForm" type="submit">Cadastrar Aluno</button>
              </form>
            </div>
          )}
          <button class="buttonFacial" onClick={handleNavigateToFacialRecognition}>Reconhecimento Facial</button>
          <button class="buttonTerceario" onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;