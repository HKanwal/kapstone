import { IconType } from 'react-icons';
import { BiTime } from 'react-icons/bi';
import { AiFillPhone } from 'react-icons/ai';
import styles from '../styles/components/ShopResult.module.css';
import IconButton from './IconButton';

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
  cannedDetails?: {
    cost: number;
    time: string;
  };
  onClickAppointment?: () => void;
  onClickCall?: () => void;
};

const ShopResult = (props: ShopResultProps) => {
  return (
    <div className={styles.container}>
      <div className={styles['labels-container']}>
        <span className={styles.name}>{props.name}</span>
        {props.cannedDetails ? (
          <span className={styles['canned-details']}>
            {props.cannedDetails.cost.toString() + ' - ' + props.cannedDetails.time}
          </span>
        ) : (
          <></>
        )}
        <span className={styles.distance}>{props.distance}</span>
      </div>
      <div className={styles['btns-container']}>
        <div style={{ visibility: props.cannedDetails ? 'visible' : 'hidden' }}>
          <CircularIconButton icon={BiTime} onClick={props.onClickAppointment} />
        </div>
        <CircularIconButton icon={AiFillPhone} onClick={props.onClickCall} />
      </div>
    </div>
  );
};

export default ShopResult;
