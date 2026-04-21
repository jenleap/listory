import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initSchema } from './db/schema/init';
import { RootStackParamList } from './navigation/types';
import MainScreen from './features/lists/ui/main-screen';
import ListScreen from './features/lists/ui/list-screen';

initSchema();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
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
  );
}
