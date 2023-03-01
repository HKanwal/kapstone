import type { NextPage } from 'next';
import Button from '../components/Button';
import DropdownField from '../components/DropdownField';
import TextField from '../components/TextField';
import Header from '../components/Header';
import styles from '../styles/pages/CreateAccount.module.css';
import { useMutation } from 'react-query';
import { RegistrationErrResponse, registrationFn, Jwt, accountTypes } from '../utils/api';
import { useRouter } from 'next/router';
import { useForm } from '../hooks/useForm';

type CreateAccountPageProps = {
  onLogin: (jwt: Jwt) => void;
};

const CreateAccountPage: NextPage<CreateAccountPageProps, {}> = (props) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: registrationFn,
  });
  const { type, invitation_key } = router.query;
  const employeeCreation = type === 'employee' && invitation_key !== undefined;
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      username: '',
      password: '',
      type: employeeCreation ? 'Employee' : '',
    },
    validationSchema: {
      firstName: ['required'],
      lastName: ['required'],
      phoneNumber: ['required'],
      email: ['required', 'email'],
      username: ['required'],
      password: ['required'],
      type: employeeCreation ? undefined : ['required'],
    },
    onSubmit: (values, setErrors) => {
      let accountType = 'customer' as accountTypes;
      if (employeeCreation) {
        accountType = 'employee';
      } else if (values.type === 'Shop Owner') {
        accountType = 'shop_owner';
      }
      mutation.mutate(
        {
          email: values.email,
          username: values.username,
          password: values.password,
          re_password: values.password,
          type: accountType,
          first_name: values.firstName || undefined,
          last_name: values.lastName || undefined,
          invite_key: invitation_key || undefined,
        },
        {
          onSuccess(data, variables, context) {
            if (data.ok) {
              data.json().then((response) => {
                console.log(response);
                props.onLogin({
                  access: response.tokens.access,
                  refresh: response.tokens.refresh,
                  user_type: response.type,
                });
              });
              if (accountType === 'shop_owner') {
                router.push('/create-shop');
              } else {
                router.push('dashboard');
              }
            } else {
              data.json().then((response: RegistrationErrResponse) => {
                let errors: { email: string[]; username: string[]; password: string[] } = {
                  email: [],
                  username: [],
                  password: [],
                };
                for (let error of response.errors) {
                  if (error.attr === 'email') {
                    errors.email.push(error.detail);
                  } else if (error.attr === 'username') {
                    errors.username.push(error.detail);
                  } else if (error.attr === 'password') {
                    errors.password.push(error.detail);
                  }
                }
                setErrors(errors);
              });
            }
          },
        }
      );
    },
  });
  console.log(form.values.type);
  return (
    <div className={styles.container}>
      <Header title="Create New Account" />

      <form className={styles.content} onSubmit={form.handleSubmit}>
        <div className={styles['field-container']}>
          <TextField
            name="First Name"
            placeholder="Enter your first name"
            onChange={form.handleChange('firstName')}
            errors={form.errors.firstName.length === 0 ? undefined : new Set(form.errors.firstName)}
            onBlur={form.handleBlur('firstName')}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Last Name"
            placeholder="Enter your last name"
            onChange={form.handleChange('lastName')}
            errors={form.errors.lastName.length === 0 ? undefined : new Set(form.errors.lastName)}
            onBlur={form.handleBlur('lastName')}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Phone Number"
            placeholder="Enter your phone number"
            onChange={form.handleChange('phoneNumber')}
            errors={
              form.errors.phoneNumber.length === 0 ? undefined : new Set(form.errors.phoneNumber)
            }
            onBlur={form.handleBlur('phoneNumber')}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Email"
            placeholder="Enter your email"
            onChange={form.handleChange('email')}
            errors={form.errors.email.length === 0 ? undefined : new Set(form.errors.email)}
            onBlur={form.handleBlur('email')}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Username"
            placeholder="Enter your username"
            onChange={form.handleChange('username')}
            errors={form.errors.username.length === 0 ? undefined : new Set(form.errors.username)}
            onBlur={form.handleBlur('username')}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Password"
            inputType="password"
            placeholder="Enter your password"
            onChange={form.handleChange('password')}
            errors={form.errors.password.length === 0 ? undefined : new Set(form.errors.password)}
            onBlur={form.handleBlur('password')}
            required
          />
        </div>
        {!employeeCreation && (
          <div className={styles['field-container']}>
            <DropdownField
              name="Type"
              placeholder="Select Account Type"
              items={['Customer', 'Shop Owner']}
              onSelect={form.handleChange('type')}
              required
            />
          </div>
        )}
        <div className={styles['submit-container']}>
          <Button type="submit" title="Create" disabled={!form.isValid} width="80%" />
        </div>
      </form>
    </div>
  );
};

export default CreateAccountPage;
