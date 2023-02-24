import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from '../styles/components/Card.module.css';

type CardProps = {
  name: string;
  id: number;
  status?: string;
  price?: string;
  date?: string;
};

const Card = (props: CardProps) => {
  useEffect(() => {}, []);
  const router = useRouter();

  const handleClick = () => {
    if (props.status === 'Pending' || props.status === 'Accepted') {
      router.push({
        pathname: '/quote',
        query: { id: props.id },
      });
    }
  };

  let dateString = '';
  if (props.date) {
    const date = new Date(props.date);
    dateString = date.toDateString();
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles['card-title']}>{props.name}</div>
      <div className={styles['right-content']}>
        {props.status ? (
          <div className={styles['card-content']}>Status: {props.status}</div>
        ) : (
          <></>
        )}
        {props.date ? <div className={styles['card-content']}>Date: {dateString}</div> : <></>}
      </div>
      <div className={styles['left-content']}>
        {props.price ? (
          <div className={styles['card-content']}>Price: ${props.price}</div>
        ) : (
          <div className={styles['blank-space']}> </div>
        )}
      </div>
    </div>
  );
};

export default Card;
