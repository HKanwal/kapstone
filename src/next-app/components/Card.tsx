import { useEffect } from 'react';
import styles from '../styles/components/Card.module.css';

type CardProps = {
  name: string;
  status?: string;
  price?: string;
  date?: string;
};

const Card = (props: CardProps) => {
  useEffect(() => {}, []);

  return (
    <div className={styles.card}>
      <div className={styles['card-title']}>{props.name}</div>
      <div className={styles['right-content']}>
        {props.status ? (
          <div className={styles['card-content']}>Status: {props.status}</div>
        ) : (
          <></>
        )}
        {props.date ? <div className={styles['card-content']}>Date: {props.date}</div> : <></>}
      </div>
      <div className={styles['left-content']}>
        {props.price ? (
          <div className={styles['card-content']}>Price: {props.price}</div>
        ) : (
          <div className={styles['blank-space']}> </div>
        )}
      </div>
    </div>
  );
};

export default Card;
