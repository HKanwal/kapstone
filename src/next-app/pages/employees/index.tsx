import type { GetServerSideProps, NextPage } from 'next';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Header from '../../components/Header';
import styles from '../../styles/pages/Employees.module.css';
import EmployeeCard from '../../components/EmployeeCard';
import { useRouter } from 'next/router';
import apiUrl from '../../constants/api-url';
import { GrAddCircle } from 'react-icons/gr';
import FieldLabel from '../../components/FieldLabel';
import TextField from '../../components/TextField';
import axios from 'axios';
// @ts-ignore
import * as cookie from 'cookie';

const EmployeesPage: NextPage = ({ employees, shop }: any) => {
  type filter = {
    [key: string]: any;
  };
  const router = useRouter();

  const [employeeFilter, setEmployeeFilter] = useState<filter>({
    name: '',
    phone_number: '',
    email: '',
  });

  const handleAddClick = () => {
    router.push('/invite');
  };

  const handleFilterChange = (field: string) => {
    return (newValue: string) => {
      setEmployeeFilter((prev) => {
        return {
          ...prev,
          [field]: newValue.toLowerCase(),
        };
      });
    };
  };

  const employeesList = employees.filter((employee: any) => {
    if (employee.shop === shop.id) return true;
    else return false;
  });

  return (
    <div className={styles.container}>
      <Header title="Employees" rightIcon={GrAddCircle} onRightIconClick={handleAddClick} />
      <div className={styles['field-container']}>
        <div className={styles['filter-container']}>
          <FieldLabel label="Filter By" />
          <TextField name="" placeholder="Name" onChange={handleFilterChange('name')} />
          <TextField
            name=""
            placeholder="Phone Number"
            onChange={handleFilterChange('phone_number')}
          />
          <TextField name="" placeholder="Email" onChange={handleFilterChange('email')} />
        </div>
        <div className={styles['card-container']}>
          {employeesList
            .filter((employee: any) => {
              for (let field in employeeFilter) {
                if (
                  employeeFilter[field] != '' &&
                  (field === 'name'
                    ? !(
                        employee.user.first_name.toLowerCase().includes(employeeFilter[field]) ||
                        employee.user.last_name.toLowerCase().includes(employeeFilter[field])
                      )
                    : !employee.user[field].toLowerCase().includes(employeeFilter[field]))
                )
                  return false;
              }
              return true;
            })
            .sort((a: any, b: any) => {
              if (a.user.first_name < b.user.first_name) {
                return -1;
              }
              if (a.user.first_name > b.user.first_name) {
                return 1;
              }
              return 0;
            })
            .map((employee: any) => {
              return (
                <EmployeeCard
                  key={employee.id}
                  id={Number(employee.id)}
                  name={employee.user.first_name + ' ' + employee.user.last_name}
                  phone={employee.user.phone_number}
                  email={employee.user.email}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  try {
    const parsedCookies = cookie.parse(String(context.req.headers.cookie));
    const access_token = parsedCookies.access;
    const employees = await axios.get(`${apiUrl}/accounts/employee/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const shop = await axios.get(`${apiUrl}/shops/shops/me/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        employees: employees.data,
        shop: shop.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        employees: [],
      },
    };
  }
};

export default EmployeesPage;
