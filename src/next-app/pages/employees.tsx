import type { NextPage } from 'next';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/Employees.module.css';
import EmployeeCard from '../components/EmployeeCard';
import { useRouter } from 'next/router';
import apiUrl from '../constants/api-url';
import { IoIosAdd } from 'react-icons/io';
import FieldLabel from '../components/FieldLabel';
import TextField from '../components/TextField';
import axios from 'axios';

const EmployeesPage: NextPage = () => {
  type filter = {
    [key: string]: any;
  };
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeFilter, setEmployeeFilter] = useState<filter>({
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const getAllEmployees = async () => {
      try {
        const res = await axios.get(`${apiUrl}/accounts/shop-owner/`);
        setEmployees(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getAllEmployees();
  }, []);

  const handleAddClick = () => {
    router.push('/invite');
  };

  const handleFilterChange = (field: string) => {
    return (newValue: string) => {
      setEmployeeFilter((prev) => {
        return {
          ...prev,
          [field]: newValue,
        };
      });
    };
  };

  return (
    <div className={styles.container}>
      <Header title="Employees" rightIcon={IoIosAdd} onRightIconClick={handleAddClick} />
      <div className={styles['field-container']}>
        <div className={styles['filter-container']}>
          <FieldLabel label="Filter By" />
          <TextField name="" placeholder="Name" onChange={handleFilterChange('name')} />
          <TextField name="" placeholder="Phone Number" onChange={handleFilterChange('phone')} />
          <TextField name="" placeholder="Email" onChange={handleFilterChange('email')} />
        </div>
        <div className={styles['card-container']}>
          {employees
            .filter((employee) => {
              for (let field in employeeFilter) {
                if (employeeFilter[field] != '' && employee.user != employeeFilter[field])
                  return false;
              }
              return true;
            })
            .map((employee) => {
              return (
                <EmployeeCard
                  key={employee.id}
                  id={Number(employee.id)}
                  name={employee.user}
                  phone={employee.user}
                  email={employee.user}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
