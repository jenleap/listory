# Patch Feature: Sync Engine (ElectricSQL Migration)

## Summary

This patch replaces the existing manual sync engine (push/pull/merge) with an ElectricSQL-based continuous sync model.

The previous implementation relied on:

* Explicit `/push` and `/pull` API endpoints
* `last_synced_at` tracking
* Client-side merge logic

These are now **removed** and replaced with:

* Automatic bidirectional sync
* Subscription-based updates
* Database-driven conflict resolution

---

## ❗ Breaking Changes

### Removed Concepts

* Push Phase
* Pull Phase
* Merge Phase
* Finalize (`last_synced_at`)
* Manual retry queue
* Express sync endpoints (`/push`, `/pull`)

---

## Updated Architecture

### Before

```
Client → Express API → PostgreSQL
        (push/pull/merge)
```

### After

```
Client (SQLite)
      ⇅
ElectricSQL Client
      ⇅
ElectricSQL Service
      ⇅
PostgreSQL (RLS enforced)
```

---

## Updated Sync Model

### Trigger

#### Automatic

* App launch → establish connection
* Network reconnect → resume sync
* App foreground → ensure active connection

#### Optional

* Manual retry → reinitialize connection

---

## Core Behavior

### 1. Local Writes

* All mutations write directly to local SQLite
* UI updates immediately (no waiting for server)

```
User action → SQLite write → UI updates
```

---

### 2. Outbound Sync (Replaces Push Phase)

* ElectricSQL automatically detects local changes
* Changes are streamed to PostgreSQL

Server responsibilities:

* Apply writes
* Enforce RLS policies

No explicit API call is made.

---

### 3. Inbound Sync (Replaces Pull Phase)

* Client subscribes to server-side changes
* Server sends:

  * Only authorized rows (via RLS)
  * Only changed data

No polling or manual fetch required.

---

### 4. Conflict Resolution (Replaces Merge Phase)

Handled automatically using Last-Write-Wins (LWW):

* Compare `updated_at`
* Newer value overwrites older
* `deleted_at` determines soft deletion

No client-side merge logic required.

---

### 5. Local State Updates

* Incoming changes are applied automatically to SQLite
* UI reacts via standard state/hooks

---

## Failure Handling

* Network loss:

  * Sync pauses
  * Local app remains fully functional

* Reconnect:

  * Sync resumes automatically

* Failed writes:

  * Retried by ElectricSQL

No manual retry logic required.

---

## Edge Cases

### Concurrent Updates (Multiple Devices)

* Resolved via `updated_at` (LWW)

### Delete vs Update

* Most recent timestamp wins
* `deleted_at` respected if newer

### Partial Sync Interruption

* Sync resumes automatically
* No need for checkpoints or timestamps

---

## Data Constraints (Required)

All synced tables must include:

* `id` (UUID, primary key)
* `updated_at` (timestamp)
* `deleted_at` (nullable timestamp)

---

### Mutation Rules

* Every write must update `updated_at`
* Deletes must be soft deletes:

  * Set `deleted_at`
  * Do not remove row

---

## Security Model

* Access control enforced via PostgreSQL RLS
* Client only receives authorized data
* No client-side filtering required

---

## Implementation Notes

### Client

* Remove all sync-specific logic:

  * `last_synced_at`
  * batching
  * push/pull requests
  * merge logic

* Add ElectricSQL client:

  * Initialize connection on app start
  * Bind to local SQLite database

---

### Server

* Remove Express sync routes (`/push`, `/pull`)
* Ensure:

  * PostgreSQL schema is defined
  * RLS policies are implemented
  * ElectricSQL service is running

---

## Migration Notes

* Existing schema is compatible if:

  * `updated_at` exists
  * `deleted_at` is used for soft deletes

* No data migration required if constraints already met

---

## Final State

The application transitions from:

> “Client-driven sync system”

To:

> “Database-driven continuous replication model”

---

## Outcome

* Reduced backend complexity
* No manual sync orchestration
* Real-time updates across devices
* Built-in conflict resolution
* Cleaner client architecture
