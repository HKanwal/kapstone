import styles from "../styles/components/Chip.module.css";
import { GrClose } from "react-icons/gr";

type ChipProps = {
  text: string;

  /** Only called if removeable = true */
  onRemove?: () => void;
};

const Chip = (props: ChipProps) => {
  const handleRemove = () => {
    props.onRemove && props.onRemove();
  };

  return (
    <div className={styles.container} onClick={handleRemove}>
      {props.text}
      {
        (props.onRemove) ?
          <div className={styles['close-container']}>
            <GrClose />
          </div>
          : <></>
      }
    </div>
  );
};

export default Chip;

