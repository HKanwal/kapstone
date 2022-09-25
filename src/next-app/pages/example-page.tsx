import { NextPage } from 'next';
import styles from '../styles/ExamplePage.module.css';

const ExamplePage: NextPage = () => {
  return <span className={styles.title}>Hello World from the Example Page!</span>;
};

export default ExamplePage;
