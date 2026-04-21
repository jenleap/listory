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
};

export default function ItemRow({ item, onEdit }: Props) {
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

  if (isEditing) {
    return (
      <View style={styles.row}>
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
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.row} onPress={handlePress}>
      <Text style={[styles.rowText, item.completed && styles.completedText]}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
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
});
