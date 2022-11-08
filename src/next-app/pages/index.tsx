import type { NextPage } from 'next';
import Head from 'next/head';
import Button from '../components/Button';
import styles from '../styles/pages/Home.module.css';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sayyara</title>
        <meta name="description" content="Sayyara automotive matcher (working title)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <div className={styles['btns-container']}>
          <Button title="Continue as a Customer" />
          <span className={styles.or}>OR</span>
          <Button
            title="Login as a Shop Owner"
            onClick={() => {
              window.location.href = '/login';
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
