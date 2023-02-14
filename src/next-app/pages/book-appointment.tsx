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

// TODO: fetch this data from backend
const availability = [
  {
    startTime: 6.75,
    endTime: 7,
    available: false,
  },
  {
    startTime: 7,
    endTime: 7.25,
    available: false,
  },
  {
    startTime: 7.25,
    endTime: 7.5,
    available: true,
  },
  {
    startTime: 7.5,
    endTime: 7.75,
    available: true,
  },
  {
    startTime: 7.75,
    endTime: 8,
    available: true,
  },
  {
    startTime: 8,
    endTime: 8.25,
    available: false,
  },
  {
    startTime: 8.25,
    endTime: 8.5,
    available: true,
  },
  {
    startTime: 8.5,
    endTime: 8.75,
    available: false,
  },
  {
    startTime: 8.75,
    endTime: 9,
    available: true,
  },
  {
    startTime: 9,
    endTime: 9.25,
    available: true,
  },
  {
    startTime: 9.25,
    endTime: 9.5,
    available: false,
  },
];

const BookAppointmentPage: NextPage = () => {
  const router = useRouter();
  const [date, setDate] = useState(new Date());

  // all times are represented as a number between 0 and 24
  // start time can only be x.00 (xx:00), x.25 (xx:15), x.50 (xx:30), or x.75 (xx:45)
  const [startTime, setStartTime] = useState(availability[0].startTime);
  const [endTime, setEndTime] = useState(availability[availability.length - 1].endTime);

  // # of sub-slots before first xx:00 mark
  // minimum of 1 for aesthetic purposes
  const preSlots = (1 - startTime % 1) / 0.25 || 1;

  // number of timeslots for appointment
  // TODO: make this a prop or route param
  const appointmentLength = 2;

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
                <span className={styles.time}>{Math.ceil(startTime)}:00</span>
              </div>
            </div>
            <div className={styles.slot}>
              {createEmptyArray(preSlots).map((u, i) => (
                <div className={styles['sub-slot']} key={i}></div>
              ))}
            </div>
          </div>
          {createEmptyArray(Math.ceil(endTime) - Math.ceil(startTime)).map((u, i) => (
            <div className={styles['time-row']} key={i}>
              <div className={styles['time-container']}>
                <div className={styles['time-inner-container']}>
                  <span className={styles.time}>{Math.ceil(startTime) + i + 1}:00</span>
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
