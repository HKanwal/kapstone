import styles from '../styles/components/ProfileModal.module.css';
import ButtonLink from './ButtonLink';

const ProfileModal = () => {
  const goToProfile = () => {
    window.location.href = '/shop/profile';
  };

  return (
    <div className={styles.container}>
      <h2>Shop Name</h2>
      <p>Address Line 1</p>
      <p>Address Line 2</p>
      <p>Phone Number</p>
      <p>Email Address</p>
      <div className={styles['profile-btn']}>
        <ButtonLink title="Profile" width="80%" href="/shop/profile" />
      </div>
    </div>
  );
};

export default ProfileModal;
