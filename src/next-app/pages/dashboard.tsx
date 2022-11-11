import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import styles from '../styles/pages/Dashboard.module.css';

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Sayyara automotive matcher (working title)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className={styles.container}>
        <h2>Today&apos;s Appointments</h2>
      </div>
    </>
  );
};

export default Dashboard;
