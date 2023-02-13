import type { NextPage } from 'next';
import { useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import TextMultiField from '../components/TextMultiField';
import Header from '../components/Header';
import styles from '../styles/pages/AppointmentForm.module.css';
import DropdownField from '../components/DropdownField';
import { useRouter } from 'next/router';
import { useForm } from '../hooks/useForm';

const CreateShopPage: NextPage = () => {
  const router = useRouter();
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
      <Header title="Appointment Form" />

      <form className={styles.content} onSubmit={form.handleSubmit}>
        <div className={styles.section}>
          <span className={styles['section-header']}>Car Details</span>
          <div className={styles['field-container']}>
            <TextField name="Year" placeholder="Enter year" required />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Make" placeholder="Enter make" required />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Model" placeholder="Enter model" required />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Odometer" placeholder="Enter odometer reading" />
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Contact Info</span>
          <div className={styles['field-container']}>
            <TextField name="Email" placeholder="Enter email" required />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Phone" placeholder="Enter phone number" required />
          </div>
        </div>
        <Button type="submit" title="Create" disabled={!form.isValid} width="80%" />
      </form>
    </div>
  );
};

export default CreateShopPage;
