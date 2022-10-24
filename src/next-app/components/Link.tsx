import styles from "../styles/Link.module.css";

type LinkProps = {
  text: string;
  onClick: () => void;
};

const Link = (props: LinkProps) => {
  return (
    <span className={styles.link} onClick={props.onClick}>
      {props.text}
    </span>
  );
};

export default Link;
