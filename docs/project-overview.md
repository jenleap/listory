# PROJECT OVERVIEW - Listory

## 1. Purpose

Listory is an offline-first mobile app that allows users within a household to create, manage, and share lists. The app supports real-time collaboration over a local network while remaining fully functional offline.

---

## 2. Core Concepts

- Offline-first: all operations occur locally first
- Eventually consistent across devices
- Lists can be private or shared
- Role-based access control (owner, write, read)
- Soft deletes only (no hard deletes)
- Templates are lists with `is_template = true`

---

## 3. Architecture

- React Native (mobile client)
- SQLite (local database)
- ElectricSQL (sync layer)
- PostgreSQL (home server)

---

## 4. Data Models

### User
- id: string (UUID)
- email: string
- name: string
- password_hash: string
- created_at: timestamp

### List
- id: string (UUID)
- name: string
- owner_id: string
- is_template: boolean
- created_at: timestamp
- updated_at: timestamp
- deleted_at: timestamp

### ListUser
- list_id: string
- user_id: string
- access: "write" | "read"
- created_at: timestamp
- updated_at: timestamp
- deleted_at: timestamp

### Section
- id: string (UUID)
- list_id: string
- name: string
- order: number
- created_at: timestamp
- updated_at: timestamp
- deleted_at: timestamp

### Item
- id: string (UUID)
- text: string
- order: number
- list_id: string
- section_id: string | null
- completed: boolean
- created_at: timestamp
- updated_at: timestamp
- deleted_at: timestamp

---

## 5. Global Constraints

- All IDs are client-generated UUIDs
- All records use soft deletes (`deleted_at`)
- `updated_at` must be updated on every mutation
- Item names must be unique per list (case-insensitive, trimmed)
- Section names must be unique per list
- List names must be unique per user
- Users can only access lists they own or are shared on