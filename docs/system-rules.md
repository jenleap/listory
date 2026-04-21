# SYSTEM RULES - Listory

## 1. Data Principles

- Local database (SQLite) is the source of truth for UI
- Server (PostgreSQL) is the global reconciliation source
- System is eventually consistent

---

## 2. Sync Model

### Sync Type
- Bidirectional (push + pull)

### Sync Trigger
- On app start
- On reconnect to network
- Periodically (optional)

---

## 3. Sync Tracking

- Each client maintains `last_synced_at`

### Push
- Send all records where:
  - `updated_at > last_synced_at`

### Pull
- Fetch all records where:
  - `updated_at > last_synced_at`

### After Sync
- Update `last_synced_at`

---

## 4. Sync Flow

1. Local writes happen immediately
2. Push local changes to server
3. Server validates (RLS)
4. Pull remote changes
5. Merge into local DB

---

## 5. Conflict Resolution

### 1. Last Write Wins (LWW)
- Higher `updated_at` wins

---

### 2. Delete Priority
- If `deleted_at != NULL`, record is considered deleted
- Delete overrides update if:
  - `deleted_at > updated_at`

---

### 3. Update vs Delete

If:
- One client updates
- One client deletes

Then:
- Compare timestamps:
  - newer timestamp wins

---

### 4. Referential Integrity

If a Section is deleted:
- All related Items:
  - `section_id = NULL`
  - `updated_at` updated

---

### 5. Invalid References

If:
- Item references missing or unauthorized section

Then:
- Server rejects or corrects
- Client updates on next sync

---

### 6. Idempotency

- All operations must be safe to replay
- Duplicate sync operations must not corrupt data

---

## 6. Permissions Model

### Roles
- Owner
- Write
- Read

### Capabilities

| Action | Owner | Write | Read |
|--------|------|------|------|
| View list | ✅ | ✅ | ✅ |
| Add item | ✅ | ✅ | ❌ |
| Edit item | ✅ | ✅ | ❌ |
| Delete item | ✅ | ✅ | ❌ |
| Add section | ✅ | ✅ | ❌ |
| Delete section | ✅ | ✅ | ❌ |
| Share list | ✅ | ❌ | ❌ |
| Change permissions | ✅ | ❌ | ❌ |
| Delete list | ✅ | ❌ | ❌ |
| Remove self | ❌ | ✅ | ✅ |

---

## 7. Ordering Rules

- Items and Sections use `order` field
- Sorted ascending
- New records append to end
- Ordering is scoped:
  - Items without section → list-level
  - Items with section → section-level
- Gaps allowed (10, 20, 30)
- If order values become too dense, system may rebalance entire group

---

## 8. Template Rules

- Templates are Lists where `is_template = true`
- Templates:
  - Cannot have completed items
  - Cannot be shared
- Loading template:
  - Creates new records with new UUIDs
  - Sets `completed = false`
- Templates are immutable snapshots of a list at creation time
- Editing a template does not affect the source list
- Templates cannot be shared with other users

---

## 9. Error Handling

- Invalid input → rejected locally
- Unauthorized operations → rejected by server
- Network unavailable:
  - No blocking errors
  - Changes queued locally