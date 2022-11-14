import type { NextPage } from 'next';
import { useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import Link from '../components/Link';
import Modal from '../components/Modal';
import styles from '../styles/pages/Login.module.css';
import { useMutation } from 'react-query';
import { Jwt, loginFn } from '../utils/api';
import { useRouter } from 'next/router';

type LoginPageProps = {
  onLogin: (jwt: Jwt) => void;
};

const LoginPage: NextPage<LoginPageProps, {}> = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisisble] = useState<boolean>(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: loginFn,
  });

  const showModal = () => {
    setModalVisisble(true);
  };

  const hideModal = () => {
    setModalVisisble(false);
  };

  const handleClickLogin = () => {
    mutation.mutate(
      { username, password },
      {
        onSuccess(data, variables, context) {
          if (data.ok) {
            data.json().then((response: Jwt) => {
              props.onLogin(response);
            });
            router.push('/dashboard');
          } else {
            setError('Invalid credentials.');
          }
        },
      }
    );
  };

  const handleClickRegister = () => {
    router.push('/create-account');
  };

  return (
    <div className={styles.container}>
      <Header goBackToHref="/" />

      <div className={styles.content}>
        {error.length > 0 ? <div className={styles['error-container']}>{error}</div> : <></>}
        <div className={styles['username-container']}>
          <TextField
            name="Username"
            placeholder="Enter your username"
            onChange={(username) => {
              setError('');
              setUsername(username);
            }}
          />
        </div>
        <div className={styles['password-container']}>
          <TextField
            name="Password"
            placeholder="Enter your password"
            inputType="password"
            onChange={(password) => {
              setError('');
              setPassword(password);
            }}
          />
        </div>
        <div className={styles['forgot-password-container']}>
          <Link text="Forgot Password?" onClick={showModal} />
        </div>
        <Button
          title="Login"
          width="80%"
          onClick={handleClickLogin}
          disabled={username.length < 1 || password.length < 1}
        />
        <span className={styles.or}>OR</span>
        <Button title="Register" width="80%" onClick={handleClickRegister} />

        <Modal visible={modalVisible} onClose={hideModal}>
          <div className={styles['modal-content']}>
            <div className={styles['modal-title-container']}>
              <span className={styles['modal-title']}>Reset Password</span>
            </div>
            <TextField name="Email" placeholder="Enter your email" />
            <div className={styles['modal-submit']}>
              <Button title="Continue" width="100%" />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;
