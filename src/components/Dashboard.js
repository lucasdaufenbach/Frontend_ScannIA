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

  const [newCourse, setNewCourse] = useState(''); // Novo curso a ser adicionado temporariamente
  const [tempCourses, setTempCourses] = useState([]); // Cursos temporários antes do cadastro final

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

  const [schools, setSchools] = useState([]); // Lista de escolas cadastradas
  const [courses, setCourses] = useState([]); // Lista de cursos filtrada pela escola selecionada
  const [classrooms, setClassrooms] = useState([]); // Lista de turmas filtrada pela escola e curso selecionado

  // Carregar as escolas cadastradas ao iniciar
  useEffect(() => {
    const savedSchools = JSON.parse(localStorage.getItem('reports')) || [];
    setSchools(savedSchools.map((report) => report.school).filter(Boolean));
  }, []);

  // Função para lidar com mudanças nos campos da escola
  const handleSchoolChange = (e) => {
    setSchool({ ...school, [e.target.name]: e.target.value });
  };

  // Função para adicionar um novo curso temporário à lista de cursos
  const handleAddCourse = () => {
    if (newCourse && !tempCourses.includes(newCourse)) {
      setTempCourses([...tempCourses, newCourse]);
      setNewCourse(''); // Limpar o campo do curso
    }
  };

  // Função para cadastrar a escola
  const handleSchoolSubmit = (e) => {
    e.preventDefault();

    const schoolWithCourses = { ...school, courses: tempCourses }; // Adiciona os cursos temporários à escola
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    reports.push({ school: schoolWithCourses });

    // Atualiza o localStorage e o estado de escolas
    localStorage.setItem('reports', JSON.stringify(reports));
    setSchools([...schools, schoolWithCourses]); // Adiciona a nova escola à lista de escolas

    console.log('Escola cadastrada com sucesso!', schoolWithCourses);

    // Limpar campos da escola e lista de cursos temporários
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
    setTempCourses([]); // Limpar cursos temporários
  };

  // Função para lidar com mudanças nos campos da turma
  const handleClassroomChange = (e) => {
    setClassroom({ ...classroom, [e.target.name]: e.target.value });
  };

  // Função para lidar com a seleção de uma escola
  const handleSchoolSelect = (e) => {
    const selectedSchool = e.target.value;
    setClassroom({ ...classroom, selectedSchool });
    setPerson({ ...person, school: selectedSchool });

    // Filtrar os cursos da escola selecionada
    const schoolData = schools.find((school) => school.name === selectedSchool);
    if (schoolData) {
      setCourses(schoolData.courses); // Atualiza os cursos com base na escola selecionada
    }
  };

  // Função para cadastrar a turma
  const handleClassroomSubmit = (e) => {
    e.preventDefault();

    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    reports.push({ classroom });

    // Atualiza o localStorage e limpa os campos de turma
    localStorage.setItem('reports', JSON.stringify(reports));
    console.log('Turma cadastrada com sucesso!', classroom);
    setClassroom({
      number: '',
      studentCount: '',
      location: '',
      course: '',
      selectedSchool: ''
    });
  };

  // Função para lidar com mudanças nos campos de aluno
  const handlePersonChange = (e) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

  // Filtrar turmas com base na escola e curso selecionados
  const handleCourseSelect = (e) => {
    const selectedCourse = e.target.value;
    setPerson({ ...person, course: selectedCourse });

    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const filteredClassrooms = reports
      .filter((report) => report.classroom && report.classroom.selectedSchool === person.school && report.classroom.course === selectedCourse)
      .map((report) => report.classroom);

    setClassrooms(filteredClassrooms); // Atualiza as turmas com base na escola e curso selecionados
  };

  // Função para cadastrar o aluno
  const handlePersonSubmit = (e) => {
    e.preventDefault();

    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    reports.push({ person });

    // Atualiza o localStorage e limpa os campos de aluno
    localStorage.setItem('reports', JSON.stringify(reports));
    console.log('Aluno cadastrado com sucesso!', person);
    setPerson({
      name: '',
      email: '',
      birthDate: '',
      school: '',
      course: '',
      classroom: ''
    });
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="center">
        <div className="container">
          <h2>Cadastro de Escolas, Turmas e Alunos</h2>

          {/* Toggle para Cadastro de Escola */}
          <button onClick={() => setShowSchoolForm(!showSchoolForm)}>
            {showSchoolForm ? 'Fechar Cadastro de Escola' : 'Abrir Cadastro de Escola'}
          </button>
          {showSchoolForm && (
            <div className="box">
              <h3>Cadastro de Escola</h3>
              <form onSubmit={handleSchoolSubmit}>
                <label htmlFor="name">Nome da Escola</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Insira o nome da escola"
                  value={school.name}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="address">Endereço</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Endereço"
                  value={school.address}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="number">Número</label>
                <input
                  type="text"
                  name="number"
                  placeholder="Número"
                  value={school.number}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="cnpj">CNPJ</label>
                <input
                  type="text"
                  name="cnpj"
                  placeholder="CNPJ"
                  value={school.cnpj}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="studentCount">Número de Estudantes</label>
                <input
                  type="number"
                  name="studentCount"
                  placeholder="Quantidade de estudantes"
                  value={school.studentCount}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="foundationYear">Ano de Fundação</label>
                <input
                  type="text"
                  name="foundationYear"
                  placeholder="Ano de Fundação"
                  value={school.foundationYear}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="classroomCount">Número de Salas</label>
                <input
                  type="number"
                  name="classroomCount"
                  placeholder="Número de salas"
                  value={school.classroomCount}
                  onChange={handleSchoolChange}
                  required
                />
                <label htmlFor="courses">Cursos</label>
                <input
                  type="text"
                  name="courses"
                  placeholder="Adicionar novo curso"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                />
                <button type="button" onClick={handleAddCourse}>Adicionar Curso</button>
                <ul>
                  {tempCourses.map((course, index) => (
                    <li key={index}>{course}</li>
                  ))}
                </ul>
                <button type="submit">Cadastrar Escola</button>
              </form>
            </div>
          )}

          {/* Toggle para Cadastro de Turma */}
          <button onClick={() => setShowClassroomForm(!showClassroomForm)}>
            {showClassroomForm ? 'Fechar Cadastro de Turma' : 'Abrir Cadastro de Turma'}
          </button>
          {showClassroomForm && (
            <div className="box">
              <h3>Cadastro de Turma</h3>
              <form onSubmit={handleClassroomSubmit}>
                <label htmlFor="selectedSchool">Selecione a Escola</label>
                <select name="selectedSchool" value={classroom.selectedSchool} onChange={handleSchoolSelect} required>
                  <option value="">Escolha uma escola</option>
                  {schools.map((school, index) => (
                    <option key={index} value={school.name}>
                      {school.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="number">Número da Sala</label>
                <input
                  type="text"
                  name="number"
                  placeholder="Número da sala"
                  value={classroom.number}
                  onChange={handleClassroomChange}
                  required
                />
                <label htmlFor="studentCount">Número de Estudantes</label>
                <input
                  type="number"
                  name="studentCount"
                  placeholder="Quantidade de estudantes"
                  value={classroom.studentCount}
                  onChange={handleClassroomChange}
                  required
                />
                <label htmlFor="location">Localização</label>
                <input
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
                <button type="submit">Cadastrar Turma</button>
              </form>
            </div>
          )}

          {/* Toggle para Cadastro de Aluno */}
          <button onClick={() => setShowPersonForm(!showPersonForm)}>
            {showPersonForm ? 'Fechar Cadastro de Aluno' : 'Abrir Cadastro de Aluno'}
          </button>
          {showPersonForm && (
            <div className="box">
              <h3>Cadastro de Aluno</h3>
              <form onSubmit={handlePersonSubmit}>
                <label htmlFor="name">Nome do Aluno</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Insira o nome do aluno"
                  value={person.name}
                  onChange={handlePersonChange}
                  required
                />
                <label htmlFor="email">Email do Aluno</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Insira o email do aluno"
                  value={person.email}
                  onChange={handlePersonChange}
                  required
                />
                <label htmlFor="birthDate">Data de Nascimento</label>
                <input
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
                <button type="submit">Cadastrar Aluno</button>
              </form>
            </div>
          )}

          <button onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
