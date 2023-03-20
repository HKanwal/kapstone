import { IconType } from 'react-icons';
import { BiTime } from 'react-icons/bi';
import { AiFillPhone } from 'react-icons/ai';
import styles from '../styles/components/ShopResult.module.css';
import IconButton from './IconButton';
import { CSSProperties, ChangeEvent } from 'react';
import { Checkbox } from '@mantine/core';

type CircularIconButtonProps = {
  icon: IconType;
  bgColor?: string;
  onClick?: () => void;
};

const CircularIconButton = (props: CircularIconButtonProps) => {
  const bgColor = props.bgColor ?? 'white';

  return (
    <div className={styles['circular-icon-btn-container']} style={{ backgroundColor: bgColor }}>
      <IconButton
        icon={props.icon}
        onClick={props.onClick}
        style={{ borderRadius: '50%', color: 'var(--primary-color)' }}
      />
    </div>
  );
};

type ShopResultProps = {
  name: string;
  distance: string;
  onClick?: () => void;
  /**
   * If canned details are provided, quick appointment button will be shown.
   */
  services?: [];
  onClickAppointment?: () => void;
  onClickCall?: () => void;
  style?: CSSProperties;
  /**
   * If true, will not show right side buttons, but will instead show checkbox.
   */
  inSelectMode?: boolean;
  /**
   * Only triggered if inSelectMode = true.
   */
  onSelect?: () => void;
  /**
   * Only triggered if inSelectMode = true.
   */
  onDeselect?: () => void;
};

const ShopResult = (props: ShopResultProps) => {
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      props.onSelect && props.onSelect();
    } else {
      props.onDeselect && props.onDeselect();
    }
  };

  return (
    <div className={styles.container} style={props.style}>
      <div className={styles['labels-container']}>
        <span className={styles.name}>{props.name}</span>
        {props.services ? (
          <span className={styles['canned-details']}>
            {/* {'$' + props.cannedDetails.cost.toString() + ' - ' + props.cannedDetails.time} */}
          </span>
        ) : (
          <></>
        )}
        <span className={styles.distance}>{props.distance}</span>
      </div>
      <div className={styles['btns-container']}>
        {!props.inSelectMode ? (
          <>
            <div style={{ visibility: props.services ? 'visible' : 'hidden' }}>
              <CircularIconButton icon={BiTime} onClick={props.onClickAppointment} />
            </div>
            <div style={{ visibility: props.onClickCall ? 'visible' : 'hidden' }}>
              <CircularIconButton icon={AiFillPhone} onClick={props.onClickCall} />
            </div>
          </>
        ) : (
          <div className={styles['checkbox-container']}>
            <Checkbox onChange={handleCheckboxChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopResult;
