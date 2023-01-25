import type { NextPage } from 'next';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/Employees.module.css';
import EmployeeCard from '../components/EmployeeCard';
import { useRouter } from 'next/router';
import apiUrl from '../constants/api-url';
import { IoIosAdd } from 'react-icons/io';
import FieldLabel from '../components/FieldLabel';
import SingleTextField from '../components/SingleTextField';
import TextField from '../components/TextField';

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
    fetch(`${apiUrl}/accounts/shop-owner/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => setEmployees(data));
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
          {employeeFilter.name != '' || employeeFilter.phone != null
            ? employees
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
                })
            : employees.map((employee) => {
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
