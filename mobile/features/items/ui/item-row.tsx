import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Item } from '../types';

type Props = {
  item: Item;
  onEdit: (id: string, newText: string) => boolean;
  onDelete: (id: string) => boolean;
  onToggle: (id: string) => boolean;
};

export default function ItemRow({ item, onEdit, onDelete, onToggle }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const inputRef = useRef<TextInput>(null);

  function handlePress() {
    setEditText(item.text);
    setIsEditing(true);
  }

  function handleBlur() {
    onEdit(item.id, editText);
    setIsEditing(false);
    setEditText(item.text);
  }

  function handleSubmitEditing() {
    inputRef.current?.blur();
  }

  function handleDelete() {
    onDelete(item.id);
    setIsEditing(false);
  }

  function handleToggle() {
    onToggle(item.id);
  }

  const checkbox = (
    <TouchableOpacity style={styles.checkbox} onPress={handleToggle}>
      <View style={[styles.checkboxBox, item.completed && styles.checkboxBoxChecked]}>
        {item.completed && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );

  if (isEditing) {
    return (
      <View style={styles.row}>
        {checkbox}
        <View style={styles.textArea}>
          <TextInput
            ref={inputRef}
            style={[styles.input, item.completed && styles.completedText]}
            value={editText}
            onChangeText={setEditText}
            autoFocus
            onBlur={handleBlur}
            onSubmitEditing={handleSubmitEditing}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {checkbox}
      <TouchableOpacity style={styles.textArea} onPress={handlePress}>
        <Text style={[styles.rowText, item.completed && styles.completedText]}>
          {item.text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  checkbox: {
    justifyContent: 'center',
    paddingRight: 12,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  textArea: {
    flex: 1,
  },
  rowText: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteButton: {
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#cc0000',
    fontSize: 14,
  },
});
