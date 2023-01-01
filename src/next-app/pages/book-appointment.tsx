import type { NextPage } from 'next';
import styles from '../styles/pages/BookAppointment.module.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'; // TODO: Change icons to left and right carets
import IconButton from '../components/IconButton';
import DatePicker from '../components/DatePicker';
import { useState } from 'react';

const BookAppointmentPage: NextPage = () => {
  const router = useRouter();
  const [date, setDate] = useState(new Date());

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
        <div className={styles.a}>
          <IconButton icon={BsChevronLeft} onClick={decrementDate} />
          <DatePicker value={[date]} onChange={handleDateChange} single />
          <IconButton icon={BsChevronRight} onClick={incrementDate} />
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
