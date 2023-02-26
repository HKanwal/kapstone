import { CSSProperties, ReactElement, useEffect, useState } from 'react';
import styles from '../styles/components/Modal.module.css';
import headerStyles from '../styles/components/Header.module.css';
import { GrClose } from 'react-icons/gr';

type ModalProps = {
  children?: ReactElement<any, any> | ReactElement<any, any>[];
  visible?: boolean;
  title?: string;
  onClose?: () => void;

  /**
   * Applied to the modal container.
   */
  style?: CSSProperties;
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
  } else {
    return (
      <div className={styles.backdrop}>
        <div className={styles.container} style={props.style}>
          <div className={styles.header}>
            {props.title && (
              <div className={headerStyles.header}>
                <div className={headerStyles.title}>{props.title}</div>
              </div>
            )}
            <GrClose className={styles.close} onClick={handleClose} />
          </div>
          <div className={styles.content}>{props.children}</div>
        </div>
      </div>
    );
  }
};

export default Modal;
