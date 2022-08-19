import { useContext } from 'react';
import {
  Navigate, Route, Routes, BrowserRouter,
} from 'react-router-dom';
import LoginScreen from '../../screens/Login/LoginScreen';
import LoginScreenAdmin from '../../screens/LoginAdmin/LoginScreenAdmin';
import MessagesScreen from '../../screens/Messages/MessagesScreen';
import SingUpScreen from '../../screens/SingUp/SingUpScreen';

import '../../App.css';
import { Context } from '../../context/loginContext';
import UsersScreen from '../../screens/Users/UsersScreen';

function RoutesFn() {
  const { token, isAdmin } = useContext(Context);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/home" element={!token ? <Navigate to="/" replace /> : <MessagesScreen />} />
          <Route exact path="/" element={token ? <Navigate to="/home" replace /> : <LoginScreen />} />
          <Route
            exact
            path="/admin/login"
            element={token && isAdmin ? <UsersScreen /> : <LoginScreenAdmin />}
          />

          <Route
            exact
            path="/admin"
            element={token && isAdmin ? <UsersScreen /> : <Navigate to="/admin/login" replace />}
          />

          <Route exact path="/signup" element={<SingUpScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default RoutesFn;
