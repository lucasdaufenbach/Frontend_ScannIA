# Sistema de Reconhecimento Facial para Controle de Acesso - Repositório destinado ao Front-End

### Licença
MIT License

---

### Descrição

Este projeto implementa um sistema para controle de acesso baseado em reconhecimento facial, com foco na gestão de interiores escolares. O objetivo é aumentar a segurança e otimizar a utilização dos espaços por meio da automação e geração de relatórios detalhados.

---

### Começando
Estas instruções ajudarão você a configurar o ambiente local para desenvolvimento e testes.

---


### Funcionalidades
1. **APIs RESTful para CRUD**:
   - Alunos, Escolas, Turmas e Usuários.
   - Login seguro com autenticação por hash de senha.
2. **Reconhecimento Facial**:
   - Validação biométrica com suporte a múltiplos perfis faciais.
   - Verificação de qualidade e textura da imagem.
   - Reconhecimento com confirmação via piscadas.
3. **Armazenamento Seguro**:
   - Fotos dos alunos e logs de auditoria são armazenados no banco PostgreSQL.
4. **Logs e Relatórios**:
   - Registro de acessos no banco de dados.
   - Suporte opcional para análise visual com Power BI.

---

### Pré-requisitos
- Python 3.9 ou superior  
- PostgreSQL instalado e configurado  
- OpenCV para processamento de imagens  
- Biblioteca Face Recognition para detecção facial  
- MediaPipe para suporte a landmarks faciais  

---

### Ferramentas Utilizadas
- FastAPI: Framework para APIs rápidas e robustas.
- OpenCV: Para captura e processamento de imagens.
- MediaPipe: Framework de visão computacional para landmarks faciais.
- Face Recognition: Biblioteca para reconhecimento facial preciso.
- PostgreSQL: Banco de dados relacional para armazenar informações.
- bcrypt: Para segurança no armazenamento de senhas.

---

### Autores
- Aluno 1: Angiel Leal - (https://github.com/angielleal)
- Aluno 2: Lucas Daufenbach - (https://github.com/lucasdaufenbach)
- Aluno 3: Marcos Jeronimo - (https://github.com/marcoshjf)
- Aluno 4: Mateus Zanin - (https://github.com/Zaanin)

---

### Referências
- Documentação oficial do OpenCV.
- Documentação oficial do MediaPipe.
- Biblioteca Face Recognition.
