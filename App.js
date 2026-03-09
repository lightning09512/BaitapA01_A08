import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/screens/navigation/AppNavigator';
export default function App() {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}