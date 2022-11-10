import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import styles from '../styles/pages/Dashboard.module.css';
import { Router } from 'next/router';

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sayyara</title>
        <meta name="description" content="Sayyara automotive matcher (working title)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {/* <div className={styles.container}>Today&apos;s Appointments</div> */}
    </>
  );
};

export default Dashboard;
