# Feature: Sync Engine

## Context
- Runs in background

---

## Trigger

- App launch
- Network reconnect
- Manual trigger (optional)

---

## Steps

### 1. Push Phase

- Send all local records where:
  - `updated_at > last_synced_at`

- Server:
  - Validates permissions (RLS)
  - Accepts or rejects mutations

---

### 2. Pull Phase

- Request all server records where:
  - `updated_at > last_synced_at`

- Server returns authorized data only

---

### 3. Merge Phase

- For each incoming record:
  - Compare `updated_at`
  - Apply LWW rules
  - Respect `deleted_at`

---

### 4. Finalize

- Update `last_synced_at`

---

## Failure Handling

- Push fails → retry later
- Pull fails → keep local state
- Safe to retry entire sync

---

## Edge Cases

- Same record updated on multiple devices
- Delete vs update conflicts
- Partial sync interruption

---

## Constraints

- Must be idempotent
- Must not corrupt local DB