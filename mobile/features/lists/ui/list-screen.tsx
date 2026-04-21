import { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useItems } from '../../items/hooks/use-items';
import { Item } from '../../items/types';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export default function ListScreen({ route }: Props) {
  const { listId } = route.params;
  const { items, error, addItem } = useItems(listId);
  const [inputText, setInputText] = useState('');
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

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

  function renderItem({ item }: { item: Item }) {
    return (
      <View style={styles.row}>
        <Text style={[styles.rowText, item.completed && styles.completedText]}>
          {item.text}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={HEADER_HEIGHT + insets.top}
    >
      {items.length === 0 ? (
        <Text style={styles.empty}>No items yet.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
        />
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
        </View>
      </View>
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
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  rowText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
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
  errorText: {
    color: '#cc0000',
    fontSize: 13,
    marginBottom: 4,
  },
});
