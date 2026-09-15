# SyncDoc Backend

SyncDoc Backend is the server-side component of **SyncDoc**, a real-time collaborative document engine built around a structured **Abstract Syntax Tree (AST)**.

The backend provides:

* AST document persistence
* Recursive AST validation
* REST APIs
* Yjs collaborative document management
* WebSocket synchronization
* CRDT-based real-time collaboration
* User presence support
* Block-level locking support
* AST transformation
* Export document generation
* PDF generation
* PDF export API
* Collaborative AST integration
* Targeted AST block updates
* Collaboration lifecycle management
* Persistent collaborative document state

---

# 🚧 Project Status

| Phase                                     | Status     |
| ----------------------------------------- | ---------- |
| Week 1 — AST Foundation                   | ✅ Complete |
| Week 2 — Yjs + WebSocket + CRDT           | ✅ Complete |
| Week 3 — Transformation & PDF Export      | ✅ Complete |
| Week 4 — Security & Collaboration Support | ✅ Complete |

**Current Phase:** Week 4 — Security & Collaboration Support
**Backend Status:** ✅ Week 1 + Week 2 + Week 3 + Week 4 Complete

> **Note:** Week 4 security and advanced collaboration features are split between the frontend and backend. DOMPurify-based content sanitization, cursor/selection UI state, and block-state indicators are frontend responsibilities, while the backend continues to provide the collaborative Yjs/WebSocket infrastructure and document persistence required by them.

---

# ✨ Features

## Week 1 — AST Foundation

* Node.js + Express + TypeScript
* MongoDB + Mongoose
* Nested AST document storage
* Recursive AST validation
* Node ID validation
* Node type validation
* Duplicate node ID detection
* Child relationship validation
* Deeply nested AST validation
* Mongoose pre-save validation
* Document CRUD REST APIs
* Vitest automated tests

---

## Week 2 — Real-Time Collaboration

* Yjs document management
* Yjs WebSocket synchronization
* CRDT-based collaborative state
* AST → Yjs conversion
* Yjs → AST conversion
* Multi-client synchronization
* User presence support
* Presence cleanup
* Block-level locking support
* Lock acquisition
* Lock release
* Lock refresh
* Lock expiration
* Expired lock cleanup
* Reconnection support
* Collaboration error handling
* Connection lifecycle management

---

## Week 3 — Transformation & PDF Export

* Export architecture
* AST → ExportDocument transformation
* Export-specific node structures
* Heading transformation
* Paragraph transformation
* Code transformation
* List transformation
* Nested list transformation
* Transformation validation
* Transformation tests
* PDF document generation
* PDF heading rendering
* PDF paragraph rendering
* PDF code rendering
* PDF list rendering
* Nested list rendering
* PDF export controller
* PDF export REST API
* Downloadable PDF documents
* Yjs → AST integration for export
* Collaborative document export
* Cursor/context state design
* Atomic block state support
* AST block integration
* Targeted AST updates
* Selection and block state support
* Final transformation testing

---

# 🛡️ Week 4 — Security & Collaboration Support

Week 4 focused primarily on strengthening the collaborative editor and its security architecture.

The backend continues to provide the infrastructure required for:

* Collaborative Yjs state
* WebSocket synchronization
* Presence state
* Block-level locking
* Persistent AST documents
* Collaborative document export
* Connection lifecycle management
* Stale collaboration cleanup

The frontend adds the user-facing security and collaboration features on top of this backend infrastructure.

---

# 🌳 AST Node Types

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
 │    ├── List Item
 │    └── List Item
 │         └── Nested List
 └── Code
```

The core AST structure is:

```text
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

SyncDoc uses **Yjs and WebSockets** for real-time collaborative document synchronization.

The backend maintains Yjs documents for connected clients.

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
* Loading MongoDB AST into Yjs
* Managing Yjs document lifecycle
* Maintaining shared Yjs state
* Applying Yjs updates
* Synchronizing connected clients
* Persisting collaborative state
* Cleaning up inactive Yjs documents

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

The conversion layer allows the application to maintain a structural AST while Yjs manages collaborative state.

---

# 🔌 WebSocket Server

The backend provides a WebSocket endpoint for collaborative document connections.

```text
ws://localhost:5000/collab?documentId=<DOCUMENT_ID>
```

The WebSocket layer handles:

* Client connections
* Client disconnections
* Yjs synchronization
* Update broadcasting
* Presence messages
* Connection lifecycle
* Connection cleanup
* Document-specific client management

Each document maintains a shared Yjs update handler so updates are correctly broadcast to other clients connected to the same document.

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
* Connection-aware presence

The frontend uses this collaborative presence state to display online collaborators.

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

This prevents conflicting edits on the same block while allowing users to collaborate on different blocks.

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

The collaboration layer also handles:

* Stale presence cleanup
* Expired lock cleanup
* Socket cleanup
* Yjs document lifecycle
* Connection error handling

---

# 🧩 Transformation Engine

The transformation engine converts the internal AST into an export-oriented document structure.

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

This separation allows PDF rendering to operate independently of the internal AST representation.

---

# 📦 Export Document Structure

The transformation engine uses an export-specific representation.

```text
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

Collaboration-specific fields such as internal node IDs do not need to be exposed to the export layer.

---

# 🔁 AST Transformation Pipeline

The complete transformation pipeline is:

```text
Collaborative Yjs State
          │
          ▼
       Yjs → AST
          │
          ▼
        ASTNode
          │
          ▼
    transformAST()
          │
          ▼
    ExportDocument
          │
          ▼
      PDF Generator
```

Supported transformations include:

* Heading
* Paragraph
* Code
* List
* List Item
* Nested lists
* Mixed AST documents
* Empty nodes
* Multiple heading levels

---

# 🧠 Block Management & Transformation State

The backend collaboration architecture supports structured block-level editing.

The collaborative state provides the foundation for tracking:

* Block identity
* Editing ownership
* Lock state
* Collaborative document state
* AST block updates

The frontend additionally manages:

* Active block
* Cursor position
* Selection boundaries
* Atomic block state

Conceptually:

```text
Collaborative State
       │
       ├── Block Identity
       ├── Lock State
       └── Presence
              │
              ▼
        Frontend Editor State
              │
              ├── Cursor
              ├── Selection
              └── Atomic Block State
```

---

# 🎯 Targeted AST Updates

SyncDoc supports localized AST updates.

Instead of rebuilding the entire document for every block-level change:

```text
Document AST
     │
     ├── Heading
     ├── Paragraph  ← Update
     ├── Code
     └── List
```

The collaborative and transformation layers can operate on the affected structural node.

This supports efficient structural editing and provides a foundation for larger collaborative documents.

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

Implemented renderers:

* Heading renderer
* Paragraph renderer
* Code renderer
* List renderer
* Nested list rendering

---

# 📄 PDF Structure Generation

The PDF generator handles the conversion from export structures into PDF layout operations.

```text
ExportDocument
      │
      ▼
PDF Generator
      │
      ├── Render Heading
      ├── Render Paragraph
      ├── Render Code
      ├── Render List
      └── Render Nested Children
      │
      ▼
PDFDocument
```

The rendering layer handles document structure while keeping transformation logic separate.

---

# 📤 PDF Export API

The backend provides:

```text
GET /api/documents/:id/export/pdf
```

The complete export pipeline is:

```text
MongoDB / Yjs
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

The endpoint generates and downloads the current document as a PDF.

---

# 🛡️ Security Architecture

Security is divided between the backend and frontend.

### Backend Responsibilities

```text
Request
   ↓
Express
   ↓
Validation
   ↓
AST Structure
   ↓
Persistence
```

The backend protects the structural integrity of documents through:

* AST validation
* Node type validation
* Node ID validation
* Duplicate ID detection
* Parent-child validation
* Recursive validation
* MongoDB/Mongoose validation
* Helmet
* CORS configuration
* Environment configuration

### Frontend Responsibilities

The frontend additionally handles user-controlled content sanitization using **DOMPurify** before rendering and during targeted content updates.

```text
User Content
     ↓
Frontend Sanitization
     ↓
Collaborative State
     ↓
Backend
     ↓
Persistence
```

This separation keeps HTML/content sanitization concerns in the frontend while maintaining structural validation on the backend.

---

# 🧪 Backend Testing

The backend uses **Vitest** for automated testing.

Testing covers:

### AST Validation

* Valid AST documents
* Invalid node types
* Missing IDs
* Duplicate IDs
* Invalid child relationships
* Nested AST validation

### Collaboration

* AST → Yjs conversion
* Yjs → AST conversion
* Collaborative document state
* Presence support
* Block locking
* Connection lifecycle

### Transformation

* Heading transformation
* Paragraph transformation
* Code transformation
* List transformation
* Nested list transformation
* Complete AST transformation

### PDF

* PDF document generation
* Heading rendering
* Paragraph rendering
* Code rendering
* List rendering
* Nested list rendering
* Empty document handling
* Complex document generation
* PDF export controller

---

# 📊 Current Backend Test Status

The Week 3 backend test suite contains:

```text
5 Test Files
37 Tests
0 Failing Tests
```

Validated areas include:

```text
✓ AST validation
✓ AST → Yjs
✓ Yjs → AST
✓ AST transformation
✓ PDF generation
✓ PDF export
```

Run tests:

```text
npm test
```

TypeScript validation:

```text
npx tsc --noEmit
```

---

# 🏗️ Complete Backend Architecture

The complete backend architecture is:

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
              │                     │
              └──────────┬──────────┘
                         │
                         ▼
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
                    PDF Export
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
│   │   │   ├── astToYjs.ts
│   │   │   └── yjsToAst.ts
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
│   │       └── pdfLayout.ts
│   │
│   ├── tests/
│   │   ├── astValidator.test.ts
│   │   ├── astToYjs.test.ts
│   │   ├── astTransformer.test.ts
│   │   ├── exportController.test.ts
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
| Mongoose   | MongoDB ODM                  |
| Yjs        | Collaborative shared state  |
| WebSocket  | Real-time synchronization   |
| CRDT       | Conflict-free collaboration |
| PDFKit     | PDF generation               |
| Helmet     | Security                     |
| CORS       | Cross-origin requests        |
| dotenv     | Environment configuration    |
| Vitest     | Automated testing             |

---

# 📦 Installation

```text
cd backend
npm install
```

Create `.env`:

```text
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Do not commit `.env` to Git.

---

# ▶️ Development

Start the backend development server:

```text
npm run dev
```

Server:

```text
http://localhost:5000
```

WebSocket collaboration endpoint:

```text
ws://localhost:5000/collab?documentId=<DOCUMENT_ID>
```

---

# 🏗️ Production Build

```text
npm run build
npm start
```

---

# 🧪 Testing

Run the complete backend test suite:

```text
npm test
```

Run TypeScript validation:

```text
npx tsc --noEmit
```

The backend should pass both TypeScript validation and the automated test suite before changes are committed.

---

# 🗓️ Week 1 Progress

## AST Foundation

Completed:

* Express + TypeScript setup
* MongoDB + Mongoose
* AST schema
* Recursive AST validation
* Duplicate node validation
* Child relationship validation
* Mongoose pre-save validation
* Automated AST tests
* Document CRUD APIs
* Production build

**Week 1: ✅ Complete**

---

# 🗓️ Week 2 Progress

## Yjs & Collaboration

Completed:

* Yjs integration
* Yjs document manager
* Yjs WebSocket server
* Yjs synchronization
* AST → Yjs conversion
* Yjs → AST conversion
* Real-time document synchronization
* Multi-client synchronization
* User presence
* Presence cleanup
* User identity
* Block-level locking
* Lock acquisition
* Lock release
* Lock refresh
* Lock expiration
* Expired lock cleanup
* Reconnection handling
* Collaboration error handling
* Multi-client validation
* CRDT synchronization validation

**Week 2: ✅ Complete**

---

# 🗓️ Week 3 Progress

## Transformation Engine

Completed:

* Export architecture
* Export document model
* AST → ExportDocument transformation
* Heading transformation
* Paragraph transformation
* Code transformation
* List transformation
* Nested list transformation
* Transformation dispatcher
* Transformation validation
* Transformation tests

## Block Management

Completed:

* Context state design
* Active block tracking
* Cursor position tracking
* Selection bounds
* Atomic block state
* AST block integration
* Targeted AST updates
* Block-level state handling

## Yjs Integration

Completed:

* Yjs → AST integration
* Collaborative AST transformation
* Current Yjs state handling
* Document-specific synchronization
* Exporting current collaborative document state

## PDF

Completed:

* PDFKit integration
* PDF document generation
* Heading renderer
* Paragraph renderer
* Code renderer
* List renderer
* Nested list rendering
* PDF export controller
* PDF export endpoint
* Browser PDF download
* PDF generation tests
* Export validation

**Week 3: ✅ Complete**

---

# 🗓️ Week 4 Progress

## Security & Collaboration Support

Week 4 focused on strengthening the overall SyncDoc collaboration architecture.

Backend-supported areas:

* Collaborative Yjs state
* WebSocket synchronization
* Presence lifecycle
* Block-level locking
* Connection cleanup
* Stale collaboration cleanup
* Persistent document synchronization
* Collaborative PDF export

Frontend-supported areas built on top of the backend:

* DOMPurify sanitization
* XSS testing
* Block state indicators
* Cursor synchronization
* Selection synchronization
* Multi-client cursor validation
* Presence and cursor cleanup

Final project validation confirmed:

```text
Frontend
74 tests passed

Backend
37 tests passed

Overall
111 tests passed
```

**Week 4: ✅ Complete**

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
Transformation + Block Management + PDF Export
        │
        ▼
Week 4
Security + Collaboration Validation
        │
        ▼
Future
Performance + Scalability + Production Hardening
```

---

# 📊 Overall Project Status

```text
Week 1 — AST Foundation
████████████████████ 100%

Week 2 — Yjs + CRDT Collaboration
████████████████████ 100%

Week 3 — Transformation + PDF Export
████████████████████ 100%

Week 4 — Security + Collaboration Support
████████████████████ 100%
```

### Overall

**SyncDoc Backend: ✅ Complete through Week 4**

---

# 🔄 Complete SyncDoc Backend Pipeline

```text
                         ┌───────────────┐
                         │    Client     │
                         └───────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                 REST API                WebSocket
                    │                         │
                    ▼                         ▼
                Express                  Yjs / CRDT
                    │                         │
                    ▼                         ▼
                MongoDB                Collaboration
                    │                         │
                    └────────────┬────────────┘
                                 │
                                 ▼
                                AST
                                 │
                    ┌────────────┴────────────┐
                    │                         │
             Block Management          Transformation
                    │                         │
                    │                         ▼
                    │                  ExportDocument
                    │                         │
                    └─────────────────────────┤
                                              ▼
                                        PDF Generator
                                              │
                                              ▼
                                         PDF Export
                                              │
                                              ▼
                                           Browser
```

---

# 🎯 Project Goal

SyncDoc Backend demonstrates how a modern collaborative document engine can combine:

```text
AST
+
MongoDB
+
Yjs
+
CRDTs
+
WebSockets
+
TypeScript
+
Transformation Engine
+
Block Management
+
PDFKit
+
PDF Export
```

The backend is designed around **structural document synchronization** rather than plain-text synchronization.

The architecture separates:

```text
Persistence
    ↓
Collaboration
    ↓
AST
    ↓
Transformation
    ↓
Export
```

This provides a clean foundation for secure, collaborative structured document editing and future scalability.

---

# 📌 Final Status

```text
╔══════════════════════════════════════════════╗
║              SyncDoc Backend                 ║
╠══════════════════════════════════════════════╣
║ Week 1 — AST Foundation             ✅ 100% ║
║ Week 2 — Collaboration              ✅ 100% ║
║ Week 3 — Transformation & PDF       ✅ 100% ║
║ Week 4 — Security & Collaboration   ✅ 100% ║
╠══════════════════════════════════════════════╣
║ Current Milestone: Week 4 Complete           ║
╚══════════════════════════════════════════════╝
```

**Current milestone:** SyncDoc Backend is complete through **Week 4**, providing the AST persistence, real-time Yjs collaboration, presence/locking infrastructure, transformation engine, and PDF export pipeline required by the SyncDoc application.