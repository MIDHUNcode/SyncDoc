# SyncDoc Frontend

**SyncDoc Frontend** is a **React + TypeScript** collaborative document editor built around a structured **Abstract Syntax Tree (AST)**.

The frontend allows users to browse, edit, and collaboratively synchronize structured documents in real time using **Yjs, WebSocket, and CRDT-based synchronization**.

The frontend also integrates with the document transformation and PDF export pipeline and includes security mechanisms using **DOMPurify** to sanitize user-controlled document content.

---

# 🚧 Project Status

| Phase                                       | Status     |
| ------------------------------------------- | ---------- |
| Week 1 — AST Foundation                     | ✅ Complete |
| Week 2 — Yjs + CRDT Collaboration           | ✅ Complete |
| Week 3 — Transformation, State & PDF Export | ✅ Complete |
| Week 4 — Security & Advanced Collaboration  | ✅ Complete |

**Current Phase:** Week 4 — Security & Advanced Collaboration
**Frontend Status:** ✅ Week 1 + Week 2 + Week 3 + Week 4 Complete

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
* Sanitized content rendering

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
Sanitize Content
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

The frontend contains dedicated editor-state utilities to manage document editing independently from the React rendering layer.

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

This provides a cleaner foundation for targeted document editing and collaborative state synchronization.

---

# 🎯 Cursor & Selection Handling

The frontend manages cursor and selection information at the block level.

Implemented:

* Cursor position tracking
* Selection start tracking
* Selection end tracking
* Selection bounds
* Cursor validation
* Selection normalization
* Block-aware cursor state
* Collaborative cursor synchronization
* Collaborative selection synchronization
* Selection clearing
* Cursor cleanup

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

Cursor and selection information can also be synchronized through the collaborative presence state.

---

# ⚛️ Atomic Block State

Each editable block maintains its own editing state.

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
* Lock state
* Block-local state updates
* Atomic block state validation

This keeps block editing localized and reduces unnecessary updates to unrelated document nodes.

---

# 🔄 Targeted AST Updates

The frontend supports targeted AST updates instead of unnecessarily rebuilding unrelated document state.

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
* Sanitized content updates

---

# 🔄 Yjs Integration

The frontend contains a dedicated Yjs collaboration layer.

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

The Yjs document acts as the real-time collaborative state.

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
* Block editing state
* Cursor synchronization
* Selection synchronization
* Reconnection handling
* Connection status tracking
* Remote AST updates
* Presence cleanup

Architecture:

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
* Online user tracking
* Presence cleanup
* Connection-aware presence
* Session-based user identity
* Cursor information
* Selection information
* Stale presence removal

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
* Editing indicators
* Locked-block indicators
* Block state indicators

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

# 🟢 Block State Indicators

Week 4 introduced visual block state indicators.

A block can represent states such as:

```text
Active
Editing
Locked
Available
```

Example:

```text
Paragraph
   │
   ├── Active
   ├── Editing
   └── Locked
```

These indicators make the collaborative editing state easier to understand.

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

# 🛡️ Security & Content Sanitization

Week 4 introduced frontend content sanitization using **DOMPurify**.

The goal is to prevent unsafe user-controlled content from being rendered or propagated through the editor.

Security architecture:

```text
User Content
     ↓
Sanitization
     ↓
AST Update
     ↓
Yjs State
     ↓
Collaborative Sync
     ↓
Sanitized Rendering
```

The sanitization layer is centralized in:

```text
services/security/sanitizer.ts
```

Implemented:

* DOMPurify integration
* Content sanitization
* Optional content sanitization
* Recursive AST sanitization
* Sanitization before rendering
* Sanitization during AST content updates
* XSS/security test coverage
* Safe text rendering

Structural AST fields such as node IDs and node types are not treated as HTML content.

---

# 🚫 XSS Protection

SyncDoc treats document content as user-controlled data.

Unsafe HTML-like input is sanitized before being used by the editor.

Example:

```text
User Input
    ↓
Potentially Unsafe Content
    ↓
DOMPurify
    ↓
Sanitized Content
    ↓
AST
    ↓
Yjs
    ↓
React Rendering
```

The frontend does not depend on unsafe HTML injection for AST rendering.

Security tests validate that unsafe content is removed or neutralized appropriately.

---

# 🧩 Collaborative State Architecture

The frontend collaborative state is managed through the Yjs document hook and collaboration services.

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
      ├── Cursor State
      ├── Selection State
      ├── Editing Users
      ├── Block Locks
      ├── Connection Status
      └── Collaboration Updates
```

This keeps React components focused on rendering and user interaction while collaboration logic remains in the service layer.

---

# 📤 PDF Export Integration

The frontend integrates with the backend PDF export pipeline.

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

```text
GET /api/documents/:id/export/pdf
```

The exported PDF reflects the latest synchronized and persisted document state.

---

# 🏗️ Frontend Architecture

The overall frontend architecture is:

```text
SyncDoc Frontend
│
├── Document Browser
│
├── Document Viewer
│   ├── Connection Status
│   ├── Presence
│   ├── Cursor State
│   ├── Selection State
│   ├── Editing Indicators
│   └── AST Editor
│
├── Editor State
│   ├── Cursor
│   ├── Selection
│   ├── Atomic Block State
│   └── Targeted AST Updates
│
├── Security Layer
│   └── DOMPurify Sanitization
│
├── API Layer
│
├── Collaboration Layer
│   ├── Yjs
│   ├── AST ↔ Yjs
│   ├── Presence
│   └── Block Locks
│
├── Export Layer
│   └── PDF Download
│
└── AST Renderer
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

# 🧪 Automated Testing

The frontend uses **Vitest** for automated testing.

Current frontend test suite:

```text
✓ AST Updates
✓ Cursor Utilities
✓ Atomic Block State
✓ Editor State
✓ Yjs Updates
✓ Presence
✓ Security / Sanitization
```

Current result:

```text
Test Files: 7 passed
Tests:      74 passed
```

### Test Breakdown

| Test Area                |  Tests |
| ------------------------ | -----: |
| AST Updates              |      8 |
| Cursor Utilities         |      4 |
| Atomic Block State       |     10 |
| Editor State             |     15 |
| Yjs Updates              |      7 |
| Presence / Collaboration |     20 |
| Security / Sanitization  |     10 |
| **Total**                | **74** |

Run the frontend tests:

```text
npm test
```

---

# 🧪 TypeScript Validation

The frontend TypeScript project is validated using:

```text
npx tsc --noEmit
```

The current Week 4 implementation passes TypeScript validation successfully.

---

# 🌐 Manual Collaboration Testing

The collaborative editor has been validated using multiple browser tabs.

Tested scenarios:

* Open the same document in two browser tabs
* Both clients show Connected
* Online user count updates
* Edit a block in Tab A
* Verify the change appears in Tab B
* Edit another block in Tab B
* Verify the change appears in Tab A
* Verify presence indicators
* Verify editing indicators
* Verify block-level locking
* Verify cursor synchronization
* Verify selection synchronization
* Verify selection clearing
* Verify stale presence cleanup
* Verify reconnection behavior

Example:

```text
Tab A
  │
  │ Edit Paragraph
  ▼
Cursor / Selection
  │
  ▼
Presence State
  │
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
Updated Collaboration State
```

---

# 🛡️ Manual Security Testing

Week 4 security behavior was validated through automated and manual testing.

Tested:

```text
Unsafe Content
      ↓
Sanitization
      ↓
AST
      ↓
Yjs
      ↓
React Rendering
```

Validated areas:

* Content sanitization
* Recursive AST sanitization
* Sanitization during AST updates
* Sanitized rendering
* XSS-related test cases
* Safe block rendering

---

# 📤 Manual PDF Export Testing

The PDF export workflow has been validated manually.

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

The exported PDF reflects the latest synchronized document changes.

---

# 📁 Project Structure

The frontend follows a component/service/state architecture.

```text
src/
│
├── components/
│   ├── blocks/
│   │   ├── ASTBlock.tsx
│   │   ├── ASTRenderer.tsx
│   │   ├── BlockStateIndicator.tsx
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
│   │   ├── blockLock.ts
│   │   ├── presence.ts
│   │   ├── yjsToAst.ts
│   │   ├── yjsUpdates.ts
│   │   └── ...
│   │
│   ├── security/
│   │   └── sanitizer.ts
│   │
│   └── export/
│       └── ...
│
├── state/
│   ├── cursorUtils.ts
│   ├── editorState.ts
│   └── ...
│
├── utils/
│   └── astUpdates.ts
│
├── tests/
│   ├── astUpdates.test.ts
│   ├── cursorUtils.test.ts
│   ├── atomicBlockState.test.ts
│   ├── editorState.test.ts
│   ├── yjsUpdates.test.ts
│   ├── presence.test.ts
│   └── sanitizer.test.ts
│
├── types/
│   ├── document.ts
│   └── editor.ts
│
├── App.tsx
└── main.tsx
```

---

# 🛠️ Technology Stack

| Technology      | Purpose                            |
| --------------- | ----------------------------------- |
| React           | Frontend UI                        |
| TypeScript      | Type safety                        |
| Vite            | Frontend tooling                   |
| ESLint          | Code quality                       |
| REST API        | Document persistence               |
| AST             | Structured document representation |
| Yjs             | Collaborative shared state         |
| WebSocket       | Real-time communication            |
| CRDT            | Conflict-free synchronization      |
| DOMPurify       | Content sanitization               |
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

# 📅 Week 3 — Transformation, State & PDF Export

**Status: ✅ Complete**

Week 3 introduced dedicated editor-state management and PDF export integration.

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

# 🛡️ Week 4 — Security & Advanced Collaboration

**Status: ✅ Complete**

Week 4 focused on securing the editor and improving collaborative editing awareness.

### 4.1 — DOMPurify Security Architecture

Implemented a centralized content sanitization architecture.

* Identified user-controlled content
* Added centralized sanitizer
* Sanitized AST content
* Preserved AST structural fields
* Added rendering-time sanitization

### 4.2 — DOMPurify Configuration

Implemented DOMPurify configuration for document content.

* DOMPurify integration
* Sanitization configuration
* Safe content handling
* Optional content sanitization

### 4.3 — Sanitize Saved AST Block Content

AST content is sanitized during targeted content updates.

```text
User Input
    ↓
sanitizeContent()
    ↓
AST Update
    ↓
Yjs
```

### 4.4 — Sanitize Before Rendering

The renderer sanitizes AST content before displaying it.

```text
AST
 ↓
sanitizeASTForRendering()
 ↓
React Renderer
 ↓
User Interface
```

### 4.5 — XSS & Security Testing

Added security-focused test cases covering:

* Unsafe HTML content
* Script-like content
* Content sanitization
* Optional content
* Recursive AST sanitization
* Safe rendering behavior

### 4.6 — Block State Indicators

Added visual state indicators for collaborative blocks.

Supported states include:

* Active
* Editing
* Locked

### 4.7 — Collaborative Block Editing & Lock States

Improved block-level editing protection.

Implemented:

* Lock acquisition
* Lock refresh
* Lock release
* Lock expiration
* Read-only locked blocks
* Editing indicators
* Lock indicators
* Two-client lock validation

### 4.8 — Cursor Synchronization

Implemented collaborative cursor state.

```text
User Cursor
    ↓
Presence State
    ↓
Yjs
    ↓
Other Clients
```

Implemented:

* Cursor block ID
* Cursor offset
* Cursor publishing
* Cursor updates
* Cursor clearing
* Cursor heartbeat preservation

### 4.9 — Selection Synchronization

Implemented collaborative selection state.

Selection contains:

```text
Start
 ├── blockId
 └── offset

End
 ├── blockId
 └── offset
```

Implemented:

* Selection start
* Selection end
* Selection publishing
* Selection clearing
* Cursor updates during selection
* Collaborative selection validation

### 4.10 — Multi-Client Cursor Validation

Validated collaboration using multiple clients.

Tested:

* Cursor synchronization
* Selection synchronization
* Cursor updates
* Selection clearing
* User presence
* Block editing
* Block locking
* Reconnection

### 4.11 — Presence & Cursor Cleanup

Implemented cleanup for collaborative presence state.

Implemented:

* Explicit presence removal
* Stale presence cleanup
* Cursor cleanup
* Selection cleanup
* Disconnect cleanup
* Lock cleanup

### 4.12 — Final Security & Collaboration Testing

Final Week 4 validation included:

```text
TypeScript
    ↓
Automated Tests
    ↓
Security Tests
    ↓
Two-Client Collaboration
    ↓
Cursor Validation
    ↓
Selection Validation
    ↓
Block Lock Validation
    ↓
Presence Cleanup
    ↓
PDF Regression Test
```

Final frontend result:

```text
7 Test Files Passed
74 Tests Passed
TypeScript Validation Passed
Manual Collaboration Validation Passed
Security Validation Passed
PDF Regression Validation Passed
```

---

# 📊 Week 4 Architecture

The final Week 4 frontend flow is:

```text
                     React Editor
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
      Editor State    Security Layer   Presence State
          │               │                │
          │           DOMPurify             │
          │               │                │
          ▼               ▼                ▼
      Atomic Block      Sanitized        Cursor
         State            Content       Selection
          │                 │                │
          └─────────────────┼────────────────┘
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
                ┌───────────┴───────────┐
                ▼                       ▼
           Persistence            Collaboration
                │
                ▼
             MongoDB
                │
                ▼
        Transformation Engine
                │
                ▼
          PDF Generator
```

---

# 🧪 Overall Test Status

The frontend currently has:

```text
7 Test Files
74 Tests
0 Failing Tests
```

The broader SyncDoc project has:

```text
Frontend → 74 tests
Backend  → 37 tests
────────────────────
Total    → 111 tests
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
Week 4
Security + Advanced Collaboration
    │
    ▼
Future
Rich Editing + Scalability + Additional Export Formats
```

### Current Progress

| Phase                                | Status |
| ------------------------------------- | -----: |
| Week 1 — AST Foundation              | ✅ 100% |
| Week 2 — Collaboration               | ✅ 100% |
| Week 3 — Transformation & PDF Export | ✅ 100% |
| Week 4 — Security & Collaboration    | ✅ 100% |

---

# 🚀 Running the Frontend

Install dependencies:

```text
cd frontend
npm install
```

Start the development server:

```text
npm run dev
```

Build for production:

```text
npm run build
```

Run linting:

```text
npm run lint
```

Run tests:

```text
npm test
```

Run TypeScript validation:

```text
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
Presence
+
Cursor & Selection Synchronization
+
Block-Level Locking
+
DOMPurify Security
+
Editor State
+
PDF Export
```

The primary goal is to build a **secure structural collaborative editor** where multiple users can work on the same document in real time while preserving its AST structure.

---

# 📄 Project Summary

The SyncDoc frontend has evolved through four major development phases.

### Week 1

> **Browse → Fetch → Render → Edit → Persist**

### Week 2

> **Yjs → WebSocket → CRDT → Presence → Block Locks → Real-Time Collaboration**

### Week 3

> **Editor State → Cursor/Selection → Atomic Blocks → Targeted AST Updates → Yjs → PDF Export**

### Week 4

> **DOMPurify → Sanitization → XSS Protection → Block States → Cursor Sync → Selection Sync → Presence Cleanup → Final Validation**

The frontend now provides:

* A structural AST editor
* Real-time multi-user collaboration
* User presence tracking
* Block-level editing locks
* Block state indicators
* Cursor synchronization
* Selection synchronization
* Atomic block state
* Targeted AST updates
* Yjs synchronization
* DOMPurify-based content sanitization
* XSS/security testing
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

Week 4 — Security + Advanced Collaboration
████████████████████ 100%
```

**Current milestone: Week 4 is complete.**

The SyncDoc frontend now provides the **complete AST editing, real-time collaboration, security, cursor/selection synchronization, block locking, presence, and PDF export foundation** required for the next development phase.