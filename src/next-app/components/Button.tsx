import styles from "../styles/components/Button.module.css";

type ButtonProps = {
  title: string;
  width?: string | number;
  onClick?: () => void;
  disabled?: boolean;
};

const Button = (props: ButtonProps) => {
  const handleClick = () => {
    if (!props.disabled) {
      props.onClick && props.onClick();
    }
  };

  return (
    <button
      className={styles.button}
      style={{ width: props.width }}
      onClick={handleClick}
      disabled={props.disabled}
    >
      {props.title}
    </button>
  );
};

export default Button;
