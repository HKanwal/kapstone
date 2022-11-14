import type { NextPage } from 'next';
import { Dispatch, SetStateAction, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import styles from '../styles/pages/CreateAccount.module.css';
import { useMutation } from 'react-query';
import { registrationFn } from '../utils/api';

type Field = {
  value: string;
  errors: string[];
};

function fieldIsValid(field: Field) {
  return field.value.length > 0 && field.errors.length === 0;
}

const CreateAccountPage: NextPage = () => {
  const [firstName, setFirstName] = useState<Field>({ value: '', errors: [] });
  const [lastName, setLastName] = useState<Field>({ value: '', errors: [] });
  const [phoneNumber, setPhoneNumber] = useState<Field>({ value: '', errors: [] });
  const [email, setEmail] = useState<Field>({ value: '', errors: [] });
  const [username, setUsername] = useState<Field>({ value: '', errors: [] });
  const [password, setPassword] = useState<Field>({ value: '', errors: [] });
  const fields = [firstName, lastName, phoneNumber, email, username, password];
  const valid = fields.every(fieldIsValid);

  const mutation = useMutation({
    mutationFn: registrationFn,
  });

  const handleSubmit = () => {
    mutation.mutate(
      {
        email: email.value,
        username: username.value,
        password: password.value,
        re_password: password.value,
        type: 'shop_owner',
        first_name: firstName.value || undefined,
        last_name: lastName.value || undefined,
      },
      {
        onSuccess(data, variables, context) {
          if (data.ok) {
            window.location.href = '/invite';
          } else {
            setEmail((prev) => {
              return { ...prev, errors: [] };
            });
            data.json().then((response) => {
              const setterMap = new Map<string, Dispatch<SetStateAction<Field>>>();
              setterMap.set('email', setEmail);
              setterMap.set('username', setUsername);
              setterMap.set('password', setPassword);
              for (let key of Object.keys(response)) {
                const setter = setterMap.get(key);
                setter &&
                  setter((prev) => {
                    return { ...prev, errors: response[key] };
                  });
              }
            });
          }
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <Header goBackToHref="/create-shop" title="Create New Account" />

      <div className={styles.content}>
        <div className={styles['field-container']}>
          <TextField
            name="First Name"
            placeholder="Enter your first name"
            onChange={(newVal) => {
              setFirstName({ value: newVal, errors: [] });
            }}
            errors={firstName.errors.length === 0 ? undefined : new Set(firstName.errors)}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Last Name"
            placeholder="Enter your last name"
            onChange={(newVal) => {
              setLastName({ value: newVal, errors: [] });
            }}
            errors={lastName.errors.length === 0 ? undefined : new Set(lastName.errors)}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Phone Number"
            placeholder="Enter your phone number"
            onChange={(newVal) => {
              setPhoneNumber({ value: newVal, errors: [] });
            }}
            errors={phoneNumber.errors.length === 0 ? undefined : new Set(phoneNumber.errors)}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Email"
            placeholder="Enter your email"
            onChange={(newVal) => {
              setEmail({ value: newVal, errors: [] });
            }}
            errors={email.errors.length === 0 ? undefined : new Set(email.errors)}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Username"
            placeholder="Enter your username"
            onChange={(newVal) => {
              setUsername({ value: newVal, errors: [] });
            }}
            errors={username.errors.length === 0 ? undefined : new Set(username.errors)}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Password"
            inputType="password"
            placeholder="Enter your password"
            onChange={(newVal) => {
              setPassword({ value: newVal, errors: [] });
            }}
            errors={password.errors.length === 0 ? undefined : new Set(password.errors)}
            required
          />
        </div>
        <div className={styles['submit-container']}>
          <Button title="Create" disabled={!valid} width="80%" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
