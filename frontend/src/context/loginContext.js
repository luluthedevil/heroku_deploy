import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const Context = createContext();

function LoginProvider({ children }) {
  const [token, setToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const memoizedValues = useMemo(() => ({
    token,
    setToken,
    userEmail,
    setUserEmail,
    isAdmin,
    setIsAdmin,
  }));

  return (
    <Context.Provider
      value={memoizedValues}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, LoginProvider };

LoginProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
