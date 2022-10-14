import styles from "../styles/Button.module.css";

type ButtonProps = {
  title: string;
  width?: string | number;
  onClick?: () => void;
};

const Button = (props: ButtonProps) => {
  return (
    <button
      className={styles.button}
      style={{ width: props.width }}
      onClick={() => props.onClick && props.onClick()}
    >
      {props.title}
    </button>
  );
};

export default Button;
