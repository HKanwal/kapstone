import React, { useState } from 'react';
import styles from '../styles/components/ProfileModal.module.css';
import ButtonLink from './ButtonLink';

type ProfileModalProps = {
  headerName: string;
  modalBody: JSX.Element[];
  profileURL: string;
  showProfileButton: boolean;
};

const ProfileModal = (props: ProfileModalProps) => {
  return (
    <div className={styles.container}>
      <h2>{props.headerName}</h2>
      {props.modalBody}
      {props.showProfileButton && (
        <div className={styles['profile-btn']}>
          <ButtonLink title="Profile" width="80%" href={props.profileURL} />
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
