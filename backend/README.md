# SyncDoc Backend

SyncDoc Backend is the server-side component of **SyncDoc**, a collaborative document engine built around a structured **Abstract Syntax Tree (AST)**.

## 🚧 Project Status

| Phase                           | Status     |
| ------------------------------- | ---------- |
| Week 1 — AST Foundation         | ✅ Complete |
| Week 2 — Yjs + WebSocket + CRDT | 🚧 Next    |

**Current Phase:** Week 1 — AST Foundation

---

## ✨ Features

* Node.js + Express + TypeScript
* MongoDB + Mongoose
* Nested AST document storage
* Recursive AST validation
* Node ID and node type validation
* Duplicate node ID detection
* Child relationship validation
* Mongoose pre-save validation
* Document CRUD REST APIs
* Vitest automated tests

---

## 🌳 AST Node Types

SyncDoc currently supports:

* `heading`
* `paragraph`
* `code`
* `list`
* `listItem`

Documents are stored as nested AST structures instead of plain text.

```text
Document
 ├── Heading
 ├── Paragraph
 ├── List
 │    └── List Item
 └── Code
```

---

## 🔐 AST Validation

Before saving a document, the backend validates:

* Node IDs
* Node types
* Required content
* Duplicate IDs
* Parent-child relationships
* Deeply nested nodes

### Validation Flow

```text
Document.create()
      ↓
Mongoose
      ↓
validateAST()
      ↓
AST Validation
      ↓
MongoDB
```

Invalid AST data is rejected before being stored.

---

## 🔌 REST API

**Base URL:** `http://localhost:5000/api`

| Method | Endpoint         | Purpose           |
| ------ | ---------------- | ----------------- |
| GET    | `/health`        | Health check      |
| GET    | `/documents`     | Get all documents |
| GET    | `/documents/:id` | Get one document  |
| POST   | `/documents`     | Create document   |
| PUT    | `/documents/:id` | Update document   |
| DELETE | `/documents/:id` | Delete document   |

---

## 🏗️ Architecture

```text
Client
  ↓
Express Routes
  ↓
Controllers
  ↓
AST Validator
  ↓
Mongoose
  ↓
MongoDB
```

---

## 📁 Project Structure

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── server.ts
├── tests/
├── dist/
├── .env
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | Runtime               |
| Express    | REST API              |
| TypeScript | Type safety           |
| MongoDB    | Database              |
| Mongoose   | MongoDB ODM           |
| Helmet     | Security              |
| CORS       | Cross-origin requests |
| dotenv     | Environment variables |
| Vitest     | Testing               |

---

## 📦 Installation

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Do not commit `.env` to Git.

---

## ▶️ Development

```bash
npm run dev
```

Server:

```text
http://localhost:5000
```

---

## 🏗️ Production Build

```bash
npm run build
npm start
```

---

## 🧪 Testing

```bash
npm test
```

Current AST tests cover:

* Valid AST
* Missing node ID
* Invalid node type
* Missing content
* Duplicate node IDs
* Invalid child relationships
* Valid nested AST
* Invalid deeply nested AST

**Current result:**

```text
Test Files  1 passed
Tests       8 passed
```

---

## 🗓️ Week 1 Progress

* [x] Express + TypeScript setup
* [x] MongoDB + Mongoose
* [x] AST schema
* [x] Recursive AST validation
* [x] Pre-save validation
* [x] Automated tests
* [x] Document CRUD APIs
* [x] Production build

**Week 1: ✅ Complete**

---

## 🚧 Week 2 — CRDT Synchronization

Planned:

* [ ] WebSocket infrastructure
* [ ] Yjs integration
* [ ] CRDT synchronization
* [ ] Collaborative document state
* [ ] Block-level synchronization
* [ ] Localized block locking
* [ ] Real-time client synchronization

### Target Architecture

```text
User A
  ↓
React + Yjs
  ↓
WebSocket
  ↓
SyncDoc Sync Engine
  ├──→ User B
  └──→ User C
```

---

## 🗺️ Roadmap

```text
Week 1
AST + MongoDB + REST API
        ↓
Week 2
Yjs + WebSocket + CRDT
        ↓
Week 3
AST Transformation + Export
        ↓
Week 4
Security + Performance
```

---

## 📌 Current Status

**Project:** SyncDoc
**Backend:** ✅ Week 1 Complete
**Next:** 🚧 Yjs + WebSocket + CRDT Synchronization

```text
MongoDB
   ↓
Mongoose
   ↓
AST Schema
   ↓
AST Validation
   ↓
Vitest Tests
   ↓
REST CRUD API
   ↓
✅ WEEK 1 COMPLETE
```
