import styles from "../styles/Button.module.css";

type ButtonProps = {
  title: string;
  width?: string | number;
};

const Button = (props: ButtonProps) => {
  return (
    <button className={styles.button} style={{ width: props.width }}>
      {props.title}
    </button>
  );
};

export default Button;
