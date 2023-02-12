import React, { useState } from 'react';
import styles from '../styles/components/ProfileModal.module.css';
import ButtonLink from './ButtonLink';

type ProfileModalProps = {
  headerName: string;
  modalBody: JSX.Element[];
};

const ProfileModal = (props: ProfileModalProps) => {
  const [headerName, setHeaderName] = useState('');
  const [modalBody, setModalBody] = useState([] as JSX.Element[]);

  const goToProfile = () => {
    window.location.href = '/shop/profile';
  };

  return (
    <div className={styles.container}>
      <h2>{props.headerName}</h2>
      {props.modalBody}
      <div className={styles['profile-btn']}>
        <ButtonLink title="Profile" width="80%" href="/shop/profile" />
      </div>
    </div>
  );
};

export default ProfileModal;
