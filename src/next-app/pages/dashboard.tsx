import React, { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import styles from '../styles/pages/Dashboard.module.css';
import { AuthContext, Jwt, accountTypes, refreshToken } from '../utils/api';
import apiUrl from '../constants/api-url';
import Cookies from 'js-cookie';

type DashboardPageProps = {
  onLogin: (jwt: Jwt) => void;
}
const Dashboard: NextPage<DashboardPageProps, {}> = (props) => {
  const [authData, setAuthData] = useState(useContext(AuthContext));
  const [headerName, setHeaderName] = useState('');
  const [modalBody, setModalBody] = useState([] as JSX.Element[]);

  useEffect(() => {
    if (authData.access !== '') {
    } else if (Cookies.get('access') && Cookies.get('access') !== '') {
      setAuthData(
        {
          'access': Cookies.get('access') as string,
          'refresh': Cookies.get('refresh') as string,
          'user_type': Cookies.get('user_type') as accountTypes,
        }
      )
    }
  }, [])

  useEffect(() => {
    if (authData.user_type === 'shop_owner') {
      setHeaderName('Shop Name');
      setModalBody(
        [
          <p>Address Line 1</p>,
          <p>Address Line 2</p>,
          <p>Phone Number</p>,
          <p>Email Address</p>,
        ]
      )
    } else if (authData.user_type === 'employee') {
      setHeaderName('Shop Name');
      setModalBody(
        [
          <p>Address Line 1</p>,
          <p>Address Line 2</p>,
          <p>Phone Number</p>,
          <p>Email Address</p>,
        ]
      )
    } else {
      if (authData.access !== '') {
        fetch(`${apiUrl}/auth/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `JWT ${authData.access}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }).then((response) => response.json().then((response) => {
          if (response.type === 'client_error' && response.errors[0].code === 'token_not_valid') {
            // Function to refresh token
            refreshToken({ authData: authData, setAuthData: setAuthData, onLogin: props.onLogin });
          } else {
            setHeaderName(response.username);
          }
        }))
      } else {
        setHeaderName("Not Logged In");
      }
    }
  }, [authData])


  return (
    <div id={styles.wrapper}>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Sayyara automotive matcher (working title)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar authData={authData} onLogin={props.onLogin} headerName={headerName} modalBody={modalBody} />
      <div className={styles.container}>
        <h2>Today&apos;s Appointments</h2>
      </div>
    </div>
  );
};

export default Dashboard;
