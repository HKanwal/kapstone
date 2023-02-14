import type { NextPage } from 'next';
import styles from '../styles/pages/BookAppointment.module.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'; // TODO: Change icons to left and right carets
import IconButton from '../components/IconButton';
import DatePicker from '../components/DatePicker';
import { useState } from 'react';

function timeToString(t: number): string {
  return (t - t % 1) + ':00';
}

const BookAppointmentPage: NextPage = () => {
  const router = useRouter();
  const [date, setDate] = useState(new Date());

  // all times are represented as a number between 0 and 24
  const [startTime, setStartTime] = useState(7);
  const [endTime, setEndTime] = useState(15);

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
            <span className={styles.time}>7:00</span>
            <div className={styles.slot}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
