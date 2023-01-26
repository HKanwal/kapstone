import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import styles from '../styles/pages/CreateEmployee.module.css';
import apiUrl from '../constants/api-url';
import { useRouter } from 'next/router';

type info = {
  [key: string]: string;
};

const EmployeeEditPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [initialValues, setInitialValues] = useState<info>({
    fullName: '',
    address: '',
    salary: '',
    vacation: '',
    sickDays: '',
    dateJoined: '',
  });
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [vacation, setVacation] = useState('');
  const [sickDays, setSickDays] = useState('');
  const [dateJoined, setDateJoined] = useState('');

  useEffect(() => {
    fetch(`${apiUrl}/accounts/shop-owner/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInitialValues({
          fullName: String(data.user),
          address: String(data.user),
          salary: String(data.user),
          vacation: String(data.user),
          sickDays: String(data.user),
          dateJoined: String(data.user),
        });
      });
    setFullName(initialValues.fullName);
    setAddress(initialValues.address);
    setSalary(initialValues.salary);
    setVacation(initialValues.vacation);
    setSickDays(initialValues.sickDays);
    setDateJoined(initialValues.dateJoined);
  }, []);

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
            <TextField
              name="Name"
              placeholder={fullName}
              onChange={(input) => {
                input.length > 0 ? setFullName(input) : setFullName(initialValues.fullName);
              }}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Address"
              placeholder={address}
              onChange={(input) => {
                input.length > 0 ? setAddress : setAddress(initialValues.Address);
              }}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Salary"
              placeholder={salary}
              onChange={(input) => {
                input.length > 0 ? setSalary : setSalary(initialValues.salary);
              }}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Vacation"
              placeholder={vacation}
              onChange={(input) => {
                input.length > 0 ? setVacation : setVacation(initialValues.vacation);
              }}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Sick Days"
              placeholder={sickDays}
              onChange={(input) => {
                input.length > 0 ? setSickDays : setSickDays(initialValues.sickDays);
              }}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Date Joined"
              placeholder={dateJoined}
              onChange={(input) => {
                input.length > 0 ? setDateJoined : setDateJoined(initialValues.dateJoined);
              }}
            />
          </div>
        </div>
        <Button
          title="Update"
          disabled={!valid}
          width="80%"
          onClick={() => {
            console.log(fullName);
          }}
        />
      </div>
    </div>
  );
};

export default EmployeeEditPage;
