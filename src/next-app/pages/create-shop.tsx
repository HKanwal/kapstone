import type { NextPage } from 'next';
import { useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import TextMultiField from '../components/TextMultiField';
import Header from '../components/Header';
import styles from '../styles/pages/CreateShop.module.css';
import DropdownField from '../components/DropdownField';
import { useRouter } from 'next/router';
import { useForm } from '../hooks/useForm';

const CreateShopPage: NextPage = () => {
  const router = useRouter();
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const form = useForm({
    initialValues: {
      name: '',
      address: '',
      email: '',
      employees: '',
      serviceBays: '',
    },
    validationSchema: {
      name: ['required'],
      address: ['required'],
      email: ['email'],
    },
    onSubmit: (values, setErrors) => {
      router.push('/invite');
    },
  });

  return (
    <div className={styles.container}>
      <Header title="Create New Shop" />

      <form className={styles.content} onSubmit={form.handleSubmit}>
        <div className={styles['field-container']}>
          <TextField
            name="Shop Name"
            placeholder="Enter your shop's name"
            onChange={form.handleChange('name')}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Shop Address"
            placeholder="Enter your shop's address"
            onChange={form.handleChange('address')}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextMultiField
            name="Shop Phone Number(s)"
            placeholder="Enter your shop's phone number"
            onChange={setPhoneNumbers}
            multi="Add phone number"
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Shop Email"
            placeholder="Enter your shop's email"
            onChange={form.handleChange('email')}
            onBlur={form.handleBlur('email')}
            errors={form.errors.email.length > 0 ? new Set(form.errors.email) : undefined}
          />
        </div>
        <div className={styles['field-container']}>
          <DropdownField
            type="multi-select"
            name="Services Offered"
            placeholder="Enter services..."
            items={['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']}
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Number of Employees"
            placeholder="Enter number of employees"
            inputType="number"
            onChange={form.handleChange('employees')}
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Number of Service Bays"
            placeholder="Enter number of service bays"
            inputType="number"
            onChange={form.handleChange('serviceBays')}
          />
        </div>
        <div className={styles['submit-container']}>
          <Button type="submit" title="Create" disabled={!form.isValid} width="80%" />
        </div>
      </form>
    </div>
  );
};

export default CreateShopPage;
