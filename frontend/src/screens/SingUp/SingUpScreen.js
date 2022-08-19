import React from 'react';
import Form from '../../components/Form/Form';
import './style.css';

export default function SingUpScreen() {
  return (
    <div className="container">
      <Form
        screenName="Registre-se"
        buttonName="Sing-up"
        bottomMessage={['Já possui conta?', 'Login', '/']}
        formType="signup"
      />
    </div>
  );
}
