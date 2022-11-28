import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import styles from '../styles/pages/Home.module.css';

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Sayyara</title>
        <meta name="description" content="Sayyara automotive matcher (working title)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <div className={styles['btns-container']}>
          <Button
            title="Continue as a Customer"
            onClick={() => {
              router.push('/dashboard');
            }}
          />
          <span className={styles.or}>OR</span>
          <Button
            title="Login as a Shop Owner"
            onClick={() => {
              router.push('/login');
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
