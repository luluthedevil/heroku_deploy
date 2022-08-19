import React from 'react';
import AdminForm from '../../components/AdminForm/AdminForm';
import './style.css';

export default function LoginScreenAdmin() {
  return (
    <div className="container">
      <AdminForm
        screenName="Login"
        buttonName="Login"
      />
    </div>
  );
}
