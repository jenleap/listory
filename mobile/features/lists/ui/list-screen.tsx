import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

export default function ListScreen(_props: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.empty}>No items yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    color: '#888',
    fontSize: 16,
  },
});
