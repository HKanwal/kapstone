import React, { useState } from 'react';
import styles from '../styles/components/ProfileModal.module.css';
import { useRouter } from 'next/router';
import SmallButton from './SmallButton';

type ProfileModalProps = {
  headerName: string;
  modalBody: JSX.Element[];
  profileURL: string;
  showProfileButton: boolean;
};

const ProfileModal = (props: ProfileModalProps) => {
  const router = useRouter();

  const handleBtnClick = () => {
    router.push(props.profileURL);
  };

  return (
    <div className={styles.container}>
      <h2 style={{ marginTop: '1vh', marginBottom: '1vh' }}>{props.headerName}</h2>
      {props.modalBody}
      {props.showProfileButton && (
        <div className={styles['profile-btn']}>
          <SmallButton title="Profile" width="80%" onClick={handleBtnClick} />
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
