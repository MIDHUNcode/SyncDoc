# SyncDoc

**SyncDoc** is a real-time collaborative document engine designed for multi-user structural document editing.

Unlike traditional plain-text editors, SyncDoc represents documents as an **Abstract Syntax Tree (AST)**. This allows structural changes to be tracked at the block level and enables conflict-free synchronization using **Yjs and CRDTs**.

---

# 🚧 Project Status

**Current Phase:** Week 3 — Transformation & PDF Export
**Status:** 🚀 Week 1, Week 2 & Week 3 Complete

### Progress

```text
Week 1 — AST Foundation              ✅ Complete
Week 2 — Yjs + CRDT Collaboration    ✅ Complete
Week 3 — Transformation & PDF       ✅ Complete
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
* TypeScript compiler

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

SyncDoc supports the collaborative flow:

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

Changes made by one client are synchronized to other connected clients through Yjs CRDT updates.

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
* Stale presence cleanup

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

---

# 📅 Week 3 — Transformation & PDF Export

**Status: ✅ Complete**

Week 3 implemented the **Transformation Engine**, block-level editor state management, targeted AST updates, Yjs integration, and PDF export.

---

## 3.1 — Export Architecture

**Status: ✅ Complete**

Created a dedicated transformation and export architecture that separates the internal collaborative AST from the structure required by the PDF renderer.

```text
Collaborative AST
       │
       ▼
Transformation Layer
       │
       ▼
ExportDocument
       │
       ▼
PDF Rendering Layer
       │
       ▼
PDF Document
```

Implemented:

* Transformation service architecture
* Export-specific document types
* AST/export separation
* Export node representation
* Dedicated PDF rendering layer
* Renderer-based PDF architecture

---

## 3.2 — AST → Export Transformer

**Status: ✅ Complete**

SyncDoc transforms the internal AST into a clean export representation.

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
* List item transformation
* Nested list transformation
* AST transformation dispatcher
* Export-specific node types
* Transformation validation
* Transformation tests

The export representation removes collaboration-specific information such as internal node IDs.

---

## 3.3 — PDF Structure Generation

**Status: ✅ Complete**

Implemented PDF generation using **PDFKit**.

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
* PDF spacing management
* Page-space handling
* Renderer abstraction
* Empty document handling
* Complex AST rendering

---

## 3.4 — Transformation & PDF Tests

**Status: ✅ Complete**

The transformation and PDF pipeline is covered by automated backend tests.

Backend tests currently include:

```text
AST Validator Tests        8
AST → Yjs Tests            5
AST Transformer Tests      5
Export Controller Tests     3
PDF Generator Tests        16
────────────────────────────
Backend Total              37
```

PDF tests cover:

* Empty documents
* Empty paragraphs
* Empty code blocks
* Empty lists
* Headings
* Multiple heading levels
* Code blocks
* Lists
* Deeply nested lists
* Mixed AST documents
* Unsupported node types
* PDF generation failures
* Export controller behavior

---

## 3.5 — Cursor & Selection State Design

**Status: ✅ Complete**

Implemented editor state utilities for tracking block-level editing context.

The editor maintains state required for:

* Active block tracking
* Cursor position
* Selection bounds
* Editing state
* Block-level context
* Selection updates

The state architecture keeps cursor and selection information separate from the persistent document AST.

---

## 3.6 — Atomic Block State

**Status: ✅ Complete**

Implemented atomic block state management for safe block-level editing.

Implemented:

* Active block tracking
* Editing state
* Block ownership
* Atomic block transitions
* Lock-aware editing state
* Block state cleanup
* Atomic state tests

This provides a controlled boundary between editor interaction and collaborative document state.

---

## 3.7 — AST Block Integration

**Status: ✅ Complete**

Integrated editor state management with the AST block renderer.

```text
User Interaction
       │
       ▼
AST Block
       │
       ▼
Editor State
       │
       ▼
Targeted AST Update
       │
       ▼
Yjs
```

Implemented:

* Block-level editing integration
* Active block tracking
* Block editing indicators
* Lock-aware editing
* Recursive AST block updates
* Collaborative block state integration

---

## 3.8 — Cursor & Selection Handling

**Status: ✅ Complete**

Implemented cursor and selection utility functions.

Supported functionality includes:

* Cursor position tracking
* Selection start/end tracking
* Selection bounds
* Cursor clamping
* Position validation
* Selection state updates
* Cursor utility tests

These utilities provide the foundation for more advanced rich-text editing in future versions.

---

## 3.9 — Targeted AST Updates

**Status: ✅ Complete**

SyncDoc updates only the affected AST block instead of replacing the complete document.

```text
User edits block
       │
       ▼
Target block identified
       │
       ▼
Update block content
       │
       ▼
Yjs node update
       │
       ▼
Collaborators receive update
```

Implemented:

* Targeted node lookup
* Recursive AST updates
* Single-block content updates
* Yjs node-level updates
* Local React state updates
* Non-destructive collaborative updates
* Targeted update tests

This reduces unnecessary document-level updates during editing.

---

## 3.10 — Yjs Integration

**Status: ✅ Complete**

Integrated the editor state and targeted AST updates with the Yjs collaboration layer.

Implemented:

* Yjs document synchronization
* Yjs AST state
* Yjs → React AST conversion
* Targeted Yjs node updates
* WebSocket synchronization
* Collaborative block updates
* Presence synchronization
* Block lock synchronization
* Connection state handling
* Reconnection handling
* Yjs document persistence

The collaborative state now follows:

```text
React Editor
     │
     ▼
Targeted AST Update
     │
     ▼
Yjs Document
     │
     ▼
WebSocket
     │
     ▼
Other Clients
```

---

## 3.11 — Export Integration

**Status: ✅ Complete**

Integrated PDF export with the collaborative document system.

The complete export flow is:

```text
Collaborative Editor
        │
        ▼
      Yjs
        │
        ▼
MongoDB Persistence
        │
        ▼
   Document AST
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

* Frontend PDF export service
* Export button
* Export loading state
* Export error handling
* Backend export controller
* PDF export REST endpoint
* PDF response streaming
* Automatic PDF download
* Document-based PDF filenames
* Missing document handling
* Export failure handling
* Latest persisted collaborative content included in exports

### PDF Export API

```http
GET /api/documents/:id/export/pdf
```

Example:

```text
http://localhost:5000/api/documents/<DOCUMENT_ID>/export/pdf
```

---

## 3.12 — Final Testing

**Status: ✅ Complete**

Week 3 was validated through TypeScript checks, automated tests, and manual multi-client testing.

### Backend

```text
npx tsc --noEmit
```

Result:

```text
✅ No TypeScript errors
```

Tests:

```text
Test Files: 5 passed
Tests:      37 passed
```

### Frontend

```text
npx tsc --noEmit
```

Result:

```text
✅ No TypeScript errors
```

Tests:

```text
Test Files: 5 passed
Tests:      44 passed
```

### Total Automated Tests

```text
Backend Tests       37
Frontend Tests      44
───────────────────────
Total               81
```

### Manual Collaboration Testing

Validated:

* Two browser tabs connected to the same document
* Both clients show `Connected`
* Online user count updates correctly
* Tab A → Tab B editing synchronization
* Tab B → Tab A editing synchronization
* Presence indicators
* User avatars
* Editing indicators
* Block-level editing state
* Reconnection behavior
* Document loading
* Paragraph editing
* Collaborative synchronization
* PDF export
* Edited content appearing in downloaded PDFs

---

# 🌳 AST Structure

SyncDoc currently supports:

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
User A → editing Heading
User B → editing Paragraph
User C → editing Code Block
```

These users can work on different blocks simultaneously.

Locks include:

* Acquisition
* Release
* Refresh
* Expiration
* Cleanup
* Multi-client safety

---

# 📤 PDF Export

SyncDoc provides direct PDF export from the document editor.

```text
Editor
  │
  ▼
Yjs
  │
  ▼
Persisted AST
  │
  ▼
AST Transformer
  │
  ▼
ExportDocument
  │
  ▼
PDFKit
  │
  ▼
PDF Download
```

Export endpoint:

```http
GET /api/documents/:id/export/pdf
```

The generated PDF contains the latest synchronized and persisted document content.

---

# 🧪 Testing

SyncDoc uses **Vitest** for automated testing.

## Backend

```text
✓ AST Validator
✓ AST → Yjs
✓ AST Transformer
✓ Export Controller
✓ PDF Generator
```

```text
Test Files: 5 passed
Tests:      37 passed
```

## Frontend

```text
✓ AST Updates
✓ Atomic Block State
✓ Editor State
✓ Cursor Utilities
✓ Yjs Updates
```

```text
Test Files: 5 passed
Tests:      44 passed
```

## Overall

```text
Backend       37 tests
Frontend      44 tests
──────────────────────
Total         81 tests
```

Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm test
```

Run TypeScript validation:

```bash
npx tsc --noEmit
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

Install dependencies:

```bash
cd frontend
npm install
```

Start the frontend:

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
│       │   └── exportController.ts
│       │
│       ├── models/
│       │
│       ├── routes/
│       │
│       ├── services/
│       │   ├── collaboration/
│       │   │   ├── astToYjs.ts
│       │   │   ├── websocketServer.ts
│       │   │   └── yjsDocumentManager.ts
│       │   │
│       │   ├── transformation/
│       │   │   ├── astTransformer.ts
│       │   │   ├── types.ts
│       │   │   └── nodeTransformers/
│       │   │
│       │   └── pdf/
│       │       ├── pdfGenerator.ts
│       │       └── renderers/
│       │
│       ├── tests/
│       └── types/
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── blocks/
│       │   └── document/
│       │
│       ├── hooks/
│       │   └── useYjsDocument.ts
│       │
│       ├── services/
│       │   ├── collaboration/
│       │   └── exportService.ts
│       │
│       ├── tests/
│       ├── types/
│       └── ...
│
└── README.md
```

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

**Status: ✅ Complete**

* Export architecture ✅
* AST → ExportDocument transformation ✅
* PDF structure generation ✅
* Transformation tests ✅
* Cursor/selection state design ✅
* Atomic block state ✅
* AST block integration ✅
* Cursor & selection handling ✅
* Targeted AST updates ✅
* Yjs integration ✅
* PDF export integration ✅
* Final testing ✅

---

# 🎯 Week 3 Achievement

Week 3 successfully established the complete transformation and export pipeline:

```text
AST
 │
 ├───────────────┐
 │               │
 ▼               ▼
Editor State    Yjs
 │               │
 ▼               ▼
Targeted       CRDT
Updates        Sync
 │               │
 └───────┬───────┘
         ▼
   Persisted AST
         │
         ▼
   AST Transformer
         │
         ▼
   ExportDocument
         │
         ▼
     PDFKit
         │
         ▼
   Downloadable PDF
```

The editor now supports both **real-time structural collaboration** and **PDF export from synchronized document state**.

---

# 🚀 Current Project Status

```text
Week 1 — AST Foundation
████████████████████ 100%

Week 2 — Yjs + CRDT Collaboration
████████████████████ 100%

Week 3 — Transformation + PDF Export
████████████████████ 100%
```

**Overall Project Status: 🚀 Weeks 1–3 Complete**

**Current milestone:** SyncDoc now provides a collaborative AST-based editor with Yjs/CRDT synchronization, block-level editing state, targeted AST updates, and functional PDF export.

---

# 🔮 Future Improvements

Potential future improvements include:

* Rich text formatting
* More AST node types
* Tables
* Images
* Links
* Better code syntax highlighting
* Advanced PDF styling
* Custom page layouts
* Headers and footers
* Multiple export formats
* Document version history
* Offline editing
* Improved collaboration scalability
* Performance benchmarking
* Production deployment
* Authentication and authorization

---

# 🎯 Project Goal

SyncDoc demonstrates how a modern collaborative document engine can combine:

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

The project focuses on **structural document synchronization**, rather than simply synchronizing raw text.

This creates a foundation for reliable multi-user document editing while maintaining a clean separation between:

```text
Document Structure
        ↓
Collaboration State
        ↓
Editor State
        ↓
Transformation
        ↓
Export
```

**SyncDoc — Structural Collaboration + Transformation + Export.**
