import { ButtonHTMLAttributes } from 'react';
import styles from '../styles/components/Button.module.css';

type ButtonProps = {
  title: string;
  width?: string | number;
  margin?: string;
  backgroundColor?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  id?: string;
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
      style={{ width: props.width, margin: props.margin, backgroundColor: props.backgroundColor }}
      onClick={handleClick}
      disabled={props.disabled}
      id={props.id}
    >
      {props.title}
    </button>
  );
};

export default Button;
