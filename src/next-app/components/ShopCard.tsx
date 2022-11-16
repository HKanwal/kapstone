import { useEffect } from 'react';
import styles from '../styles/components/ShopCard.module.css';

type ShopCardProps = {
  name: string
};

const ShopCard = (props: ShopCardProps) => {
  useEffect(() => {
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles['card-content']}>
        <label>
          {props.name}
        </label>
      </div>
    </div>
  )
};

export default ShopCard;
