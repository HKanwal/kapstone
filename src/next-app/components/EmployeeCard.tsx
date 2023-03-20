import styles from '../styles/components/EmployeeCard.module.css';
import { useRouter } from 'next/router';
import React from 'react';

type EmployeeProps = {
  id: number;
  name: string;
  phone: string;
  email: string;
  shop_owner?: boolean;
};

const EmployeeCard = (props: EmployeeProps) => {
  const nameLabel = `Name: ${props.name}`;
  const phoneLabel = `Phone Number: ${props.phone}`;
  const emailLabel = `Email: ${props.email}`;
  const router = useRouter();

  return (
    <div
      key={props.id}
      className={props.shop_owner ? styles['shop-owner-card'] : styles.card}
      onClick={() => {
        props.shop_owner
          ? router.push({
              pathname: `employees/shop-owner/${props.id}`,
            })
          : router.push({
              pathname: `employees/${props.id}`,
            });
      }}
    >
      <div className={styles['body-container']}>
        {props.shop_owner ? `${nameLabel} [Shop Owner]` : `${nameLabel}`}
      </div>
      <div className={styles['body-container']}>{phoneLabel}</div>
      <div className={styles['body-container']}>{emailLabel}</div>
    </div>
  );
};

export default EmployeeCard;
