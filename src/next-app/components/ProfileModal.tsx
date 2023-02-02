import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, Jwt, refreshToken } from '../utils/api';
import apiUrl from '../constants/api-url';
import styles from '../styles/components/ProfileModal.module.css';
import Button from './Button';

type ProfileModalProps = {
  authData: Jwt;
  setAuthData: (jwt: Jwt) => void;
  onLogin: (jwt: Jwt) => void;
};

const ProfileModal = (props: ProfileModalProps) => {
  const [headerName, setHeaderName] = useState('');
  const [modalBody, setModalBody] = useState([] as JSX.Element[]);

  useEffect(() => {
    if (props.authData.user_type === 'shop_owner') {
      setHeaderName('Shop Name');
      setModalBody(
        [
          <p>Address Line 1</p>,
          <p>Address Line 2</p>,
          <p>Phone Number</p>,
          <p>Email Address</p>,
        ]
      )
    } else if (props.authData.user_type === 'employee') {
      setHeaderName('Shop Name');
      setModalBody(
        [
          <p>Address Line 1</p>,
          <p>Address Line 2</p>,
          <p>Phone Number</p>,
          <p>Email Address</p>,
        ]
      )
    } else {
      if (props.authData.access !== '') {
        fetch(`${apiUrl}/auth/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `JWT ${props.authData.access}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }).then((response) => response.json().then((response) => {
          if (response.type === 'client_error' && response.errors[0].code === 'token_not_valid') {
            // Function to refresh token
            refreshToken({ authData: props.authData, setAuthData: props.setAuthData, onLogin: props.onLogin });
          } else {
            setHeaderName(response.username);
          }
        }))
      } else {
        setHeaderName("Not Logged In");
      }
    }
  }, [props.authData])

  const goToProfile = () => {
    window.location.href = '#';
  };

  return (
    <div className={styles.container}>
      <h2>{headerName}</h2>
      {modalBody}
      <div className={styles['profile-btn']}>
        <Button title="Profile" width="80%" onClick={goToProfile} />
      </div>
    </div>
  );
};

export default ProfileModal;
