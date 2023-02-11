import type { NextPage } from 'next';
import Button from '../components/Button';
import EmailsField from '../components/EmailsField';
import Header from '../components/Header';
import styles from '../styles/pages/Invite.module.css';
import { useRouter } from 'next/router';

const InvitePage: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Header title="Invite Employees" />

      <div className={styles.content}>
        <div className={styles['field-container']}>
          <EmailsField name="Emails" placeholder="Enter your employees' emails" />
        </div>
        <Button title="Invite" width="80%" />
        <span className={styles.or}>OR</span>
        <Button title="Skip" width="80%" onClick={() => router.push('/dashboard')} />
      </div>
    </div>
  );
};

export default InvitePage;
