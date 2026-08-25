# SyncDoc

**SyncDoc** is a real-time collaborative document engine designed for multi-user structural document editing.

Unlike traditional plain-text editors, SyncDoc represents documents as an **Abstract Syntax Tree (AST)**. This allows structural changes to be tracked at the block level and enables conflict-free synchronization using **Yjs and CRDTs**.

---

## 🚧 Project Status

**Current Phase:** Week 3 — Transformation & PDF Export
**Status:** 🚀 Week 1 & Week 2 Complete | Week 3 In Progress

### Progress

```text
Week 1 — AST Foundation              ✅ Complete
Week 2 — Yjs + CRDT Collaboration    ✅ Complete
Week 3 — Transformation & PDF       🚧 In Progress
```

---

# 🏗️ Architecture

SyncDoc is built around a structural document model:

```text
                    ┌──────────────────┐
                    │   React Editor   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Yjs Client     │
                    └────────┬─────────┘
                             │
                       WebSocket
                             │
                             ▼
                    ┌──────────────────┐
                    │  Yjs Server      │
                    │   + CRDT Sync    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    AST Layer     │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │   MongoDB    │          │ Transformation│
        │ Persistence  │          │    Engine     │
        └──────────────┘          └───────┬──────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │ PDF Generator│
                                  └──────────────┘
```

---

# 📦 Tech Stack

## Frontend

* React
* TypeScript
* Vite
* ESLint
* Yjs
* WebSocket

## Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose
* Yjs
* WebSocket
* PDFKit

## Testing

* Vitest

## Collaboration

* Yjs
* CRDT-based synchronization
* WebSocket communication
* User presence
* Block-level locking
* Reconnection handling

---

# 📅 Week 1 — AST Foundation

**Status: ✅ Complete**

Week 1 established the structural document engine and REST-based document management.

## Backend

* Node.js + Express project structure
* TypeScript configuration
* CORS
* Helmet
* dotenv
* Nodemon
* TSX development runner
* Express health endpoint
* MongoDB connection
* Mongoose configuration
* AST TypeScript types
* Nested AST Mongoose schemas
* Recursive AST validation
* Duplicate node ID validation
* Invalid node type validation
* Structural child relationship validation
* Recursive Mongoose pre-save validation
* Automated AST tests with Vitest
* Document REST API
* Create Document API
* List Documents API
* Get Document API
* Update Document API
* Delete Document API

## Frontend

* React + TypeScript + Vite
* ESLint
* Document browser
* Fetch documents from REST API
* Document selection
* Fetch complete document AST
* AST document viewer
* Recursive AST block rendering
* Heading block rendering
* Paragraph block rendering
* Code block rendering
* List block rendering
* Nested child block rendering
* Editable paragraph blocks
* Editable heading blocks
* Editable code blocks
* Basic block-level editor foundation
* Frontend production build verification
* Persistent frontend autosave
* Saving / saved status
* Document creation
* Document deletion
* Frontend AST validation

---

# 📅 Week 2 — Yjs + CRDT Collaboration

**Status: ✅ Complete**

Week 2 introduced real-time collaborative editing using **Yjs**, WebSockets, presence tracking, and block-level locking.

## Yjs Integration

* Yjs document management
* Yjs document lifecycle
* Yjs WebSocket server
* Yjs client integration
* Yjs document synchronization
* AST → Yjs conversion
* Yjs → AST conversion
* Collaborative document state
* CRDT-based document synchronization

## Real-Time Collaboration

SyncDoc now supports the collaborative flow:

```text
Browser A
    │
    ▼
Yjs Client
    │
    ▼
WebSocket
    │
    ▼
SyncDoc Server
    │
    ▼
Yjs CRDT Document
    │
    ▼
WebSocket
    │
    ▼
Yjs Client
    │
    ▼
Browser B
```

Changes made by one client can be synchronized to other connected clients without destructive document overwrites.

## Presence

* Online user tracking
* User identity
* Presence initialization
* Presence updates
* Presence cleanup
* Presence avatars
* Online user count
* User name management
* Session-based user identity

## Block Locking

* Block-level editing locks
* Lock acquisition
* Lock release
* Lock refresh
* Lock expiration
* Expired lock cleanup
* Localized editing protection
* Multi-client lock safety

## Connection Reliability

* WebSocket connection state
* Connection status UI
* Reconnection handling
* Presence cleanup after disconnect
* Collaboration error handling
* Connection lifecycle management

## Testing

Week 2 introduced automated tests for the collaboration and AST synchronization layers.

Current backend test coverage includes:

```text
AST Validator Tests        8 tests
AST → Yjs Tests            5 tests
AST Transformer Tests      5 tests
PDF Generator Tests        2 tests
─────────────────────────────────
Total                     20 tests
```

All current tests are passing.

---

# 📅 Week 3 — Transformation & PDF Export

**Status: 🚧 In Progress**

Week 3 focuses on converting the collaborative AST into exportable document structures and generating PDF documents.

## 3.1 Transformation Foundation

**Status: ✅ Complete**

* Transformation service architecture
* Export-oriented document model
* Separation between AST and export representation

## 3.2 AST → Export Transformer

**Status: ✅ Complete**

SyncDoc now transforms the internal AST into an export-specific structure.

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

Implemented:

* Heading transformation
* Paragraph transformation
* Code transformation
* List transformation
* Nested list transformation
* AST transformation dispatcher
* Export-specific node types
* Transformation tests

The export structure intentionally removes collaboration-specific fields such as node IDs.

## 3.3 PDF Structure Generation

**Status: ✅ Complete**

Implemented PDF generation using PDFKit.

```text
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

Implemented:

* PDF document creation
* Document title rendering
* Heading rendering
* Paragraph rendering
* Code block rendering
* List rendering
* Nested list rendering
* PDF rendering abstraction
* PDF generator tests

## 3.4 PDF Export API

**Status: ✅ Complete**

SyncDoc now exposes a PDF export endpoint:

```http
GET /api/documents/:id/export/pdf
```

The export pipeline is:

```text
MongoDB Document
       │
       ▼
    AST Nodes
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
 PDF Response
       │
       ▼
 Browser Download
```

Implemented:

* PDF export controller
* PDF export REST endpoint
* PDF response streaming
* Downloadable `.pdf` files
* Automatic document-based filenames
* 404 handling for missing documents
* 500 handling for export failures

---

# 🌳 AST Structure

SyncDoc currently supports the following AST node types:

```text
ASTNode
├── heading
├── paragraph
├── code
├── list
└── listItem
```

Each node follows the structure:

```ts
interface ASTNode {
  id: string;
  type: ASTNodeType;
  content?: string;
  attributes?: Record<string, unknown>;
  children?: ASTNode[];
}
```

This allows documents to represent nested structures rather than treating the document as one large text string.

Example:

```text
Document
│
├── Heading
│
├── Paragraph
│
├── Code
│
└── List
    ├── List Item
    ├── List Item
    │   └── Nested List
    │       ├── List Item
    │       └── List Item
    └── List Item
```

---

# 🔄 Collaboration Model

SyncDoc uses Yjs to synchronize structural document state.

Instead of replacing an entire document when a user makes an edit, changes are represented through Yjs updates and synchronized between connected clients.

```text
User A edits Block
        │
        ▼
     Yjs Update
        │
        ▼
   WebSocket Server
        │
        ▼
    CRDT Document
        │
        ▼
     Yjs Update
        │
        ▼
      User B
```

This architecture reduces destructive overwrites and provides a foundation for scalable collaborative editing.

---

# 🔒 Block-Level Editing

SyncDoc uses localized block locking instead of locking the entire document.

For example:

```text
User A → editing Heading 1
User B → editing Paragraph 2
User C → editing Code Block
```

These users can work on different blocks simultaneously.

Locks include:

* Acquisition
* Release
* Refresh
* Expiration
* Cleanup

This keeps collaboration localized while preventing conflicting simultaneous edits on the same block.

---

# 🧪 Testing

The backend uses **Vitest** for automated testing.

Current test suite:

```text
✓ AST Validator
✓ AST → Yjs
✓ AST Transformer
✓ PDF Generator
```

Current result:

```text
Test Files: 4 passed
Tests:      20 passed
```

Run tests with:

```bash
cd backend
npm test
```

---

# 🖥️ Frontend Development

The SyncDoc frontend is built using:

* React
* TypeScript
* Vite
* ESLint
* Yjs
* WebSocket

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

---

# ⚙️ Backend Development

Install dependencies:

```bash
cd backend
npm install
```

Start the backend development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

---

# 📁 Project Structure

```text
SyncDoc/
│
├── backend/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── services/
│       │   ├── collaboration/
│       │   ├── transformation/
│       │   └── pdf/
│       │       └── renderers/
│       ├── tests/
│       └── types/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── ...
│
└── README.md
```

---

# 📤 PDF Export

A document can be exported through:

```http
GET /api/documents/:id/export/pdf
```

Example:

```text
http://localhost:5000/api/documents/<DOCUMENT_ID>/export/pdf
```

The endpoint generates and downloads the current document as a PDF.

---

# 🗺️ Roadmap

## Week 1 — AST Foundation

**Status: ✅ Complete**

* AST architecture
* Document persistence
* REST APIs
* Recursive validation
* Structural editor

## Week 2 — Collaboration

**Status: ✅ Complete**

* Yjs
* WebSocket synchronization
* CRDT document state
* Presence
* Block locking
* Reconnection handling
* Collaboration testing

## Week 3 — Transformation & Export

**Status: 🚧 In Progress**

* AST → ExportDocument ✅
* PDF structure generation ✅
* PDF export API ✅
* PDF layout refinement
* Advanced PDF formatting
* Export validation
* Final export testing

## Future

Potential future improvements include:

* Rich text formatting
* More AST node types
* Better code syntax highlighting
* Advanced PDF styling
* Multiple export formats
* Document version history
* Offline editing
* Improved collaboration scalability
* Performance benchmarking
* Production deployment

---

# 🎯 Project Goal

SyncDoc is designed to demonstrate how a modern collaborative document engine can combine:

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
React
+
TypeScript
+
PDF Export
```

The project focuses on **structural document synchronization**, rather than simply synchronizing raw text, creating a foundation for more reliable multi-user document editing.

---

## 📌 Current Status

```text
Week 1 — AST Foundation
████████████████████ 100%

Week 2 — Yjs + CRDT Collaboration
████████████████████ 100%

Week 3 — Transformation + PDF Export
████████████████░░░░ 80%
```

**Current milestone:** PDF export is functional.
**Next milestone:** PDF formatting and export refinement.
