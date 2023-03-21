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
import { useForm } from '../hooks/useForm';

type LoginPageProps = {
  onLogin: (jwt: Jwt) => void;
};

const LoginPage: NextPage<LoginPageProps, {}> = (props) => {
  const router = useRouter();
  const [modalVisible, setModalVisisble] = useState<boolean>(false);
  const mutation = useMutation({
    mutationFn: loginFn,
  });
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: {
      username: ['required'],
      password: ['required'],
    },
    onSubmit: (values, setErrors) => {
      mutation.mutate(
        { username: values.username, password: values.password },
        {
          onSuccess(data, variables, context) {
            if (data.ok) {
              data.json().then((response: Jwt) => {
                props.onLogin(response);
              });
              if (router.query && router.query.from) {
                // @ts-ignore
                router.push(router.query.from);
              } else {
                router.push('/dashboard');
              }
            } else {
              setErrors({
                username: ['Invalid credentials.'],
              });
            }
          },
          onError() {
            setErrors({
              username: ['Unable to reach server.'],
            });
          },
        }
      );
    },
  });
  const firstError: string | undefined = [...form.errors.username, ...form.errors.password][0];

  const showModal = () => {
    setModalVisisble(true);
  };

  const hideModal = () => {
    setModalVisisble(false);
  };

  const handleClickRegister = () => {
    router.push('/create-account');
  };

  return (
    <div className={styles.container}>
      <Header />

      <form className={styles.content} onSubmit={form.handleSubmit}>
        {firstError ? <div className={styles['error-container']}>{firstError}</div> : <></>}
        <div className={styles['username-container']}>
          <TextField
            name="Username"
            placeholder="Enter your username"
            onChange={form.handleChange('username')}
          />
        </div>
        <div className={styles['password-container']}>
          <TextField
            name="Password"
            placeholder="Enter your password"
            inputType="password"
            onChange={form.handleChange('password')}
          />
        </div>
        <div className={styles['forgot-password-container']}>
          <Link text="Forgot Password?" onClick={showModal} />
        </div>
        <Button type="submit" title="Login" width="80%" />
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
      </form>
    </div>
  );
};

export default LoginPage;
