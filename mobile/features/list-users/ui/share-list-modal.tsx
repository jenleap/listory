import { useState } from 'react';
import {
  View, Text, Modal, TextInput, TouchableOpacity,
  FlatList, StyleSheet,
} from 'react-native';
import { useListUsers } from '../hooks/use-list-users';
import { ListUserWithName } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  listId: string;
  listOwnerId: string;
  currentUserId: string;
}

export default function ShareListModal({ visible, onClose, listId, listOwnerId, currentUserId }: Props) {
  const { sharedUsers, error, shareList } = useListUsers(listId, listOwnerId, currentUserId);
  const [email, setEmail] = useState('');
  const [access, setAccess] = useState<'write' | 'read'>('write');

  function handleShare() {
    const success = shareList(email, access);
    if (success) {
      setEmail('');
    }
  }

  function handleClose() {
    setEmail('');
    setAccess('write');
    onClose();
  }

  function renderUser({ item }: { item: ListUserWithName }) {
    return (
      <View style={styles.userRow}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={[styles.accessBadge, item.access === 'write' ? styles.writeBadge : styles.readBadge]}>
          <Text style={styles.accessBadgeText}>{item.access === 'write' ? 'Write' : 'Read'}</Text>
        </View>
      </View>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Share List</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Shared with</Text>
          {sharedUsers.length === 0 ? (
            <Text style={styles.emptyText}>Not shared with anyone yet.</Text>
          ) : (
            <FlatList
              data={sharedUsers}
              keyExtractor={(item) => item.user_id}
              renderItem={renderUser}
              style={styles.userList}
            />
          )}

          <Text style={styles.sectionLabel}>Add person</Text>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {error != null && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.accessRow}>
            <TouchableOpacity
              style={[styles.accessButton, access === 'write' && styles.accessButtonActive]}
              onPress={() => setAccess('write')}
            >
              <Text style={[styles.accessButtonText, access === 'write' && styles.accessButtonTextActive]}>Write</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.accessButton, access === 'read' && styles.accessButtonActive]}
              onPress={() => setAccess('read')}
            >
              <Text style={[styles.accessButtonText, access === 'read' && styles.accessButtonTextActive]}>Read</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.shareButton, email.trim() === '' && styles.shareButtonDisabled]}
            onPress={handleShare}
            disabled={email.trim() === ''}
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#888',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 12,
  },
  userList: {
    maxHeight: 160,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 13,
    color: '#888',
  },
  accessBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  writeBadge: {
    backgroundColor: '#e8f4e8',
  },
  readBadge: {
    backgroundColor: '#f0f0f0',
  },
  accessBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#cc0000',
    fontSize: 13,
    marginBottom: 8,
  },
  accessRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  accessButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  accessButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#e8f0ff',
  },
  accessButtonText: {
    fontSize: 15,
    color: '#555',
  },
  accessButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  shareButton: {
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonDisabled: {
    backgroundColor: '#ccc',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
