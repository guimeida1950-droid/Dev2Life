# 🚀 Dev2Life

Olá! Este é o **Dev2Life**, um projeto que estou desenvolvendo para colocar em prática meus conhecimentos de programação e evoluir como desenvolvedor Full Stack.

A ideia é criar uma plataforma que ajude programadores a aprender, organizar suas ideias, compartilhar conhecimento e desenvolver projetos. Atualmente, estou trabalhando na aplicação de notas e na integração entre frontend, backend, autenticação e banco de dados.

## 🎯 Objetivo do projeto

Meu objetivo com o Dev2Life é aprender construindo uma aplicação real, entender como as tecnologias trabalham juntas e desenvolver minhas habilidades em desenvolvimento web.

## ✨ Funcionalidades

- 📝 Interface para visualizar e organizar notas.
- 🔐 Autenticação de usuários com Firebase Authentication.
- ⚙️ API REST desenvolvida com Java e Spring Boot.
- 👤 Associação das notas ao usuário autenticado.
- 🗄️ Armazenamento de dados em MySQL.
- 🔗 Integração entre frontend e backend.

> **Status:** projeto em desenvolvimento. Estou implementando e aprimorando as funcionalidades gradualmente.

## 🛠️ Tecnologias utilizadas

### Frontend
- React
- JavaScript
- Vite
- CSS

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- API REST

### Banco de dados e autenticação
- MySQL
- JDBC
- Firebase Authentication
- Firebase Admin SDK

## 🏗️ Como tudo funciona junto

```text
Usuário
   │
   ▼
Frontend — React
(App.jsx, Notas.jsx, Notas.css)
   │
   │ Requisição HTTP + token Firebase
   ▼
Backend — Java / Spring Boot
(NotaController.java)
   │
   ▼
NotaRepository.java
   │
   ▼
JPA / Hibernate + JDBC
   │
   ▼
MySQL — banco dev2life
   │
   ▼
Resposta da API para o React
```

**Fluxo da aplicação:**

1. O usuário interage com a interface desenvolvida em React.
2. O Firebase Authentication gerencia a autenticação do usuário.
3. O frontend envia requisições HTTP para o backend com o token de autenticação.
4. O backend valida o token e identifica o usuário.
5. O `NotaController` recebe e processa as requisições.
6. O `NotaRepository` acessa os dados por meio do Spring Data JPA.
7. O Hibernate realiza o mapeamento entre os objetos Java e as tabelas do MySQL.
8. A API retorna uma resposta e o frontend atualiza a interface.

## 📂 Estrutura do projeto

```text
Dev2Life/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.*
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── .gitignore
└── README.md
```

## 🗄️ Configurando o banco de dados MySQL

Para criar o banco de dados, utilizo os seguintes comandos SQL:

### 1. Criar o banco

```sql
CREATE DATABASE dev2life;
```

### 2. Verificar os bancos existentes

```sql
SHOW DATABASES;
```

### 3. Selecionar o banco do projeto

```sql
USE dev2life;
```

### 4. Verificar as tabelas

```sql
SHOW TABLES;
```

### 5. Consultar os registros das notas

Se a tabela estiver nomeada como `nota`:

```sql
SELECT * FROM nota;
```

Se estiver nomeada como `notas`:

```sql
SELECT * FROM notas;
```

O nome da tabela depende do mapeamento configurado na entidade Java `Nota` e no JPA/Hibernate.

## ⚙️ Como executar o projeto

### Pré-requisitos

Antes de executar, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- [Java JDK](https://adoptium.net/) — o projeto foi configurado para Java 21
- MySQL Server
- [Git](https://git-scm.com/)
- Uma conta e um projeto configurado no [Firebase Console](https://console.firebase.google.com/)

### 1. Configurar o banco de dados

Crie o banco `dev2life` no MySQL usando os comandos SQL apresentados anteriormente.

### 2. Executar o backend

Entre na pasta do backend:

```powershell
cd backend
```

Configure as variáveis de ambiente no PowerShell, substituindo os valores de exemplo pelos dados da sua instalação:

```powershell
$env:DB_USERNAME = "seu_usuario_mysql"
$env:DB_PASSWORD = "sua_senha_mysql"
```

Configure também as credenciais do Firebase no caminho esperado pela aplicação:

```text
backend/secrets/firebase-service-account.json
```

Esse arquivo contém informações privadas e **não deve ser enviado ao GitHub**.

Confira as configurações do arquivo `application.properties`, principalmente a URL do banco, as variáveis de ambiente e o caminho das credenciais do Firebase.

Para iniciar o backend no Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

O backend utiliza a porta `8080`, conforme a configuração atual do projeto.

### 3. Executar o frontend

Abra outro terminal e entre na pasta do frontend:

```powershell
cd frontend
```

Instale as dependências:

```powershell
npm install
```

Inicie a aplicação:

```powershell
npm run dev
```

O frontend do Vite normalmente fica disponível em:

http://localhost:5173

Também é necessário configurar o Firebase no frontend de acordo com o arquivo de configuração utilizado no projeto.

## 🔐 Segurança

Durante o desenvolvimento, tenho cuidado para não expor informações sensíveis.

- Não enviar senhas ou tokens para o GitHub.
- Não versionar arquivos `.env` com credenciais.
- Não enviar o arquivo `firebase-service-account.json`.
- Manter as credenciais fora do código-fonte.
- Validar a autenticação no backend.
- Utilizar permissões adequadas para o acesso ao banco de dados.

## 📚 O que estou aprendendo com esse projeto

Com o Dev2Life, estou praticando:

- Desenvolvimento de interfaces com React.
- Programação backend com Java e Spring Boot.
- Criação e integração de APIs REST.
- Modelagem e persistência de dados com MySQL.
- Integração com Firebase Authentication.
- Organização de projetos Full Stack.
- Depuração de erros e resolução de problemas.

## 🛣️ Próximos passos

Quero continuar evoluindo o projeto, aprimorando a interface, adicionando testes e melhorando o tratamento de erros.

Também pretendo expandir a ideia original do Dev2Life para incluir trilhas de aprendizagem, publicação de projetos e recursos de comunidade para programadores.

## 👨‍💻 Sobre mim

Estou construindo este projeto como parte da minha jornada para me tornar desenvolvedor Full Stack. Quero aprender na prática, desenvolver projetos reais e evoluir continuamente minhas habilidades em programação.

Acredito que cada erro resolvido e cada funcionalidade implementada representam uma oportunidade de aprendizado.

**Dev2Life — aprendendo, construindo e evoluindo, uma linha de código por vez.** 🚀