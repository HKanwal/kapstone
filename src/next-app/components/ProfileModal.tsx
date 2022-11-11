import styles from '../styles/components/ProfileModal.module.css';
import Button from './Button';

const ProfileModal = () => {
  const goToProfile = () => {
    window.location.href = '#';
  };

  return (
    <div className={styles.container}>
      <h2>Shop Name</h2>
      <p>Address Line 1</p>
      <p>Address Line 2</p>
      <p>Phone Number</p>
      <p>Email Address</p>
      <div className={styles['profile-btn']}>
        <Button title="Profile" width="80%" onClick={goToProfile} />
      </div>
    </div>
  );
};

export default ProfileModal;
