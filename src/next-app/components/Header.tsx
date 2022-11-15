import { useRouter } from 'next/router';
import styles from '../styles/components/Header.module.css';
import BackButton from './BackButton';

type HeaderProps = {
  title?: string;
};

const Header = (props: HeaderProps) => {
  const router = useRouter();

  return (
    <div className={styles.header}>
      <div className={styles['back-btn-container']}>
        <BackButton onClick={() => router.back()} />
      </div>
      {!!props.title ? (
        <span className={styles.title}>{props.title}</span>
      ) : (
        <span className={styles.title} style={{ visibility: 'hidden' }}>
          bad css
        </span>
      )}
    </div>
  );
};

export default Header;
