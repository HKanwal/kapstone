import React, { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import styles from '../styles/pages/Dashboard.module.css';
import { AuthContext, accountTypes } from '../utils/api';
import apiUrl from '../constants/api-url';
import Cookies from 'js-cookie';

const Dashboard: NextPage = (props: any) => {
  const [authData, setAuthData] = useState(useContext(AuthContext));

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

  return (
    <div id={styles.wrapper}>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Sayyara automotive matcher (working title)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar authData={authData} setAuthData={setAuthData} onLogin={props.onLogin} />
      <div className={styles.container}>
        <h2>Today&apos;s Appointments</h2>
      </div>
    </div>
  );
};

export default Dashboard;
