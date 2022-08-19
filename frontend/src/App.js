import './App.css';
import { ToastContainer } from 'react-toastify';
import { LoginProvider } from './context/loginContext';

import RoutesFn from './components/Routes/Routes';

function App() {
  return (
    <LoginProvider>
      <RoutesFn />
      <ToastContainer />

    </LoginProvider>
  );
}

export default App;
