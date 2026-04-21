export interface SyncableRecord {
  id: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SyncListRecord extends SyncableRecord {
  name: string;
  owner_id: string;
  is_template: number;
  created_at: string;
}

export interface SyncItemRecord extends SyncableRecord {
  text: string;
  list_id: string;
  section_id: string | null;
  completed: number;
  order: number;
  created_at: string;
}

export type ElectricSyncStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
