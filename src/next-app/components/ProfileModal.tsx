import React, { useState } from 'react';
import styles from '../styles/components/ProfileModal.module.css';
import Button from './Button';

type ProfileModalProps = {
  headerName: string;
  modalBody: JSX.Element[];
};

const ProfileModal = (props: ProfileModalProps) => {
  const [headerName, setHeaderName] = useState('');
  const [modalBody, setModalBody] = useState([] as JSX.Element[]);

  const goToProfile = () => {
    window.location.href = '#';
  };

  return (
    <div className={styles.container}>
      <h2>{props.headerName}</h2>
      {props.modalBody}
      <div className={styles['profile-btn']}>
        <Button title="Profile" width="80%" onClick={goToProfile} />
      </div>
    </div>
  );
};

export default ProfileModal;
