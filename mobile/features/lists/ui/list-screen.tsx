import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useItems } from '../../items/hooks/use-items';
import { Item } from '../../items/types';
import ItemRow from '../../items/ui/item-row';
import { useSections } from '../../sections/hooks/use-sections';
import { Section } from '../../sections/types';
import SectionHeader from '../../sections/ui/section-header';
import ShareListModal from '../../list-users/ui/share-list-modal';
import { useListUsers } from '../../list-users/hooks/use-list-users';

const CURRENT_USER_ID = 'user-1';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

type ListRow =
  | { type: 'section'; section: Section }
  | { type: 'item'; item: Item };

const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export default function ListScreen({ route, navigation }: Props) {
  const { listId, ownerId } = route.params;
  const { items, error: itemError, addItem, editItem, deleteItem, toggleItem, clearCompleted } = useItems(listId);
  const { sections, error: sectionError, addSection } = useSections(listId);
  const { removeListUser } = useListUsers(listId, ownerId, CURRENT_USER_ID);
  const [inputText, setInputText] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [sectionInputText, setSectionInputText] = useState('');
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const sectionInputRef = useRef<TextInput>(null);

  function handleSubmit() {
    const trimmed = inputText.trim();
    if (trimmed === '') return;
    const success = addItem(trimmed);
    if (success) {
      setInputText('');
    }
  }

  function handleChangeText(text: string) {
    setInputText(text);
  }

  function handleAddSectionPress() {
    setIsAddingSection(true);
    setSectionInputText('');
    setTimeout(() => sectionInputRef.current?.focus(), 50);
  }

  function handleSectionInputBlur() {
    addSection(sectionInputText);
    setIsAddingSection(false);
    setSectionInputText('');
  }

  function handleSectionInputSubmit() {
    sectionInputRef.current?.blur();
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleEllipsisPress} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>•••</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function handleRemoveFromList() {
    Alert.alert(
      'Remove From List',
      'Are you sure you want to remove yourself from this list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove Me',
          style: 'destructive',
          onPress: () => {
            const success = removeListUser(listId, CURRENT_USER_ID, ownerId);
            if (success) {
              navigation.goBack();
            }
          },
        },
      ]
    );
  }

  function handleEllipsisPress() {
    const isOwner = CURRENT_USER_ID === ownerId;
    const options: { text: string; onPress?: () => void; style?: 'cancel' | 'destructive' | 'default' }[] = [];

    if (isOwner) {
      options.push({ text: 'Share', onPress: () => setShareModalVisible(true) });
    } else {
      options.push({ text: 'Remove Me From List', style: 'destructive', onPress: handleRemoveFromList });
    }
    options.push({ text: 'Clear Completed', onPress: () => clearCompleted() });
    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('List Actions', undefined, options);
  }

  function buildRows(): ListRow[] {
    const rows: ListRow[] = [];

    const unsectioned = items.filter((i) => i.section_id === null);
    for (const item of unsectioned) {
      rows.push({ type: 'item', item });
    }

    for (const section of sections) {
      rows.push({ type: 'section', section });
      const sectionItems = items.filter((i) => i.section_id === section.id);
      for (const item of sectionItems) {
        rows.push({ type: 'item', item });
      }
    }

    return rows;
  }

  function renderRow({ item: row }: { item: ListRow }) {
    if (row.type === 'section') {
      return <SectionHeader name={row.section.name} />;
    }
    return <ItemRow item={row.item} onEdit={editItem} onDelete={deleteItem} onToggle={toggleItem} />;
  }

  function rowKey(row: ListRow) {
    return row.type === 'section' ? `section-${row.section.id}` : `item-${row.item.id}`;
  }

  const rows = buildRows();
  const error = itemError ?? sectionError;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={HEADER_HEIGHT + insets.top}
    >
      {rows.length === 0 ? (
        <Text style={styles.empty}>No items yet.</Text>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={rowKey}
          renderItem={renderRow}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {isAddingSection && (
        <View style={styles.sectionInputContainer}>
          <TextInput
            ref={sectionInputRef}
            style={styles.sectionInput}
            placeholder="Section name…"
            value={sectionInputText}
            onChangeText={setSectionInputText}
            onBlur={handleSectionInputBlur}
            onSubmitEditing={handleSectionInputSubmit}
            returnKeyType="done"
          />
        </View>
      )}

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
        {error != null && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Add an item…"
            value={inputText}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.addButton, inputText.trim() === '' && styles.addButtonDisabled]}
            onPress={handleSubmit}
            disabled={inputText.trim() === ''}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sectionButton} onPress={handleAddSectionPress}>
            <Text style={styles.sectionButtonText}>+ Section</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ShareListModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        listId={listId}
        listOwnerId={ownerId}
        currentUserId={CURRENT_USER_ID}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  empty: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#888',
    marginTop: 80,
  },
  sectionInputContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  sectionInput: {
    fontSize: 15,
    color: '#000',
    paddingVertical: 4,
  },
  inputContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: '#000',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  sectionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionButtonText: {
    color: '#007AFF',
    fontSize: 15,
  },
  errorText: {
    color: '#cc0000',
    fontSize: 13,
    marginBottom: 4,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  headerButtonText: {
    fontSize: 20,
    color: '#007AFF',
    letterSpacing: 2,
  },
});
