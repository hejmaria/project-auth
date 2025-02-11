import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_URL } from 'utils/url';
import user from '../reducers/user';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signup');
  const [error, setError] = useState('');

  const accessToken = useSelector((store) => store.user.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  const onFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    };

    fetch(API_URL(mode), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUserId(data.response.userId));
            dispatch(user.actions.setUsername(data.response.username));
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setError(null));
          });
        } else {
          batch(() => {
            dispatch(user.actions.setUserId(null));
            dispatch(user.actions.setUsername(null));
            dispatch(user.actions.setAccessToken(null));
            dispatch(user.actions.setError(data.response));
          });
          setError('Sorry, invalid login or password.');
        }
      });
  };

  return (
    <>
      <label htmlFor="signup">Sign up</label>
      <InputRadio
        id="signup"
        type="radio"
        checked={mode === 'signup'}
        onChange={() => setMode('signup')}
      ></InputRadio>
      <label htmlFor="signin">Sign in</label>
      <InputRadio
        id="signin"
        type="radio"
        checked={mode === 'signin'}
        onChange={() => setMode('signin')}
      ></InputRadio>

      <Form onSubmit={onFormSubmit}>
        <label htmlFor="username">
          <h2>Username</h2>
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></Input>
        <label htmlFor="password">
          <h2>Password</h2>
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></Input>
        <Button type="submit">Login</Button>
        <Error> {error}</Error>
      </Form>
    </>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  background-color: #92dea0;
  padding: 5px;
  margin: 15px 0;
  border: none;
  border-bottom: 1px solid black;
  width: 280px;
  text-transform: uppercase;

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #000;
  }
`;

const InputRadio = styled.input`
  font-size: 1em;
  margin-right: 15px;
`;

const Button = styled.button`
  background-color: #92dea0;
  align-self: center;
  width: fit-content;
  margin: 10px;
  font-size: 1em;
  padding: 5px 10px;
  border: 1px solid black;
  border-radius: 6px;
  text-transform: uppercase;

  :hover {
    background-color: #1e9086;
  }

  /* Small laptop */
  @media (min-width: 992px) {
  }
`;
const Error = styled.p`
  font-size: 18px;
  text-align: center;
`;
