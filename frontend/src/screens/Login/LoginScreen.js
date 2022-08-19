import React from 'react';
import Form from '../../components/Form/Form';
import './style.css';

export default function LoginScreen() {
  return (
    <div className="container">
      <Form
        screenName="Login"
        buttonName="Login"
        bottomMessage={['Não possui conta?', 'Sign-up', '/signup']}
        formType="login"
      />
    </div>
  );
}
