import { ReactElement, useEffect, useState } from "react";
import styles from "../styles/Modal.module.css";
import { GrClose } from "react-icons/gr";

type ModalProps = {
  children?: ReactElement<any, any> | ReactElement<any, any>[];
  visible?: boolean;
  onClose?: () => void;
};

const Modal = (props: ModalProps) => {
  const [visible, setVisible] = useState<boolean>(props.visible ?? false);

  useEffect(() => {
    setVisible(props.visible ?? false);
  }, [props.visible]);

  const handleClose = () => {
    setVisible(false);
    props.onClose && props.onClose();
  };

  if (!visible) {
    return <></>;
  }
  else {
    return (
      <div className={styles.backdrop}>
        <div className={styles.container}>
          <div className={styles.header}>
            <GrClose className={styles.close} onClick={handleClose} />
          </div>
          {props.children}
        </div>
      </div>
    );
  }
};

export default Modal;
