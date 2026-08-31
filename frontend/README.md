# SyncDoc Frontend

**SyncDoc Frontend** is a **React + TypeScript** collaborative document editor built around a structured **Abstract Syntax Tree (AST)**.

The frontend allows users to browse, edit, and collaboratively synchronize structured documents in real time using **Yjs, WebSocket, and CRDT-based synchronization**.

The frontend also integrates with the Week 3 transformation and PDF export pipeline, allowing users to export the latest synchronized document state as a PDF.

---

# 🚧 Project Status

| Phase                                       | Status     |
| ------------------------------------------- | ---------- |
| Week 1 — AST Foundation                     | ✅ Complete |
| Week 2 — Yjs + CRDT Collaboration           | ✅ Complete |
| Week 3 — Transformation, State & PDF Export | ✅ Complete |

**Current Phase:** Week 3 — Transformation & PDF Export
**Frontend Status:** ✅ Week 1 + Week 2 + Week 3 Complete

---

# ✨ Features

## 📄 Document Browser

The Document Browser provides the foundation for selecting documents from the SyncDoc backend.

Features:

* Fetches documents from the backend
* Displays document titles
* Displays last updated timestamps
* Allows selecting a document
* Fetches the complete document AST
* Handles loading states
* Handles API errors
* Handles empty document lists

---

# 🌳 AST Rendering

SyncDoc represents documents as an **Abstract Syntax Tree (AST)** rather than a single text string.

The frontend supports:

* Heading
* Paragraph
* Code
* List
* List Item
* Nested children
* Recursive AST rendering

Example:

```text
Document
│
├── Heading
│
├── Paragraph
│
├── List
│   ├── List Item
│   ├── List Item
│   └── List Item
│
└── Code
```

The recursive renderer allows nested document structures to be represented regardless of their depth.

---

# ✏️ Block Editor

SyncDoc uses a block-level editing model.

Currently editable:

* Heading blocks
* Paragraph blocks
* Code blocks

The editor updates the corresponding AST/Yjs state when the user edits a block.

### Collaborative Editing Flow

```text
User edits block
       ↓
Editable Block
       ↓
AST / Editor State
       ↓
Yjs Document
       ↓
Yjs Update
       ↓
WebSocket
       ↓
SyncDoc Server
       ↓
Other Connected Clients
       ↓
Yjs State
       ↓
React UI
```

---

# 🧠 Editor State Management

Week 3 introduced dedicated editor-state utilities to manage document editing independently from the React rendering layer.

The editor state tracks:

* Active block
* Active cursor position
* Selection start
* Selection end
* Editing state
* Block-level updates

Architecture:

```text
React Editor
      │
      ▼
Editor State
      │
      ├── Active Block
      ├── Cursor Position
      ├── Selection Bounds
      └── Editing State
      │
      ▼
AST / Yjs State
```

This provides a cleaner foundation for targeted document editing and future rich-text functionality.

---

# 🎯 Cursor & Selection Handling

The frontend contains utilities for managing cursor and selection information.

Implemented:

* Cursor position tracking
* Selection start tracking
* Selection end tracking
* Selection bounds
* Cursor validation
* Selection normalization
* Block-aware cursor state

The state model allows the editor to identify exactly where the user is editing rather than treating the entire document as one editable region.

Example:

```text
Document
│
├── Heading
│
├── Paragraph
│       └── Cursor → position 12
│
└── Code
```

---

# ⚛️ Atomic Block State

Week 3 introduced atomic block state management.

Each editable block can maintain its own editing state.

Example:

```text
Document
│
├── Heading
│   └── Atomic Block State
│
├── Paragraph
│   └── Atomic Block State
│
└── Code
    └── Atomic Block State
```

Implemented:

* Block activation
* Block deactivation
* Cursor state
* Selection state
* Editing state
* Block-local state updates
* Atomic block state validation

This keeps block editing localized and reduces unnecessary updates to unrelated document nodes.

---

# 🔄 Targeted AST Updates

The frontend now supports targeted AST updates instead of unnecessarily rebuilding or replacing unrelated document state.

Example:

```text
Before

Document
├── Heading A
├── Paragraph B
└── Code C


User edits Paragraph B


After

Document
├── Heading A       unchanged
├── Paragraph B     updated
└── Code C          unchanged
```

Implemented:

* Node lookup by ID
* Targeted content updates
* Recursive AST updates
* Nested node updates
* Immutable state updates
* Missing-node handling
* Update validation

This provides a foundation for efficient block-level editing.

---

# 🔄 Yjs Integration

The frontend contains a dedicated Yjs client layer responsible for connecting the editor to the collaborative document.

Implemented:

* Yjs client initialization
* WebSocket connection
* Yjs document creation
* Shared Yjs node state
* Yjs update handling
* Remote update synchronization
* Connection lifecycle management
* Reconnection handling
* Collaborative state integration

The Yjs document acts as the real-time source of collaborative document state.

---

# 🔁 AST ↔ Yjs Synchronization

SyncDoc maintains a bridge between its structural AST and Yjs shared state.

```text
AST
 │
 ▼
AST → Yjs
 │
 ▼
Yjs Shared Document
 │
 ▼
Yjs → AST
 │
 ▼
React Editor
```

The frontend works with:

```text
ASTNode
```

while collaborative synchronization operates through:

```text
Y.Doc
Y.Array
Y.Map
```

This allows the editor to preserve its structural AST representation while using Yjs for conflict-free synchronization.

---

# 🤝 Real-Time Collaboration

The frontend supports real-time multi-user document editing.

Implemented:

* Yjs
* WebSocket
* CRDT synchronization
* Collaborative document state
* User presence
* Block-level locking
* Reconnection handling
* Connection status tracking
* Remote AST updates

The collaboration architecture is:

```text
                    ┌──────────────────┐
                    │   React Editor   │
                    │     User A       │
                    └────────┬─────────┘
                             │
                            Yjs
                             │
                             ▼
                    ┌──────────────────┐
                    │    WebSocket     │
                    │   Sync Server    │
                    └────────┬─────────┘
                             │
                            Yjs
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
      ┌──────────────────┐         ┌──────────────────┐
      │   React Editor   │         │   React Editor   │
      │     User B       │         │     User C       │
      └──────────────────┘         └──────────────────┘
```

---

# 👥 User Presence

SyncDoc includes real-time user presence tracking.

Implemented:

* User identification
* User name management
* Presence initialization
* Presence updates
* Presence cleanup
* Online user tracking
* Presence avatars
* User initials
* Connection-aware presence
* Session-based user identity

Example:

```text
┌──────────────────────────────┐
│ Online                       │
│                              │
│  MG   AB   JS                │
│                              │
│  3 collaborators             │
└──────────────────────────────┘
```

User identity is maintained per browser session so multiple clients can be distinguished during collaboration.

---

# 🔒 Block-Level Locking

SyncDoc uses localized block-level locking rather than locking the entire document.

For example:

```text
User A → editing Heading
User B → editing Paragraph
User C → editing Code Block
```

Different users can work on different blocks simultaneously.

Implemented:

* Lock acquisition
* Lock release
* Lock refresh
* Lock expiration
* Expired lock cleanup
* Editing protection
* Lock-aware editable blocks

Lock lifecycle:

```text
Acquire
   ↓
Active Lock
   ↓
Refresh
   ↓
Continue Editing
   ↓
Release
   ↓
Available
```

---

# 🔌 Connection Management

The frontend tracks the Yjs/WebSocket connection state.

The UI can indicate:

```text
🟢 Connected
🟡 Connecting
🔴 Disconnected
```

Implemented:

* WebSocket connection lifecycle
* Connection status tracking
* Automatic reconnection
* Reconnection delay
* Connection cleanup
* Collaboration error handling

---

# 🔄 Reconnection Handling

The Yjs client includes reconnection handling for temporary WebSocket failures.

Basic flow:

```text
Connection Lost
      ↓
Cleanup Connection
      ↓
Wait
      ↓
Reconnect
      ↓
Initialize Presence
      ↓
Synchronize Yjs State
      ↓
Resume Collaboration
```

This allows clients to recover from temporary connection interruptions without requiring a full page refresh.

---

# 🧩 Collaborative State Architecture

The frontend collaborative state is managed through a dedicated hook:

```text
React Component
      │
      ▼
useYjsDocument()
      │
      ├── Yjs Document
      ├── Yjs Nodes
      ├── AST Nodes
      ├── Presence
      ├── Editing Users
      ├── Connection Status
      └── Collaboration Updates
```

This keeps React components focused on rendering and user interaction while collaboration logic remains inside the Yjs service layer.

---

# 🏗️ Frontend Architecture

The current frontend architecture is:

```text
SyncDoc Frontend
│
├── Document Browser
│       │
│       └── Select Document
│
├── Document Viewer
│       │
│       ├── Connection Status
│       ├── Presence
│       ├── Editing Indicators
│       └── AST Editor
│
├── Editor State
│       │
│       ├── Cursor State
│       ├── Selection State
│       ├── Atomic Block State
│       └── Targeted AST Updates
│
├── API Layer
│       │
│       └── REST Requests
│
├── Collaboration Layer
│       │
│       ├── Yjs Client
│       ├── Yjs ↔ AST
│       ├── Presence
│       └── Block Locks
│
├── Export Layer
│       │
│       └── PDF Download
│
└── AST Renderer
        │
        ├── Heading
        ├── Paragraph
        ├── Code
        ├── List
        └── List Item
```

---

# 📤 PDF Export Integration

Week 3 introduced frontend integration with the backend PDF export pipeline.

The frontend provides an export action that requests the current document from the backend.

Export flow:

```text
User edits document
        │
        ▼
Yjs Collaborative State
        │
        ▼
Backend Persistence
        │
        ▼
Current AST
        │
        ▼
Transformation Engine
        │
        ▼
PDF Generator
        │
        ▼
PDF Response
        │
        ▼
Browser Download
```

The export endpoint is:

```http
GET /api/documents/:id/export/pdf
```

The frontend uses the document ID to request the PDF.

The exported PDF reflects the latest synchronized and persisted document state.

---

# 🔗 PDF Export Workflow

The complete Week 3 export workflow is:

```text
React Editor
     │
     ▼
Yjs Document
     │
     ▼
Collaborative Updates
     │
     ▼
Backend Persistence
     │
     ▼
MongoDB AST
     │
     ▼
AST Transformer
     │
     ▼
ExportDocument
     │
     ▼
PDF Generator
     │
     ▼
PDF Response
     │
     ▼
Browser Download
```

This ensures that the exported document is generated from the current persisted document state rather than an outdated frontend copy.

---

# 🌳 AST Editor Architecture

The editor recursively renders AST nodes.

```text
AST Root
   │
   ├── Node
   │    │
   │    ├── Content
   │    │
   │    └── Children
   │          │
   │          ├── Child Node
   │          ├── Child Node
   │          └── Child Node
   │
   └── Next Node
```

Each supported node is rendered according to its type.

---

# 🧩 Supported AST Node Types

| Node Type       | Rendering |             Editing | Collaboration | Targeted Updates |
| --------------- | --------: | ------------------: | ------------: | ---------------: |
| Heading         |         ✅ |                   ✅ |             ✅ |                ✅ |
| Paragraph       |         ✅ |                   ✅ |             ✅ |                ✅ |
| Code            |         ✅ |                   ✅ |             ✅ |                ✅ |
| List            |         ✅ |                   ❌ |             ✅ |                ✅ |
| List Item       |         ✅ |                   ❌ |             ✅ |                ✅ |
| Nested Children |         ✅ | Based on child type |             ✅ |                ✅ |

---

# ⚛️ State Management

The frontend state architecture evolved across the three development phases.

### Week 1

Local React state was used for AST rendering and editing.

```text
REST API
   ↓
React State
   ↓
AST Renderer
   ↓
Editable Blocks
```

### Week 2

Yjs became the collaborative source of document state.

```text
Yjs Document
     ↓
Collaborative State
     ↓
React Hook
     ↓
AST Renderer
```

### Week 3

Dedicated editor state utilities were introduced for precise block editing.

```text
Yjs Document
     ↓
AST Nodes
     ↓
Editor State
     │
     ├── Active Block
     ├── Cursor
     ├── Selection
     └── Atomic Block State
     ↓
Targeted AST Update
     ↓
React UI
```

This separation makes the editor easier to extend and maintain.

---

# 🧪 Automated Testing

The frontend uses **Vitest** for automated testing.

Current frontend test suite:

```text
✓ AST Updates
✓ Cursor Utilities
✓ Atomic Block State
✓ Editor State
✓ Yjs Updates
```

Current result:

```text
Test Files: 5 passed
Tests:      44 passed
```

### Test Breakdown

| Test Suite         |  Tests |
| ------------------ | -----: |
| AST Updates        |      8 |
| Cursor Utilities   |      4 |
| Atomic Block State |     10 |
| Editor State       |     15 |
| Yjs Updates        |      7 |
| **Total**          | **44** |

Run the frontend tests with:

```bash
npm test
```

---

# 🧪 TypeScript Validation

The frontend TypeScript project is also validated using:

```bash
npx tsc --noEmit
```

The current Week 3 implementation passes TypeScript validation successfully.

---

# 🌐 Manual Collaboration Testing

The collaborative editor has been validated using multiple browser tabs.

Tested scenarios:

* Open the same document in two browser tabs
* Both clients show Connected
* Online user count updates correctly
* Edit a block in Tab A
* Verify the change appears in Tab B
* Edit another block in Tab B
* Verify the change appears in Tab A
* Verify presence indicators
* Verify editing indicators
* Verify block-level collaboration
* Verify connection lifecycle

Example:

```text
Tab A
  │
  │ Edit Heading
  ▼
Yjs Update
  │
  ▼
WebSocket
  │
  ▼
Tab B
  │
  ▼
Updated Heading
```

---

# 📤 Manual PDF Export Testing

The Week 3 export workflow has also been validated manually.

Tested flow:

```text
Open existing document
        ↓
Edit paragraph
        ↓
Wait for synchronization/persistence
        ↓
Click Export PDF
        ↓
PDF downloads
        ↓
Open PDF
        ↓
Verify edited content
```

The exported PDF now reflects the latest synchronized document changes.

---

# 📁 Project Structure

The frontend currently follows a component/service architecture:

```text
src/
│
├── components/
│   ├── blocks/
│   │   ├── ASTRenderer.tsx
│   │   ├── EditableBlock.tsx
│   │   └── ...
│   │
│   ├── DocumentBrowser.tsx
│   └── DocumentViewer.tsx
│
├── hooks/
│   └── useYjsDocument.ts
│
├── services/
│   ├── collaboration/
│   │   ├── yjsClient.ts
│   │   ├── yjsToAst.ts
│   │   ├── presence.ts
│   │   └── blockLock.ts
│   │
│   ├── documents/
│   │   └── ...
│   │
│   └── export/
│       └── ...
│
├── state/
│   ├── editorState.ts
│   └── atomicBlockState.ts
│
├── utils/
│   └── cursorUtils.ts
│
├── tests/
│   ├── astUpdates.test.ts
│   ├── cursorUtils.test.ts
│   ├── atomicBlockState.test.ts
│   ├── editorState.test.ts
│   └── yjsUpdates.test.ts
│
├── types/
│   └── document.ts
│
├── App.tsx
└── main.tsx
```

The exact structure may evolve as the project continues.

---

# 🛠️ Technology Stack

| Technology      | Purpose                            |
| --------------- | ---------------------------------- |
| React           | Frontend UI                        |
| TypeScript      | Type safety                        |
| Vite            | Frontend tooling                   |
| ESLint          | Code quality                       |
| REST API        | Document persistence               |
| AST             | Structured document representation |
| Yjs             | Collaborative shared state         |
| WebSocket       | Real-time communication            |
| CRDT            | Conflict-free synchronization      |
| Session Storage | Client identity persistence        |
| Vitest          | Automated testing                  |

---

# 🚀 Week 1 — AST Foundation

**Status: ✅ Complete**

Week 1 established the frontend editor foundation.

### Completed

* React + TypeScript frontend setup
* Vite configuration
* ESLint
* Document browser
* REST API integration
* Document retrieval
* AST retrieval
* AST rendering
* Recursive nested node rendering
* Heading rendering
* Paragraph rendering
* Code rendering
* List rendering
* List item rendering
* Editable heading blocks
* Editable paragraph blocks
* Editable code blocks
* Local AST state updates
* Loading state handling
* API error handling
* Empty document handling
* Frontend AST validation
* Persistent autosave
* Document creation
* Document deletion
* Save status handling

---

# 🤝 Week 2 — Yjs + WebSocket + CRDT

**Status: ✅ Complete**

Week 2 transformed the editor into a collaborative real-time application.

### Completed

* Yjs client integration
* Yjs document management
* WebSocket synchronization
* Collaborative document state
* AST → Yjs conversion
* Yjs → AST conversion
* Real-time document updates
* Multi-client synchronization
* User presence
* Online user tracking
* User name management
* Presence cleanup
* Block-level locking
* Lock acquisition
* Lock release
* Lock refresh
* Lock expiration
* Lock cleanup
* Connection status
* Reconnection handling
* Collaboration error handling
* Multi-client collaboration testing
* CRDT synchronization validation

---

# 🔄 Week 2 Collaboration Flow

The final Week 2 collaboration flow is:

```text
             User A
                │
                ▼
        ┌───────────────┐
        │ React Editor  │
        └───────┬───────┘
                │
               Yjs
                │
                ▼
        ┌───────────────┐
        │   WebSocket   │
        │     Client    │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │ SyncDoc       │
        │ WebSocket     │
        │ Server        │
        └───────┬───────┘
                │
               Yjs
                │
       ┌────────┴────────┐
       ▼                 ▼
    User B             User C
       │                 │
       ▼                 ▼
    Yjs Client        Yjs Client
       │                 │
       ▼                 ▼
   React Editor      React Editor
```

---

# 📅 Week 3 — Transformation, State & PDF Export

**Status: ✅ Complete**

Week 3 expanded SyncDoc beyond basic collaboration by introducing dedicated editor-state management and integration with the document transformation and PDF export pipeline.

### Completed

#### Editor State

* Editor state architecture
* Active block tracking
* Cursor position tracking
* Selection bounds
* Selection state
* Cursor utilities
* Selection utilities

#### Atomic Block Management

* Atomic block state
* Block activation
* Block editing state
* Block-local state management
* Atomic state validation

#### AST Updates

* Targeted AST updates
* Node lookup by ID
* Recursive node updates
* Nested AST updates
* Immutable AST updates
* Update validation

#### Yjs Integration

* Editor state integration with Yjs
* Collaborative AST updates
* Remote update handling
* Yjs-to-AST state updates
* Collaborative editing validation

#### PDF Export

* Frontend PDF export integration
* Export button/action
* Document ID based export
* PDF download handling
* Latest synchronized content verification

---

# 📊 Week 3 Architecture

The final Week 3 frontend flow is:

```text
                React Editor
                     │
                     ▼
              Editor State
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
       Cursor              Selection
          │                     │
          └──────────┬──────────┘
                     ▼
              Atomic Block
                     │
                     ▼
              Targeted AST
                     │
                     ▼
                  Yjs
                     │
                     ▼
               WebSocket
                     │
                     ▼
              SyncDoc Backend
                     │
                     ▼
            Persistent AST
                     │
                     ▼
          Transformation Engine
                     │
                     ▼
               PDF Generator
                     │
                     ▼
              PDF Download
```

---

# 🗺️ Development Roadmap

```text
Week 1
AST Foundation
    │
    ▼
Week 2
Yjs + WebSocket + CRDT
    │
    ▼
Week 3
Transformation + Editor State + PDF Export
    │
    ▼
Future
Rich Editing + Scalability + Additional Export Formats
```

### Current Progress

| Phase                                | Status |
| ------------------------------------ | ------ |
| Week 1 — AST Foundation              | ✅ 100% |
| Week 2 — Collaboration               | ✅ 100% |
| Week 3 — Transformation & PDF Export | ✅ 100% |

---

# 🚀 Running the Frontend

Install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run linting:

```bash
npm run lint
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

# 🔗 Backend Dependency

The frontend requires the SyncDoc backend to be running for:

* Document retrieval
* Document creation
* Document updates
* Document deletion
* Yjs WebSocket collaboration
* Persistent document synchronization
* PDF export

Typical development setup:

```text
Terminal 1
──────────
cd backend
npm run dev


Terminal 2
──────────
cd frontend
npm run dev
```

---

# 🎯 Project Goal

SyncDoc Frontend demonstrates how a modern React application can combine:

```text
React
+
TypeScript
+
AST
+
Yjs
+
CRDT
+
WebSocket
+
Real-Time Collaboration
+
Editor State
+
PDF Export
```

The primary goal is to build a **structural collaborative editor** where multiple users can work on the same document in real time while preserving its AST structure.

---

# 📄 Project Summary

The SyncDoc frontend has evolved through three major development phases.

### Week 1

> **Browse → Fetch → Render → Edit → Persist**

### Week 2

> **Yjs → WebSocket → CRDT → Presence → Block Locks → Real-Time Collaboration**

### Week 3

> **Editor State → Cursor/Selection → Atomic Blocks → Targeted AST Updates → Yjs → PDF Export**

The frontend now provides:

* A structural AST editor
* Real-time multi-user collaboration
* Presence tracking
* Block-level editing locks
* Cursor and selection state management
* Atomic block state
* Targeted AST updates
* Yjs synchronization
* PDF export integration
* Automated frontend testing

---

# 🏁 Current Status

```text
Week 1 — AST Foundation
████████████████████ 100%

Week 2 — Yjs + CRDT Collaboration
████████████████████ 100%

Week 3 — Transformation + Editor State + PDF Export
████████████████████ 100%
```

**Current milestone:** Week 3 is complete.

The SyncDoc frontend now provides the complete editor and collaboration foundation required for future improvements such as rich-text editing, advanced selection awareness, offline editing, performance optimization, and additional export formats.
