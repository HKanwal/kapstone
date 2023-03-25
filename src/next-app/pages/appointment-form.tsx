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
import TextArea from '../components/TextArea';

const CreateShopPage: NextPage = () => {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      year: '',
      make: '',
      model: '',
      odometer: '',
      email: '',
      phone: '',
      serviceType: 'TODO',
      partType: 'OEM',
      partCondition: 'No Preference',
      notes: '',
    },
    validationSchema: {
      year: ['required'],
      make: ['required'],
      model: ['required'],
      email: ['required', 'email'],
      phone: ['required'],
      serviceType: ['required'],
      partType: ['required'],
      partCondition: ['required'],
    },
    onSubmit: (values, setErrors) => {
      router.push('/book-appointment');
    },
  });

  return (
    <div className={styles.container}>
      <Header title="Appointment Form" />

      <form className={styles.content} onSubmit={form.handleSubmit}>
        <div className={styles.section}>
          <span className={styles['section-header']}>Car Details</span>
          <div className={styles['field-container']}>
            <TextField name="Year" placeholder="Enter year" onChange={form.handleChange('year')} required />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Make" placeholder="Enter make" onChange={form.handleChange('make')} required />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Model" placeholder="Enter model" onChange={form.handleChange('model')} required />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Odometer" placeholder="Enter odometer reading" onChange={form.handleChange('odometer')} />
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Contact Info</span>
          <div className={styles['field-container']}>
            <TextField name="Email" placeholder="Enter email" onChange={form.handleChange('email')} required />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Phone" placeholder="Enter phone number" onChange={form.handleChange('phone')} required />
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Service</span>
          <div className={styles['field-container']}>
            <DropdownField
              name="Service Type"
              items={['TODO', 'Fetch', 'Service', 'Types']}
              selectedItems={[form.values.serviceType]}
              onSelect={form.handleChange('serviceType')}
              required
            />
          </div>
          <div className={styles['field-container']}>
            <DropdownField
              name="Part Type"
              items={['No Preference', 'OEM', 'Aftermarket']}
              selectedItems={[form.values.partType]}
              onSelect={form.handleChange('partType')}
              required
            />
          </div>
          <div className={styles['field-container']}>
            <DropdownField
              name="Part Condition"
              items={['No Preference', 'New', 'Used']}
              selectedItems={[form.values.partCondition]}
              onSelect={form.handleChange('partCondition')}
              required
            />
          </div>
          <div className={styles['field-container']}>
            <TextArea name="Notes" placeholder="Describe the issue (optional)" onChange={form.handleChange('notes')} />
          </div>
        </div>
        <Button type="submit" title="Create" disabled={!form.isValid} width="80%" />
      </form>
    </div>
  );
};

export default CreateShopPage;
