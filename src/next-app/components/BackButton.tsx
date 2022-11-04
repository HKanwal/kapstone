import styles from '../styles/components/BackButton.module.css';
import { IoMdArrowBack } from 'react-icons/io';
import { useEffect, useState } from 'react';

type BackButtonProps = {
  onClick?: () => void;
};

const calcSize = (winHeight: number, winWidth: number) => {
  return Math.floor(Math.min(winHeight, winWidth) / 12);
};

const BackButton = (props: BackButtonProps) => {
  const [size, setSize] = useState<number>(0);

  // Responsive size based on screen size
  useEffect(() => {
    const handleResize = () => {
      setSize(calcSize(window.innerHeight, window.innerWidth));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <button className={styles.container} disabled={!props.onClick}>
      <IoMdArrowBack className={styles.back} size={size} onClick={props.onClick} />
    </button>
  );
};

export default BackButton;
