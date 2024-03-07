import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Button, TextInput, Card, Label } from 'flowbite-react';

const RegisterForm = () => {
  const [login, setLogin] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    authService.register(firstName, lastName, email, login, password).then(
      () => {
        navigate('/login');
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div className="w-full max-w-xs m-auto">
      <Card>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <Label htmlFor="login">Login</Label>
            <TextInput
              id="login"
              type="text"
              placeholder="Choose a login"
              required={true}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              type="password"
              placeholder="Create a password"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <TextInput
              id="firstName"
              type="text"
              placeholder="Your first name"
              required={true}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <TextInput
              id="lastName"
              type="text"
              placeholder="Your last name"
              required={true}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              type="email"
              placeholder="Your email address"
              required={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit">
            Register
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterForm;