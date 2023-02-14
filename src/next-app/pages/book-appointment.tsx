import type { NextPage } from 'next';
import styles from '../styles/pages/BookAppointment.module.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'; // TODO: Change icons to left and right carets
import IconButton from '../components/IconButton';
import DatePicker from '../components/DatePicker';
import { useMemo, useState } from 'react';

function createEmptyArray(n: number): undefined[] {
  let a = [];
  for (let i = 0; i < n; i++) {
    a.push(undefined);
  }
  return a;
}

const BookAppointmentPage: NextPage = () => {
  const router = useRouter();
  const [date, setDate] = useState(new Date());

  // all times are represented as a number between 0 and 24
  // start time can only be x.00 (xx:00), x.25 (xx:15), x.50 (xx:30), or x.75 (xx:45)
  const [startTime, setStartTime] = useState(6.5);
  const [endTime, setEndTime] = useState(11);

  // # of sub-slots before first xx:00 mark
  // minimum of 1 for aesthetic purposes
  const preSlots = (startTime % 1) / 0.25 || 1;

  const handleDateChange = (newDates: Date[]) => {
    setDate(newDates[0]);
  };

  const decrementDate = () => {
    setDate((prevDate) => {
      let newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const incrementDate = () => {
    setDate((prevDate) => {
      let newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  return (
    <div className={styles.container}>
      <Header title="Book Appointment" />

      <div className={styles.content}>
        <div className={styles['date-selection']}>
          <IconButton icon={BsChevronLeft} onClick={decrementDate} />
          <DatePicker value={[date]} onChange={handleDateChange} single />
          <IconButton icon={BsChevronRight} onClick={incrementDate} />
        </div>
        <div className={styles.calendar}>
          <div className={styles['time-row']}>
            <div className={styles['time-container']}>
              <div className={styles['time-inner-container']}>
                <span className={styles.time}>{Math.floor(startTime)}:00</span>
              </div>
            </div>
            <div className={styles.slot}>
              {createEmptyArray(preSlots).map((u, i) => (
                <div className={styles['sub-slot']} key={i}></div>
              ))}
            </div>
          </div>
          {createEmptyArray(Math.ceil(endTime) - Math.floor(startTime)).map((u, i) => (
            <div className={styles['time-row']} key={i}>
              <div className={styles['time-container']}>
                <div className={styles['time-inner-container']}>
                  <span className={styles.time}>{Math.floor(startTime) + i + 1}:00</span>
                </div>
              </div>
              <div className={styles.slot}>
                <div className={styles['sub-slot']}></div>
                <div className={styles['sub-slot']}></div>
                <div className={styles['sub-slot']}></div>
                <div className={styles['sub-slot']}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
