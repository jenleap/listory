import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initSchema } from './db/schema/init';
import { RootStackParamList } from './navigation/types';
import MainScreen from './features/lists/ui/main-screen';
import ListScreen from './features/lists/ui/list-screen';
import { useSync } from './features/sync/hooks/use-sync';

initSchema();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { syncing } = useSync();

  return (
    <View style={styles.container}>
      {syncing && (
        <View style={styles.syncBanner}>
          <Text style={styles.syncText}>Syncing...</Text>
        </View>
      )}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={MainScreen} options={{ title: 'My Lists' }} />
          <Stack.Screen
            name="List"
            component={ListScreen}
            options={({ route }) => ({ title: route.params.listName })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  syncBanner: {
    backgroundColor: '#e8f4f8',
    paddingVertical: 4,
    alignItems: 'center',
  },
  syncText: {
    fontSize: 12,
    color: '#555',
  },
});
