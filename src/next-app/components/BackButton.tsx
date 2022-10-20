import styles from "../styles/BackButton.module.css";
import { IoMdArrowBack } from "react-icons/io";

type BackButtonProps = {
  onClick?: () => void;
};

const BackButton = (props: BackButtonProps) => {
  return (
    <IoMdArrowBack className={styles.back} size="25" onClick={props.onClick} />
  );
};

export default BackButton;

