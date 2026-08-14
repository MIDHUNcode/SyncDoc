# SyncDoc Frontend

SyncDoc Frontend is a **React + TypeScript** application for browsing and editing structured documents represented as an **Abstract Syntax Tree (AST)**.

The frontend currently provides the **Week 1 editor foundation**, including:

* Document browsing
* REST API integration
* AST document retrieval
* Recursive AST rendering
* Nested block rendering
* Editable heading blocks
* Editable paragraph blocks
* Editable code blocks
* Local React state updates

> Persistent database synchronization and real-time collaborative editing are planned for **Week 2** using **Yjs, WebSocket, and CRDTs**.

---

## 🚧 Project Status

| Phase                           | Status     |
| ------------------------------- | ---------- |
| Week 1 — AST Foundation         | ✅ Complete |
| Week 2 — Yjs + WebSocket + CRDT | 🚧 Next    |

**Current Phase:** Week 1 — AST Foundation
**Frontend Status:** ✅ Week 1 Complete
**Next Phase:** Week 2 — Yjs + WebSocket + CRDT Synchronization

---

# ✨ Features

## 📄 Document Browser

The Document Browser provides the foundation for selecting documents from the SyncDoc backend.

Features:

* Fetches documents from the backend
* Displays document titles
* Displays last updated timestamps
* Allows selecting a document
* Fetches the complete AST for the selected document
* Handles loading states
* Handles API errors
* Handles empty document lists

---

## 🌳 AST Rendering

SyncDoc documents are represented using an **Abstract Syntax Tree (AST)** rather than a single text string.

The frontend currently supports:

* Heading
* Paragraph
* Code
* List
* List Item
* Nested children
* Recursive AST rendering

The AST is rendered recursively so that nested blocks can be represented correctly regardless of their depth.

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

---

## ✏️ Block Editor

The Week 1 frontend includes a basic editable block foundation.

Currently editable:

* Heading blocks
* Paragraph blocks
* Code blocks

The editor updates the local React state while the user edits the content.

### Current Editing Flow

```text
User edits block
       ↓
React onChange
       ↓
Local React State
       ↓
AST state updated
       ↓
UI re-renders
```

---

## 🔄 REST API Integration

The frontend communicates with the SyncDoc backend through REST APIs.

The API layer is responsible for:

* Fetching all documents
* Fetching a document by ID
* Retrieving the document AST
* Handling API responses
* Handling API errors

Current architecture:

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
SyncDoc Backend
      │
      ▼
MongoDB
```

---

# 🏗️ Frontend Architecture

The frontend follows a component-based React architecture.

```text
SyncDoc Frontend
│
├── Document Browser
│       │
│       └── Select Document
│
├── API Layer
│       │
│       └── REST API Requests
│
├── Document State
│       │
│       └── Selected AST
│
└── AST Editor
        │
        ├── Heading
        ├── Paragraph
        ├── Code
        ├── List
        └── List Item
```

---

# 🌳 AST Editor Architecture

The editor uses recursive rendering to convert AST nodes into React components.

```text
AST Root
   │
   ├── Node
   │    │
   │    ├── Node Content
   │    │
   │    └── Children
   │          │
   │          ├── Child Node
   │          ├── Child Node
   │          └── Child Node
   │
   └── Next Node
```

This approach allows the editor to support deeply nested document structures.

---

# ⚛️ React State Management

During Week 1, document editing is handled using local React state.

The basic flow is:

```text
AST fetched from backend
          ↓
React State
          ↓
AST rendered
          ↓
User edits block
          ↓
onChange
          ↓
AST state updated
          ↓
React re-renders
```

At this stage, changes are maintained locally in the frontend.

Persistent synchronization will be introduced during Week 2.

---

# 🧩 Supported AST Node Types

| Node Type       | Rendering | Editing             |
| --------------- | --------- | ------------------- |
| Heading         | ✅         | ✅                   |
| Paragraph       | ✅         | ✅                   |
| Code            | ✅         | ✅                   |
| List            | ✅         | ❌                   |
| List Item       | ✅         | ❌                   |
| Nested Children | ✅         | Based on child type |

---

# 📁 Suggested Project Structure

```text
src/
│
├── components/
│   ├── DocumentBrowser.tsx
│   ├── ASTRenderer.tsx
│   ├── BlockEditor.tsx
│   └── ...
│
├── api/
│   └── documents.ts
│
├── types/
│   └── ast.ts
│
├── hooks/
│   └── ...
│
├── pages/
│   └── ...
│
├── App.tsx
└── main.tsx
```

The exact structure may vary depending on the current implementation.

---

# 🛠️ Technology Stack

| Technology  | Purpose                               |
| ----------- | ------------------------------------- |
| React       | Frontend UI                           |
| TypeScript  | Type safety                           |
| REST API    | Backend communication                 |
| React State | Local AST editing                     |
| AST         | Structured document representation    |
| Yjs         | Planned collaborative state           |
| WebSocket   | Planned real-time communication       |
| CRDT        | Planned conflict-free synchronization |

---

# 🚀 Week 1 Implementation

Week 1 focused on establishing the frontend editor foundation.

### Completed

*  React + TypeScript frontend setup
*  Document browser
*  REST API integration
*  Document retrieval
*  AST retrieval
*  AST rendering
*  Recursive nested node rendering
*  Heading block rendering
*  Paragraph block rendering
*  Code block rendering
*  List rendering
*  List item rendering
*  Editable heading blocks
*  Editable paragraph blocks
*  Editable code blocks
*  Local React AST state updates
*  Loading state handling
*  Error handling
*  Empty document handling

---

# 🔮 Week 2 — Collaborative Editing

The next phase focuses on real-time collaborative editing.

Planned technologies:

* **Yjs**
* **WebSocket**
* **CRDT**
* **User presence**
* **Real-time synchronization**

### Planned Week 2 Flow

```text
User A
   │
   ▼
React Editor
   │
   ▼
Yjs Document
   │
   ▼
WebSocket
   │
   ▼
Sync Server
   │
   ▼
WebSocket
   │
   ▼
Yjs Document
   │
   ▼
React Editor
   │
   ▼
User B
```

---

# 🤝 Planned Collaboration Features

Week 2 will introduce:

* Yjs document integration
* WebSocket connection
* CRDT-based synchronization
* Real-time document updates
* Multi-user editing
* User presence indicators
* Cursor or selection awareness
* Localized operational block locking
* Initial collaborative document state
* Conflict-free concurrent editing

---

# 🔐 Future Synchronization Architecture

The planned architecture is:

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

CRDT synchronization will allow multiple users to edit the same document while minimizing synchronization conflicts.

---

# 📌 Current Limitations

The Week 1 implementation intentionally has several limitations:

* Changes are stored only in local React state
* Changes are not yet persisted automatically
* No real-time collaboration
* No Yjs integration
* No WebSocket synchronization
* No CRDT synchronization
* No multi-user presence
* No collaborative cursor tracking
* No block-level locking

These features are planned for Week 2.

---

# 🧪 Testing

The frontend can be tested by verifying:

1. Documents load successfully from the backend.
2. The document list displays correctly.
3. Selecting a document loads its AST.
4. AST nodes render recursively.
5. Nested nodes render correctly.
6. Heading content can be edited.
7. Paragraph content can be edited.
8. Code content can be edited.
9. React state updates when content changes.
10. Loading and API error states are displayed correctly.

---

# 🏁 Week 1 Completion Criteria

The Week 1 frontend foundation is considered complete when:

* ✅ Documents can be browsed.
* ✅ Documents can be selected.
* ✅ AST data can be retrieved.
* ✅ AST nodes can be rendered.
* ✅ Nested nodes can be rendered recursively.
* ✅ Supported blocks can be edited.
* ✅ Local AST state updates correctly.
* ✅ Loading and error states are handled.

**Week 1 Status: ✅ Complete**

---

# 🚧 Next Step

The next development phase is:

## Week 2 — Yjs + WebSocket + CRDT Synchronization

The primary goal is to transform the current local AST editor into a **real-time collaborative document editor**.

```text
Week 1
AST + REST API + React Editor
              ↓
Week 2
Yjs + WebSocket + CRDT
              ↓
Collaborative SyncDoc Editor
```

---

# 📄 Project Summary

**SyncDoc Frontend** provides a structured document editing experience based on an **AST architecture**.

Week 1 establishes the complete frontend foundation:

> **Browse → Fetch → Render → Edit → Update Local AST**

Week 2 will extend this foundation with:

> **Yjs → WebSocket → CRDT → Real-Time Collaboration**
