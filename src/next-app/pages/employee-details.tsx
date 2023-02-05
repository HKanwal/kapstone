/* eslint-disable indent */
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/EmployeeDetails.module.css';
import FieldLabel from '../components/FieldLabel';
import TextInput from '../components/TextInput';
import { useRouter } from 'next/router';
import apiUrl from '../constants/api-url';
import axios from 'axios';
import employeeData from '../data/employeeData.json';

type info = {
  [key: string]: any;
};

const EmployeeDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [employee, setEmployee] = useState<info>({
    id: '',
    user: {
      id: '',
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
    },
  });

  useEffect(() => {
    if (!id) return;
    const getEmployee = async () => {
      try {
        //const res = await axios.get(`${apiUrl}/accounts/employee/${id}`);
        employeeData.employeeData.map((employee) => {
          if (employee.id === Number(id)) {
            setEmployee(employee);
          }
        });
      } catch (e) {
        console.log(e);
      }
    };
    getEmployee();
  }, [id]);

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
              router.push({ pathname: 'employee-edit', query: { id } });
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
            <TextInput
              value={employee.user.first_name + ' ' + employee.user.last_name}
              disabled
              onChange={noChange}
            />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Phone Number" />
            <TextInput value={employee.user.phone_number} disabled onChange={noChange} />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Email" />
            <TextInput value={employee.user.email} disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Salary" />
            <TextInput value={employee.salary} disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Vacations Taken" />
            <TextInput value={''} disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Date Joined" />
            <TextInput value={''} disabled onChange={noChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
