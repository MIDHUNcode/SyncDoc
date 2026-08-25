# SyncDoc Frontend

**SyncDoc Frontend** is a **React + TypeScript** collaborative document editor built around a structured **Abstract Syntax Tree (AST)**.

The frontend allows users to browse, edit, and collaboratively synchronize structured documents in real time using **Yjs, WebSocket, and CRDT-based synchronization**.

---

## 🚧 Project Status

| Phase                                | Status         |
| ------------------------------------ | -------------- |
| Week 1 — AST Foundation              | ✅ Complete     |
| Week 2 — Yjs + CRDT Collaboration    | ✅ Complete     |
| Week 3 — Transformation & PDF Export | 🚧 In Progress |

**Current Phase:** Week 3 — Transformation & PDF Export
**Frontend Status:** ✅ Week 1 + Week 2 Complete

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

# 🔄 REST API Integration

The frontend communicates with the SyncDoc backend through REST APIs for document persistence and retrieval.

The API layer handles:

* Fetching documents
* Fetching individual documents
* Retrieving document AST
* Creating documents
* Updating documents
* Deleting documents
* API response handling
* API error handling

Architecture:

```text
React Frontend
      │
      │ HTTP / REST
      ▼
SyncDoc Backend
      │
      ▼
MongoDB
```

REST APIs provide document persistence while Yjs/WebSocket handles real-time collaboration.

---

# 🤝 Real-Time Collaboration

Week 2 transformed the frontend from a local AST editor into a real-time collaborative editor.

The frontend now uses:

* Yjs
* WebSocket
* CRDT synchronization
* Collaborative document state
* User presence
* Block-level locking
* Reconnection handling
* Connection status tracking

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

# 🧩 Yjs Integration

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

The Yjs document acts as the real-time source of collaborative state.

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

This allows the application to preserve the structured AST model while using Yjs for conflict-free synchronization.

The frontend can therefore work with:

```text
ASTNode
```

while collaborative synchronization operates through:

```text
Y.Doc
Y.Array
Y.Map
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

If a client disconnects or a lock expires, the lock can be cleaned up so another user can edit the block.

---

# 🔌 Connection Management

The frontend tracks the Yjs/WebSocket connection state.

The UI can indicate states such as:

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

This prevents the editor from treating a temporary network failure as a permanent collaboration failure.

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

# 🧠 Collaborative State Architecture

The frontend collaborative state is managed through a dedicated hook:

```text
React Component
      │
      ▼
useYjsDocument()
      │
      ├── Yjs Document
      ├── Yjs Nodes
      ├── Presence
      ├── Connection Status
      └── Collaboration Updates
```

This keeps the React components focused on rendering and user interaction while the collaboration logic remains inside the Yjs service layer.

---

# 🏗️ Frontend Architecture

The current frontend architecture can be represented as:

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
│       └── AST Editor
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
└── AST Renderer
        │
        ├── Heading
        ├── Paragraph
        ├── Code
        ├── List
        └── List Item
```

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

# ⚛️ State Management

Week 1 used local React state as the primary editing state.

During Week 2, collaborative state was moved toward Yjs.

Current flow:

```text
Backend AST
     ↓
Yjs Document
     ↓
Collaborative State
     ↓
React Hook
     ↓
AST Renderer
     ↓
Editable Blocks
```

Local React state is still used where appropriate for UI concerns, while document collaboration is handled through Yjs.

---

# 🧩 Supported AST Node Types

| Node Type       | Rendering |             Editing | Collaboration |
| --------------- | --------: | ------------------: | ------------: |
| Heading         |         ✅ |                   ✅ |             ✅ |
| Paragraph       |         ✅ |                   ✅ |             ✅ |
| Code            |         ✅ |                   ✅ |             ✅ |
| List            |         ✅ |                   ❌ |             ✅ |
| List Item       |         ✅ |                   ❌ |             ✅ |
| Nested Children |         ✅ | Based on child type |             ✅ |

---

# 📁 Project Structure

The frontend currently follows a service/component architecture similar to:

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
│   └── documents/
│       └── ...
│
├── types/
│   └── document.ts
│
├── App.tsx
└── main.tsx
```

The exact structure may evolve as Week 3 development continues.

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

# 📊 Week 2 Collaboration Flow

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

# 🧪 Testing

The frontend collaboration features have been tested using multiple browser clients.

Validation includes:

* Document synchronization between clients
* Real-time block updates
* User presence
* Presence cleanup
* Block locking
* Lock expiration
* WebSocket reconnection
* Connection status
* Multiple simultaneous clients
* Yjs state synchronization

The backend automated test suite also validates the AST and collaboration-related transformation layers.

---

# 📌 Current Limitations

The following areas remain available for future improvement:

* Rich text formatting
* Advanced cursor/selection awareness
* More AST node types
* Advanced collaborative selection visualization
* Rich code syntax highlighting
* Offline-first editing
* Advanced conflict visualization
* Performance optimization for very large documents
* Advanced PDF export controls

---

# 📅 Week 3 — Transformation & PDF Export

**Status: 🚧 In Progress**

Week 3 currently focuses on converting the collaborative AST into exportable document structures.

Completed so far:

```text
AST
 ↓
ExportDocument
 ↓
PDF Structure
 ↓
PDF Generator
 ↓
PDF Export API
```

The backend now provides:

```http
GET /api/documents/:id/export/pdf
```

The frontend can consume this endpoint to download the current document as a PDF.

Upcoming Week 3 work includes:

* PDF formatting refinement
* Improved layout
* Advanced code block formatting
* Export validation
* PDF quality improvements

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
Transformation + PDF Export
    │
    ▼
Future
Rich Editing + Scalability + Additional Export Formats
```

### Current Progress

| Phase                         | Status         |
| ----------------------------- | -------------- |
| Week 1 — AST Foundation       | ✅ 100%         |
| Week 2 — Collaboration        | ✅ 100%         |
| Week 3 — Transformation & PDF | 🚧 In Progress |

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

SyncDoc Frontend is designed to demonstrate how a modern React application can combine:

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
```

The primary goal is to build a **structural collaborative editor** where users can work on the same document in real time while preserving the document's AST structure.

---

# 📄 Project Summary

The SyncDoc frontend has evolved from a local AST editor into a real-time collaborative document editor.

### Week 1

> **Browse → Fetch → Render → Edit → Persist**

### Week 2

> **Yjs → WebSocket → CRDT → Presence → Block Locks → Real-Time Collaboration**

### Week 3

> **AST → Export Structure → PDF → Download**

The current frontend provides the collaborative editing foundation required for SyncDoc's transformation and export pipeline.
