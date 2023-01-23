import { ButtonHTMLAttributes } from 'react';
import styles from '../styles/components/Button.module.css';

type ButtonProps = {
  title: string;
  width?: string | number;
  onClick?: () => void;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

const Button = (props: ButtonProps) => {
  const handleClick = () => {
    if (!props.disabled) {
      props.onClick && props.onClick();
    }
  };

  return (
    <button
      type={props.type ?? 'button'}
      className={styles.button}
      style={{ width: props.width }}
      onClick={handleClick}
      disabled={props.disabled}>
      {props.title}
    </button>
  );
};

export default Button;
