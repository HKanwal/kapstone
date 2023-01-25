import styles from '../styles/components/EmployeeCard.module.css';
import { useRouter } from 'next/router';
import React from 'react';

type EmployeeProps = {
  id: number;
  name: string;
  //   phoneNumber: string;
  //   email: string;
};

const EmployeeCard = (props: EmployeeProps) => {
  const nameLabel = `Name: ${props.name}`;
  //const phoneNumberLabel = `Name: ${props.phoneNumber}`;
  //const emailLabel = `Name: ${props.email}`;
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
      <div className={styles['body-container']}>{nameLabel}</div>
      <div className={styles['body-container']}>{nameLabel}</div>
    </div>
  );
};

export default EmployeeCard;
