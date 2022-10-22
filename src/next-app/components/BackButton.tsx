import styles from "../styles/BackButton.module.css";
import { IoMdArrowBack } from "react-icons/io";

type BackButtonProps = {
  onClick?: () => void;
};

const BackButton = (props: BackButtonProps) => {
  return (
    <button className={styles.container}>
      <IoMdArrowBack
        className={styles.back}
        size="25"
        onClick={props.onClick}
      />
    </button>
  );
};

export default BackButton;
