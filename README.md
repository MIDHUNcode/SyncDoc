# SyncDoc

**SyncDoc** is a real-time collaborative document engine designed for multi-user structural document editing.

Unlike traditional plain-text editors, SyncDoc represents documents as an **Abstract Syntax Tree (AST)**. This allows structural changes to be tracked at the block level and prepares the system for conflict-free synchronization using **Yjs and CRDTs**.

---

## 🚧 Project Status

**Current Phase:** Week 1 — Foundation
**Completed:** Steps 1–2
**Next:** Step 3 — MongoDB + Mongoose

### Progress

*  Project structure
*  React + TypeScript frontend
*  Vite development environment
*  ESLint
*  Node.js backend
*  Express
*  TypeScript backend configuration
*  CORS
*  Helmet
*  dotenv
*  Nodemon
*  TSX development runner
*  Express health endpoint
*  TypeScript production build
*  MongoDB connection
*  Mongoose AST models
*  Recursive AST validation
*  Document REST API
*  Block-based editor
*  Yjs synchronization
*  CRDT conflict resolution
*  User presence
*  Real-time cursors
*  AST transformation
*  PDF/HTML export
*  DOMPurify security
*  Performance testing
*  Deployment

---

# 🎯 Problem Statement

Multi-user text editors can suffer from destructive overwrites and synchronization conflicts when multiple users edit the same document simultaneously.

Plain-text merging becomes especially difficult when documents contain complex structures such as:

* Headings
* Paragraphs
* Code blocks
* Lists
* Nested blocks
* Tables
* Other structured content

SyncDoc addresses this problem by representing documents as an **AST** and eventually synchronizing changes using **CRDT-based collaboration**.

---

# 💡 Example Use Case

Two engineers open the same technical specification.

### User A

Adds a new paragraph near the top:

```text
System Architecture

The API uses a distributed architecture.
```

### User B

At the same time, adds a code block lower in the document:

```javascript
const server = express();
```

Instead of one user's changes overwriting another user's work, SyncDoc will eventually use **Yjs + CRDT synchronization** to merge both changes safely.

Users will also see real-time block and presence indicators showing who is editing different parts of the document.

---

# 🏗️ Planned Architecture

```text
                    ┌─────────────────────┐
                    │    React Editor     │
                    │                     │
                    │ Block-based UI      │
                    │ Presence            │
                    │ Cursors             │
                    └──────────┬──────────┘
                               │
                         WebSocket / Yjs
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Synchronization     │
                    │ Engine              │
                    │                     │
                    │ Node.js + Yjs       │
                    │ CRDT                │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Express + Mongoose  │
                    │                     │
                    │ AST Document Store  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Transformation      │
                    │ Pipeline            │
                    │                     │
                    │ AST → HTML / PDF    │
                    │ DOMPurify           │
                    └─────────────────────┘
```

---

# 📁 Current Project Structure

```text
SyncDoc/
│
├── .gitignore
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── server.ts
│   │
│   ├── dist/
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    ├── package-lock.json
    ├── vite.config.ts
    └── tsconfig.json
```

---

# ⚙️ Current Backend

The backend is built with:

* Node.js
* Express
* TypeScript
* CORS
* Helmet
* dotenv
* Nodemon
* TSX

### Backend Development Server

```bash
cd backend
npm run dev
```

The development server runs on:

```text
http://localhost:5000
```

---

# ❤️ Health Check

SyncDoc currently exposes a basic health endpoint:

```http
GET /api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "SyncDoc API",
  "message": "Backend is running"
}
```

This confirms that the Express backend is running correctly.

---

# 🖥️ Current Frontend

The frontend is built using:

* React
* TypeScript
* Vite
* ESLint

### Frontend Development Server

```bash
cd frontend
npm run dev
```

The development server runs on:

```text
http://localhost:5173
```

---

# 🗄️ Database

MongoDB and Mongoose are planned for the next implementation stage.

The target architecture will store structured documents using nested AST nodes.

Example:

```json
{
  "title": "System Architecture",
  "nodes": [
    {
      "type": "heading",
      "content": "Architecture"
    },
    {
      "type": "paragraph",
      "content": "SyncDoc uses CRDT synchronization."
    },
    {
      "type": "code",
      "language": "javascript",
      "content": "console.log('SyncDoc');"
    }
  ]
}
```

---

# 🌳 AST Concept

SyncDoc will not treat a document as a single large text string.

Instead, a document will be represented as a tree:

```text
Document
│
├── Heading
│
├── Paragraph
│
├── Paragraph
│
├── CodeBlock
│
└── List
    ├── ListItem
    └── ListItem
```

This structure will eventually allow SyncDoc to synchronize individual structural changes instead of rebuilding the entire document.

---

# 🗓️ Development Roadmap

## Week 1 — AST Foundation

### Backend

*  Project setup
*  Express server
*  TypeScript configuration
*  Health endpoint
*  MongoDB connection
*  Mongoose configuration
*  AST schemas
*  Nested AST nodes
*  Recursive validation
*  Mongoose pre-save hooks
*  Document CRUD APIs

### Frontend

*  React + Vite setup
*  TypeScript
*  ESLint
*  Document browser
*  Block editor
*  Heading block
*  Paragraph block
*  Code block
*  List block
*  Recursive block rendering
*  Basic editing

---

# Week 2 — CRDT Synchronization

### Backend

*  WebSocket infrastructure
*  Yjs integration
*  CRDT synchronization
*  Collaborative document state
*  Block-level synchronization
*  Localized block locking

### Frontend

*  Yjs client integration
*  Real-time updates
*  User presence
*  Active editing indicators
*  Collaborative state rendering

---

# Mid-Project Review

### Backend

*  Markdown → JSON/AST architecture diagram
*  10 concurrent client stress test
*  Conflict resolution demonstration
*  Verify no destructive overwrites

### Frontend

*  Network delta handling
*  Local input protection
*  Verify incoming changes don't corrupt user input

---

# Week 3 — Transformation Engine

### Backend

*  AST transformation pipeline
*  AST → HTML
*  AST → PDF
*  Document export utilities

### Frontend

*  Block context management
*  Cursor position tracking
*  Selection bounds
*  Atomic block state
*  Efficient individual AST node updates

---

# Week 4 — Security & Polish

### Backend

*  DOMPurify integration
*  XSS protection
*  Sanitization pipeline
*  Security testing

### Frontend

*  Visual block state indicators
*  Real-time cursor synchronization
*  Presence improvements
*  UI polish
*  Performance optimization

---

# 🏁 Final Project Goals

By completion, SyncDoc should provide:

```text
┌────────────────────────────────────────────┐
│                  SyncDoc                   │
├────────────────────────────────────────────┤
│                                            │
│  Real-time collaborative editing           │
│                                            │
│  ✓ AST-based document model                │
│  ✓ Nested structural blocks                │
│  ✓ CRDT conflict resolution                │
│  ✓ Yjs synchronization                     │
│  ✓ Multi-user editing                      │
│  ✓ Live presence indicators                │
│  ✓ Real-time cursors                       │
│  ✓ AST → HTML transformation              │
│  ✓ AST → PDF transformation               │
│  ✓ DOMPurify XSS protection               │
│  ✓ Performance testing                     │
│                                            │
└────────────────────────────────────────────┘
```

---

# 🔧 Development Commands

## Backend

```bash
cd backend

npm install

npm run dev
```

Production build:

```bash
npm run build
```

Production start:

```bash
npm start
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📌 Current Milestone

```text
Project: SyncDoc
Phase: Week 1
Step: 2
Status: Backend foundation complete

Frontend:
React + TypeScript + Vite + ESLint
        ↓
Backend:
Node.js + Express + TypeScript
        ↓
Health API:
GET /api/health
        ↓
Next:
MongoDB + Mongoose
        ↓
AST Database
```

---

# 👨‍💻 Development Approach

SyncDoc is being developed incrementally.

Each major feature is implemented and tested before moving to the next stage.

The implementation order is:

```text
Project Setup
      ↓
Backend Foundation
      ↓
MongoDB
      ↓
AST Modeling
      ↓
Recursive Validation
      ↓
REST APIs
      ↓
React Block Editor
      ↓
Yjs
      ↓
CRDT Synchronization
      ↓
Presence + Cursors
      ↓
Transformation Pipeline
      ↓
Security
      ↓
Performance Testing
      ↓
Deployment
```
