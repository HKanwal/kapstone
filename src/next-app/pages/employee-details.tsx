/* eslint-disable indent */
import type { NextPage } from 'next';
import { useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/EmployeeDetails.module.css';
import FieldLabel from '../components/FieldLabel';
import TextInput from '../components/TextInput';
import { useRouter } from 'next/router';

const EmployeeDetailsPage: NextPage = () => {
  const router = useRouter();
  function noChange(): void {
    throw new Error('Function not implemented.');
  }
  return (
    <div className={styles.container}>
      <Header
        title="Employee"
        burgerMenu={[
          {
            option: 'Edit',
            onClick() {
              router.push({ pathname: 'employee-edit', query: { id: 1 } });
            },
          },
          {
            option: 'Delete',
            onClick() {
              alert('Delete Employee!');
            },
          },
        ]}
      />
      <div className={styles.content}>
        <div className={styles.section}>
          <span className={styles['section-header']}>Employee Details</span>
          <div className={styles['field-container']}>
            <FieldLabel label="Name" />
            <TextInput value="" disabled onChange={noChange} />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Phone Number" />
            <TextInput value="" disabled onChange={noChange} />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Email" />
            <TextInput value="" disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Salary" />
            <TextInput value="" disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Vacations Taken" />
            <TextInput value="" disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Salary" />
            <TextInput value="" disabled onChange={noChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
