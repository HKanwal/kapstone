import { IconType } from 'react-icons';
import { BiTime } from 'react-icons/bi';
import { AiFillPhone } from 'react-icons/ai';
import { BsFillPencilFill } from 'react-icons/bs';
import styles from '../styles/components/BookedAppointment.module.css';
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

// Eg. 13.5 -> '13:30'
function numberToTime(numTime: number): string {
  return Math.floor(numTime) + ':' + ((numTime % 1) * 60 || '00');
}

type BookedAppointmentProps = {
  shopName: string;
  date: string;
  startTime: string;
  endTime: string;
  onClick?: () => void;
  onClickEdit?: () => void;
  style?: CSSProperties;
};

const BookedAppointment = (props: BookedAppointmentProps) => {
  return (
    <div className={styles.container} style={props.style}>
      <div className={styles['labels-container']}>
        <span className={styles.name}>{props.shopName}</span>
        {false ? <span className={styles['canned-details']}>nothin' to see here</span> : <></>}
        <span className={styles.distance}>{props.date}</span>
        <span className={styles.distance}>
          {props.startTime} - {props.endTime}
        </span>
      </div>
      <div className={styles['btns-container']}>
        <>
          <div style={{ visibility: false ? 'visible' : 'hidden' }}>
            <CircularIconButton icon={BiTime} />
          </div>
          <div style={{ visibility: 'hidden' /** TODO: implement edit functionality */ }}>
            <CircularIconButton icon={BsFillPencilFill} onClick={props.onClickEdit} />
          </div>
        </>
      </div>
    </div>
  );
};

export default BookedAppointment;
