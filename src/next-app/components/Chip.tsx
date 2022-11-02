import styles from "../styles/components/Chip.module.css";
import { GrClose } from "react-icons/gr";

type ChipProps = {
  text: string;
  onMouseDown?: () => void;

  /** Only called if removeable = true */
  onRemove?: () => void;
};

const Chip = (props: ChipProps) => {
  const handleRemove = () => {
    props.onRemove && props.onRemove();
  };

  const handleMouseDown = () => {
    props.onMouseDown && props.onMouseDown();
  };

  return (
    <div className={styles.container} onClick={handleRemove} onMouseDown={handleMouseDown}>
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

