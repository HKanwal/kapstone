import styles from "../styles/Chip.module.css";
import { GrClose } from "react-icons/gr";

type ChipProps = {
  text: string;
  removeable?: boolean;

  /** Only called if removeable = true */
  onRemove?: () => void;
};

const Chip = (props: ChipProps) => {
  const handleRemove = () => {
    props.onRemove && props.onRemove();
  };

  return (
    <div className={styles.container} onClick={handleRemove}>
      <span className={styles.text}>
        {props.text}
      </span>
      {
        (props.removeable) ?
          <GrClose />
          : <></>
      }
    </div>
  );
};

export default Chip;

