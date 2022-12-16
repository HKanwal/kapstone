import { useRouter } from 'next/router';
import { IconType } from 'react-icons';
import styles from '../styles/components/Header.module.css';
import IconButton from './IconButton';
import { IoMdArrowBack } from 'react-icons/io';

type HeaderProps = {
  title?: string;
  rightIcon?: IconType;
  onRightIconClick?: () => void;
};

const Header = (props: HeaderProps) => {
  const router = useRouter();

  return (
    <div className={styles.header}>
      <div className={styles['back-btn-container']}>
        <IconButton icon={IoMdArrowBack} onClick={() => router.back()} />
      </div>
      {!!props.title ? (
        <span className={styles.title}>{props.title}</span>
      ) : (
        <span className={styles.title} style={{ visibility: 'hidden' }}>
          css hack
        </span>
      )}
      {!!props.rightIcon ? (
        <div className={styles['right-btn-container']}>
          <IconButton icon={props.rightIcon} onClick={props.onRightIconClick} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
