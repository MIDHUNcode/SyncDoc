# SyncDoc Backend

SyncDoc Backend is the server-side component of **SyncDoc**, a real-time collaborative document engine built around a structured **Abstract Syntax Tree (AST)**.

The backend provides:

- AST document persistence
- Recursive AST validation
- REST APIs
- Yjs collaborative document management
- WebSocket synchronization
- CRDT-based real-time collaboration
- User presence management
- Block-level locking
- AST transformation
- PDF generation
- PDF export API

---

## 🚧 Project Status

| Phase | Status |
|---|---|
| Week 1 — AST Foundation | ✅ Complete |
| Week 2 — Yjs + WebSocket + CRDT | ✅ Complete |
| Week 3 — Transformation & PDF Export | 🚧 In Progress |

**Current Phase:** Week 3 — Transformation & PDF Export

---

# ✨ Features

## Week 1 — AST Foundation

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Nested AST document storage
- Recursive AST validation
- Node ID validation
- Node type validation
- Duplicate node ID detection
- Child relationship validation
- Deeply nested AST validation
- Mongoose pre-save validation
- Document CRUD REST APIs
- Vitest automated tests

## Week 2 — Real-Time Collaboration

- Yjs document management
- Yjs WebSocket synchronization
- CRDT-based collaborative state
- AST → Yjs conversion
- Yjs → AST conversion
- Multi-client synchronization
- User presence
- Presence cleanup
- Block-level locking
- Lock acquisition
- Lock release
- Lock refresh
- Lock expiration
- Expired lock cleanup
- Reconnection support
- Collaboration error handling

## Week 3 — Transformation & PDF Export

- AST → ExportDocument transformation
- Export-specific node structures
- Heading transformation
- Paragraph transformation
- Code transformation
- List transformation
- Nested list transformation
- PDF document generation
- PDF heading rendering
- PDF paragraph rendering
- PDF code rendering
- PDF list rendering
- PDF export controller
- PDF export REST API
- Downloadable PDF documents

---

# 🌳 AST Node Types

SyncDoc currently supports:

- `heading`
- `paragraph`
- `code`
- `list`
- `listItem`

Documents are stored as nested AST structures instead of plain text.

```text
Document
 ├── Heading
 ├── Paragraph
 ├── List
 │    ├── List Item
 │    └── List Item
 │         └── Nested List
 └── Code
```

The core AST structure is:

```ts
interface ASTNode {
  id: string;
  type: ASTNodeType;
  content?: string;
  attributes?: Record<string, unknown>;
  children?: ASTNode[];
}
```

---

# 🔐 AST Validation

Before documents are persisted, the backend validates the AST recursively.

Validation includes:

* Node IDs
* Node types
* Required content
* Duplicate node IDs
* Parent-child relationships
* Nested children
* Structural AST correctness

### Validation Flow

```text
Document.create()
      ↓
Mongoose
      ↓
validateAST()
      ↓
Recursive AST Validation
      ↓
MongoDB
```

Invalid AST structures are rejected before being stored.

---

# 🔌 REST API

**Base URL:**

```text
http://localhost:5000/api
```

## Document APIs

| Method | Endpoint         | Purpose           |
| ------ | ---------------- | ----------------- |
| GET    | `/documents`     | Get all documents |
| GET    | `/documents/:id` | Get one document  |
| POST   | `/documents`     | Create document   |
| PUT    | `/documents/:id` | Update document   |
| DELETE | `/documents/:id` | Delete document   |

## Export API

| Method | Endpoint                    | Purpose                |
| ------ | ---------------------------- | ---------------------- |
| GET    | `/documents/:id/export/pdf` | Export document as PDF |

## Health API

| Method | Endpoint  | Purpose      |
| ------ | --------- | ------------ |
| GET    | `/health` | Health check |

---

# 🤝 Yjs + CRDT Collaboration

Week 2 introduced real-time collaborative document synchronization using **Yjs and WebSockets**.

The backend maintains Yjs documents for connected SyncDoc clients.

### Collaboration Flow

```text
User A
   │
   ▼
React + Yjs
   │
   ▼
WebSocket
   │
   ▼
SyncDoc WebSocket Server
   │
   ▼
Yjs CRDT Document
   │
   ├───────────────┐
   ▼               ▼
User B           User C
```

Changes from one client are synchronized to other connected clients through Yjs updates.

---

# 🧠 Yjs Document Management

The backend contains a dedicated Yjs document manager responsible for maintaining collaborative document state.

Responsibilities include:

* Creating Yjs documents
* Retrieving existing Yjs documents
* Managing document lifecycle
* Maintaining shared Yjs state
* Applying Yjs updates
* Synchronizing connected clients

Architecture:

```text
MongoDB AST
     │
     │ Initial document
     ▼
Yjs Document Manager
     │
     ▼
Y.Doc
     │
     ├── Y.Array
     ├── Y.Map
     └── Shared State
```

---

# 🔄 AST ↔ Yjs Conversion

SyncDoc maintains conversion between its persistent AST representation and Yjs collaborative state.

```text
              ┌─────────────┐
              │     AST     │
              └──────┬──────┘
                     │
                AST → Yjs
                     │
                     ▼
              ┌─────────────┐
              │ Yjs Document│
              └──────┬──────┘
                     │
                Yjs → AST
                     │
                     ▼
              ┌─────────────┐
              │     AST     │
              └─────────────┘
```

This separation allows MongoDB to remain the persistence layer while Yjs manages real-time collaborative state.

---

# 🔌 WebSocket Server

The backend provides a WebSocket endpoint for collaborative document connections.

Example:

```text
ws://localhost:5000/collab?documentId=<DOCUMENT_ID>
```

The WebSocket layer handles:

* Client connections
* Client disconnections
* Yjs synchronization
* Update broadcasting
* Presence messages
* Collaboration lifecycle
* Connection cleanup

---

# 👥 User Presence

The collaboration layer supports real-time user presence.

Implemented:

* User identification
* Presence initialization
* Presence updates
* Presence cleanup
* Disconnect cleanup
* Multiple connected users
* User name synchronization

Example:

```text
Document
│
├── User A → Online
├── User B → Online
└── User C → Online
```

Presence state is synchronized through the collaborative Yjs document.

---

# 🔒 Block-Level Locking

SyncDoc implements localized block-level editing locks.

Instead of locking an entire document, individual AST blocks can be locked.

```text
Document
│
├── Heading       → User A 🔒
├── Paragraph     → Available
├── Code          → User B 🔒
└── List          → Available
```

Implemented:

* Lock acquisition
* Lock release
* Lock refresh
* Lock expiration
* Expired lock cleanup
* Lock ownership
* Multi-client lock safety

### Lock Lifecycle

```text
Acquire
   ↓
Active
   ↓
Refresh
   ↓
Continue Editing
   ↓
Release
   ↓
Available
```

This prevents two users from simultaneously editing the same locked block while allowing collaboration elsewhere in the document.

---

# 🔄 Reconnection & Connection Safety

The collaboration system handles temporary client connection failures.

```text
Client
  │
  ▼
Connected
  │
  X
Connection Lost
  │
  ▼
Cleanup
  │
  ▼
Reconnect
  │
  ▼
Synchronize
  │
  ▼
Connected
```

The collaboration layer also cleans up stale presence and expired locks.

---

# 📄 Transformation Engine

Week 3 introduced a pure AST transformation layer.

The transformation layer converts internal AST nodes into an export-specific representation.

```text
ASTNode
   │
   ▼
transformAST()
   │
   ├── heading
   ├── paragraph
   ├── code
   ├── list
   └── listItem
   │
   ▼
ExportDocument
```

The export model intentionally does not copy collaboration-specific information such as node IDs.

---

# 🧩 Export Node Types

The backend uses an export-specific structure:

```ts
interface ExportNode {
  type:
    | "heading"
    | "paragraph"
    | "code"
    | "list"
    | "listItem";

  content?: string;
  level?: number;
  language?: string;
  children?: ExportNode[];
}

interface ExportDocument {
  title: string;
  nodes: ExportNode[];
}
```

---

# 📑 PDF Generation

The backend generates PDF documents using **PDFKit**.

PDF generation is separated from the AST transformation layer.

```text
AST
 │
 ▼
ExportDocument
 │
 ▼
PDF Generator
 │
 ├── Heading Renderer
 ├── Paragraph Renderer
 ├── Code Renderer
 └── List Renderer
 │
 ▼
PDFDocument
```

This separation allows the transformation engine to remain independent of the PDF implementation.

---

# 📤 PDF Export API

The backend provides:

```http
GET /api/documents/:id/export/pdf
```

The export pipeline is:

```text
MongoDB Document
       │
       ▼
     AST
       │
       ▼
 transformAST()
       │
       ▼
 ExportDocument
       │
       ▼
 generatePDF()
       │
       ▼
 HTTP PDF Response
       │
       ▼
 Browser Download
```

The endpoint generates a PDF from the current document structure.

---

# 🏗️ Backend Architecture

The current backend architecture is:

```text
                         Client
                           │
             ┌─────────────┴─────────────┐
             │                           │
          REST API                  WebSocket
             │                           │
             ▼                           ▼
       Express Routes             Yjs Server
             │                           │
             ▼                           ▼
       Controllers                Yjs Document
             │                           │
             ▼                           │
       MongoDB / AST                     │
                                         │
                         ┌───────────────┘
                         │
                         ▼
                   Collaboration
                         │
              ┌──────────┴──────────┐
              │                     │
          Presence              Block Locks

AST
 │
 ▼
Transformation Engine
 │
 ▼
ExportDocument
 │
 ▼
PDF Generator
 │
 ▼
PDF Export API
```

---

# 📁 Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   │
│   ├── controllers/
│   │   └── exportController.ts
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │   └── Document.ts
│   │
│   ├── routes/
│   │   └── documentRoutes.ts
│   │
│   ├── services/
│   │   │
│   │   ├── collaboration/
│   │   │   ├── yjsDocumentManager.ts
│   │   │   ├── websocketServer.ts
│   │   │   └── astToYjs.ts
│   │   │
│   │   ├── transformation/
│   │   │   ├── astTransformer.ts
│   │   │   ├── types.ts
│   │   │   └── nodeTransformers/
│   │   │       ├── headingTransformer.ts
│   │   │       ├── paragraphTransformer.ts
│   │   │       ├── codeTransformer.ts
│   │   │       └── listTransformer.ts
│   │   │
│   │   └── pdf/
│   │       ├── pdfGenerator.ts
│   │       └── renderers/
│   │           ├── headingRenderer.ts
│   │           ├── paragraphRenderer.ts
│   │           ├── codeRenderer.ts
│   │           └── listRenderer.ts
│   │
│   ├── tests/
│   │   ├── astValidator.test.ts
│   │   ├── astToYjs.test.ts
│   │   ├── astTransformer.test.ts
│   │   └── pdfGenerator.test.ts
│   │
│   ├── types/
│   │   └── ast.ts
│   │
│   └── server.ts
│
├── dist/
├── .env
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

# 🛠️ Technology Stack

| Technology | Purpose                     |
| ---------- | ---------------------------- |
| Node.js    | Runtime                     |
| Express    | REST API                    |
| TypeScript | Type safety                 |
| MongoDB    | Persistent document storage |
| Mongoose   | MongoDB ODM                 |
| Yjs        | Collaborative shared state  |
| WebSocket  | Real-time synchronization   |
| CRDT       | Conflict-free collaboration |
| PDFKit     | PDF generation              |
| Helmet     | Security                    |
| CORS       | Cross-origin requests       |
| dotenv     | Environment configuration   |
| Vitest     | Automated testing           |

---

# 📦 Installation

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

# ▶️ Development

Start the backend development server:

```bash
npm run dev
```

Server:

```text
http://localhost:5000
```

The WebSocket collaboration endpoint is:

```text
ws://localhost:5000/collab?documentId=<DOCUMENT_ID>
```

---

# 🏗️ Production Build

```bash
npm run build
npm start
```

---

# 🧪 Testing

Run the complete backend test suite:

```bash
npm test
```

Current tests cover:

### AST Validation

* Valid AST
* Missing node ID
* Invalid node type
* Missing content
* Duplicate node IDs
* Invalid child relationships
* Valid nested AST
* Invalid deeply nested AST

### AST → Yjs

* AST conversion
* Yjs node creation
* Nested structure conversion
* Collaborative state conversion

### AST Transformation

* Heading transformation
* Paragraph transformation
* Code transformation
* List transformation
* Complete AST transformation

### PDF Generation

* PDF document generation
* PDF content generation

Current test result:

```text
Test Files  4 passed
Tests       20 passed
```

---

# 🗓️ Week 1 Progress

### Completed

*  Express + TypeScript setup
*  MongoDB + Mongoose
*  AST schema
*  Recursive AST validation
*  Duplicate node validation
*  Child relationship validation
*  Mongoose pre-save validation
*  Automated AST tests
*  Document CRUD APIs
*  Production build

**Week 1: ✅ Complete**

---

# 🗓️ Week 2 Progress

### Yjs

*  Yjs integration
*  Yjs document manager
*  Yjs WebSocket server
*  Yjs synchronization
*  AST → Yjs conversion
*  Yjs → AST conversion

### Collaboration

*  Real-time document synchronization
*  Multi-client synchronization
*  User presence
*  Presence cleanup
*  User identity
*  Block-level locking
*  Lock acquisition
*  Lock release
*  Lock refresh
*  Lock expiration
*  Expired lock cleanup
*  Reconnection handling
*  Collaboration error handling
*  Multi-client validation

**Week 2: ✅ Complete**

---

# 🗓️ Week 3 Progress

### Transformation

*  Transformation service architecture
*  Export node types
*  AST → ExportDocument
*  Heading transformation
*  Paragraph transformation
*  Code transformation
*  List transformation
*  Nested list transformation

### PDF

*  PDFKit integration
*  PDF document generation
*  Heading renderer
*  Paragraph renderer
*  Code renderer
*  List renderer
*  PDF generator tests
*  PDF export controller
*  PDF export endpoint
*  Browser PDF download

### Remaining

*  Advanced PDF formatting
*  Improved page layout
*  Export validation
*  Advanced code formatting
*  Final PDF quality testing

**Week 3: 🚧 In Progress**

---

# 🗺️ Roadmap

```text
Week 1
AST + MongoDB + REST API
        │
        ▼
Week 2
Yjs + WebSocket + CRDT
        │
        ▼
Week 3
AST Transformation + PDF Export
        │
        ▼
Week 4
Security + Performance
```

---

# 📊 Current Status

**Project:** SyncDoc

**Backend:**

```text
Week 1 — AST Foundation
████████████████████ 100%

Week 2 — Yjs + CRDT Collaboration
████████████████████ 100%

Week 3 — Transformation + PDF Export
████████████████░░░░ 80%
```

Current backend pipeline:

```text
                    ┌───────────────┐
                    │    Client     │
                    └───────┬───────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
              REST API             WebSocket
                 │                     │
                 ▼                     ▼
             Express                Yjs/CRDT
                 │                     │
                 ▼                     ▼
             MongoDB             Collaboration
                 │                     │
                 └──────────┬──────────┘
                            │
                            ▼
                           AST
                            │
                            ▼
                    Transformation
                            │
                            ▼
                     ExportDocument
                            │
                            ▼
                       PDF Generator
                            │
                            ▼
                       PDF Export
```

**Current milestone:** Real-time collaboration and PDF export are functional.

**Next milestone:** PDF formatting and transformation/export refinement.