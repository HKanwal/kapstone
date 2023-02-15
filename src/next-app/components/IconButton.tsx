import styles from '../styles/components/IconButton.module.css';
import { CSSProperties, useEffect, useState } from 'react';
import { IconType } from 'react-icons';

type IconButtonProps = {
  icon: IconType;
  iconStyle?: CSSProperties;
  onClick?: () => void;
  style?: CSSProperties;
};

const calcSize = (winHeight: number, winWidth: number) => {
  return Math.floor(Math.min(winHeight, winWidth) / 12);
};

const IconButton = (props: IconButtonProps) => {
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
    <button className={styles.container} disabled={!props.onClick} style={props.style}>
      <props.icon className={styles.icon} size={size} onClick={props.onClick} style={props.iconStyle} />
    </button>
  );
};

export default IconButton;
