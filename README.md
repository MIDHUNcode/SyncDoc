# SyncDoc

**SyncDoc** is a real-time collaborative document engine designed for multi-user structural document editing.

Unlike traditional plain-text editors, SyncDoc represents documents as an **Abstract Syntax Tree (AST)**. This allows structural changes to be tracked at the block level and prepares the system for conflict-free synchronization using **Yjs and CRDTs**.

---

## 🚧 Project Status

**Current Phase:** Week 1 — AST Foundation  
**Status:** ✅ Week 1 Foundation Complete  
**Next:** Week 2 — Yjs + CRDT Synchronization

### Week 1 Progress

#### Backend
-  Project structure
-  Node.js + Express
-  TypeScript configuration
-  CORS
-  Helmet
-  dotenv
-  Nodemon
-  TSX development runner
-  Express health endpoint
-  MongoDB connection
-  Mongoose configuration
-  AST TypeScript types
-  Nested AST Mongoose schemas
-  Recursive AST validation
-  Duplicate node ID validation
-  Invalid node type validation
-  Structural child relationship validation
-  Recursive Mongoose pre-save validation
-  Automated AST tests with Vitest
-  Document REST API
-  Create Document API
-  List Documents API
-  Get Document API
-  Update Document API
-  Delete Document API

#### Frontend
-  React + TypeScript + Vite
-  ESLint
-  Document browser
-  Fetch documents from REST API
-  Document selection
-  Fetch complete document AST
-  AST document viewer
-  Recursive AST block rendering
-  Heading block rendering
-  Paragraph block rendering
-  Code block rendering
-  List block rendering
-  Nested child block rendering
-  Editable paragraph blocks
-  Editable heading blocks
-  Editable code blocks
-  Basic block-level editor foundation
-  Frontend production build verified

#### Week 2 — Next
-  Persist frontend edits to MongoDB
-  Yjs client integration
-  WebSocket synchronization
-  CRDT-based collaborative editing
-  Real-time document updates
-  User presence
-  Active editing indicators
-  Localized block locking

---

# 🖥️ Current Frontend

The SyncDoc frontend is built using:

- React
- TypeScript
- Vite
- ESLint

The frontend communicates with the Express backend through REST APIs.

### Frontend Development Server

```bash
cd frontend
npm install
npm run dev