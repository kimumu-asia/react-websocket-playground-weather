import { ChakraProvider } from '@chakra-ui/react';
import { DataIndicator } from './components/DataIndicator';
import { WebsocketProvider } from './context/WebSocketProvider';
import './App.css';

function App() {
  return (
    <WebsocketProvider>
      <ChakraProvider>
        <DataIndicator />
      </ChakraProvider>
    </WebsocketProvider>
  );
}

export default App;
