# 🚀 KidneyCare

A modern Kidney Centryic full-stack web application built with **React, Express, PostgreSQL, and OpenAI**.

> 🚧 **Status:** In Development

## 📖 About

**KidneyCare** is a full-stack web application currently in its initial development stage. This repository contains the project's boilerplate and foundational setup, which will be expanded as features are implemented.

The application is designed with a separate frontend and backend architecture, with PostgreSQL handling persistent data and AI-powered functionality provided by ChatGPT.

---

## 🛠️ Tech Stack

### Frontend

<p align="left">
  <a href="https://react.dev/" target="_blank">
    <img src="static/react-original.svg" alt="React" width="50" height="50"/>
  </a>
</p>

**React** — Frontend library used to build the application's user interface.

### Backend

<p align="left">
  <a href="https://expressjs.com/" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" width="50" height="50"/>
  </a>
</p>

**Express** — Backend framework used to build the application's REST API and server-side logic.

### AI Provider

<p align="left">
  <a href="https://openai.com/" target="_blank">
    <img src="static/chatgpt-logo.png" alt="ChatGPT / OpenAI" width="100" height="50"/>
  </a>
</p>

**ChatGPT / OpenAI** — AI provider used to power AI-related functionality within the application.

### Database

<p align="left">
  <a href="https://www.postgresql.org/" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="50" height="50"/>
  </a>
</p>

**PostgreSQL** — Relational database used for persistent application data.

---

## 🔧 Tools

| Tool            | Purpose                                                                  |
| --------------- | ------------------------------------------------------------------------ |
| **Postman**     | API development and HTTP endpoint testing                                |
| **JWT**         | Authentication and authorization                                         |
| **Drizzle ORM** | Database queries, schema management, and type-safe database interactions |

### Postman

Used to test and validate API endpoints during backend development.

### JWT

Used for secure authentication and maintaining authenticated sessions between the client and server.

### Drizzle ORM

Used as the application's ORM for interacting with PostgreSQL and managing database schemas in a type-safe way.

---

## 🏗️ Architecture

The application follows a full-stack architecture:

```text
┌─────────────────────┐
│      React          │
│     Frontend        │
└──────────┬──────────┘
           │
           │ HTTP / REST API
           ▼
┌─────────────────────┐
│      Express        │
│      Backend        │
└──────┬─────────┬────┘
       │         │
       │         │ AI Requests
       │         ▼
       │   ┌──────────────┐
       │   │   ChatGPT    │
       │   │  / OpenAI    │
       │   └──────────────┘
       │
       │ Database Queries
       ▼
┌─────────────────────┐
│    Drizzle ORM      │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│     PostgreSQL      │
└─────────────────────┘
```

---

## 📂 Project Status

The project is currently in the **boilerplate stage**.

Planned development includes:

* [✅] Application structure
* [✅] Express backend
* [ ] React frontend
* [ ] PostgreSQL database
* [ ] Drizzle ORM setup
* [ ] JWT authentication
* [ ] AI integration
* [ ] Core UI components
* [ ] API integration
* [ ] Testing with Postman
* [ ] Production deployment

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm
* PostgreSQL

### Installation

```bash
# Clone the repository
git clone https://github.com/Alyssandria/kidney-thesis 

# Navigate to the project
cd kidney-thesis

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application should then be available at the local development URL provided by your terminal.

---

## 🔐 Environment Variables

Create a `.env` file and configure the required environment variables:

```env
DATABASE_URL=
JWT_SECRET=
OPENAI_API_KEY=
```

> ⚠️ Never commit your `.env` file or API keys to version control.

---

## 🧪 API Testing

API endpoints can be tested using **Postman** during development.

## 📌 Future Improvements

Additional technologies, features, and architectural decisions will be documented here as development progresses.

---

## 👩‍💻 Development

This project is currently under active development. The README will be updated as new features, technologies, and architectural decisions are introduced.
