import styles from '../styles/components/EmployeeCard.module.css';
import { useRouter } from 'next/router';
import React from 'react';

type EmployeeProps = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

const EmployeeCard = (props: EmployeeProps) => {
  const nameLabel = `Name: ${props.name}`;
  const phoneLabel = `Phone Number: ${props.phone}`;
  const emailLabel = `Email: ${props.email}`;
  const router = useRouter();
  const url = '/employee-details';

  return (
    <div
      key={props.id}
      className={styles.card}
      onClick={() => {
        router.push({
          pathname: 'employee-details',
          query: { id: props.id },
        });
      }}
    >
      <div className={styles['body-container']}>{nameLabel}</div>
      <div className={styles['body-container']}>{phoneLabel}</div>
      <div className={styles['body-container']}>{emailLabel}</div>
    </div>
  );
};

export default EmployeeCard;
