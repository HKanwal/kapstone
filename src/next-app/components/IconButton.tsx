import styles from '../styles/components/IconButton.module.css';
import { CSSProperties } from 'react';
import { IconType } from 'react-icons';

type IconButtonProps = {
  icon: IconType;
  onClick?: () => void;
  style?: CSSProperties;
};

const IconButton = (props: IconButtonProps) => {
  return (
    <button
      className={styles.container}
      id="icon-button"
      disabled={!props.onClick}
      style={props.style}
    >
      <props.icon className={styles.icon} onClick={props.onClick} />
    </button>
  );
};

export default IconButton;
