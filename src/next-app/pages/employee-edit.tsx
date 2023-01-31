import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import styles from '../styles/pages/CreateEmployee.module.css';
import apiUrl from '../constants/api-url';
import { useRouter } from 'next/router';
import axios from 'axios';
import { userAgent } from 'next/server';

type info = {
  [key: string]: any;
};

const EmployeeEditPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState<info>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [salary, setSalary] = useState('');
  const [vacation, setVacation] = useState('');
  const [sickDays, setSickDays] = useState('');
  const [dateJoined, setDateJoined] = useState('');

  useEffect(() => {
    const getEmployee = async () => {
      try {
        const res = await axios.get(`${apiUrl}/accounts/shop-owner/${id}`);
        setEmployee(res.data);
        setFirstName(String(res.data.user.first_name));
        setLastName(String(res.data.user.last_name));
        setPhoneNumber(String(res.data.user.phone_number) + ' ');
        setSalary(' ');
        setVacation(' ');
        setSickDays(' ');
        setDateJoined(' ');
      } catch (e) {
        console.log(e);
      }
    };
    getEmployee();
  }, []);

  let valid = false;
  if (
    firstName.length > 0 &&
    lastName.length > 0 &&
    phoneNumber.length > 0 &&
    salary.length > 0 &&
    vacation.length > 0 &&
    sickDays.length > 0 &&
    dateJoined.length > 0
  ) {
    valid = true;
  }

  const updateEmployee = async () => {
    // console.log(firstName + ' ' + lastName);
    // setEmployee((prevEmployee) => {
    //   return {
    //     ...prevEmployee,
    //     user: {
    //       ...prevEmployee.user,
    //       first_name: firstName,
    //       last_name: lastName,
    //       phone_number: phoneNumber,
    //     },
    //   };
    // });
    // console.log(employee);
    try {
      const res = await axios.put(`${apiUrl}/accounts/shop-owner/${id}`, {
        user: {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.container}>
      <Header title="Edit Employee" />

      <div className={styles.content}>
        <div className={styles.section}>
          <span className={styles['section-header']}>Employee Details</span>
          <div className={styles['field-container']}>
            <TextField
              name="Name"
              placeholder={firstName + ' ' + lastName}
              onChange={(input) => {
                input.length > 0
                  ? input.split(' ').length > 1
                    ? (setFirstName(input.split(' ')[0]), setLastName(input.split(' ')[1]))
                    : (setFirstName(String(input.split(' ')[0])), setLastName(' '))
                  : (setFirstName(String(employee.user.first_name)),
                    setLastName(String(employee.user.last_name)));
              }}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Phone Number"
              placeholder={phoneNumber}
              onChange={(input) => {
                input.length > 0 ? setPhoneNumber : setPhoneNumber(employee.user.phone_number);
              }}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Salary"
              placeholder={salary}
              onChange={(input) => {
                input.length > 0 ? setSalary : setSalary(' ');
              }}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Vacation"
              placeholder={vacation}
              onChange={(input) => {
                input.length > 0 ? setVacation : setVacation(' ');
              }}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Sick Days"
              placeholder={sickDays}
              onChange={(input) => {
                input.length > 0 ? setSickDays : setSickDays(' ');
              }}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Date Joined"
              placeholder={dateJoined}
              onChange={(input) => {
                input.length > 0 ? setDateJoined : setDateJoined(' ');
              }}
            />
          </div>
        </div>
        <Button
          title="Update"
          disabled={!valid}
          width="80%"
          onClick={() => {
            updateEmployee();
            router.push({
              pathname: 'employee-details',
              query: { id: id },
            });
          }}
        />
      </div>
    </div>
  );
};

export default EmployeeEditPage;
