import type { NextPage } from 'next';
import { useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import styles from '../styles/pages/CreateEmployee.module.css';

interface carModels {
  [make: string]: string[];
}

const EmployeeEditPage: NextPage = () => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [vacation, setVacation] = useState('');
  const [sickDays, setSickDays] = useState('');
  const [dateJoined, setDateJoined] = useState('');

  let valid = false;
  if (
    fullName.length > 0 &&
    address.length > 0 &&
    salary.length > 0 &&
    vacation.length > 0 &&
    sickDays.length > 0 &&
    dateJoined.length > 0
  ) {
    valid = true;
  }

  return (
    <div className={styles.container}>
      <Header title="Edit Employee" />

      <div className={styles.content}>
        <div className={styles.section}>
          <span className={styles['section-header']}>Employee Details</span>
          <div className={styles['field-container']}>
            <TextField name="Name" placeholder={fullName} onChange={setFullName} />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Address" placeholder={address} onChange={setAddress} />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Salary" placeholder={salary} onChange={setSalary} />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Vacation" placeholder={vacation} onChange={setVacation} />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Sick Days" placeholder={sickDays} onChange={setSickDays} />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Date Joined" placeholder={dateJoined} onChange={setDateJoined} />
          </div>
        </div>
        <Button
          title="Update"
          disabled={!valid}
          width="80%"
          onClick={() => {
            console.log(
              'TODO: handle submit by verifying form, sending API request, and redirecting to employee details'
            );
          }}
        />
      </div>
    </div>
  );
};

export default EmployeeEditPage;
