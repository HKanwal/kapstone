import type { NextPage } from 'next';
import styles from '../styles/pages/BookAppointment.module.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'; // TODO: Change icons to left and right carets
import { GrFormClose } from 'react-icons/gr';
import { AiOutlineCheck } from 'react-icons/ai';
import IconButton from '../components/IconButton';
import DatePicker from '../components/DatePicker';
import { useState, MouseEvent } from 'react';

function createEmptyArray(n: number): undefined[] {
  let a = [];
  for (let i = 0; i < n; i++) {
    a.push(undefined);
  }
  return a;
}

type Slot = {
  startTime: number;
  endTime: number;
  available: boolean;
};

// TODO: fetch this data from backend
const availability: Slot[] = [
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

function findBookableSlots(appointmentLength: number): Slot[] {
  let slots: Slot[] = [];
  let availableCounter = 0; // # of available slots in a row

  for (let i = 0; i < availability.length; i++) {
    if (availability[i].available) {
      availableCounter++;
      if (availableCounter >= appointmentLength) {
        slots.push(availability[i]);
      }
      if (availableCounter === appointmentLength) {
        // TODO: backfill slots
        for (let j = 1; j < appointmentLength; j++) {
          slots.push(availability[i - j]);
        }
      }
    } else {
      availableCounter = 0;
    }
  }

  return slots.sort((a, b) => {
    if (a.startTime === b.startTime) {
      return 0;
    } else if (a.startTime > b.startTime) {
      return 1;
    } else {
      return -1;
    }
  });
}

// number of timeslots for appointment
// TODO: make this a prop or route param
const appointmentLength = 3;
const bookableSlots = findBookableSlots(appointmentLength);

function isBookable(startTime: number): boolean {
  return bookableSlots.find((slot) =>
    (slot.startTime === startTime)
  ) !== undefined;
}

function countBookableSlotsFrom(startTime: number): number {
  let count = 0;

  while (isBookable(startTime)) {
    count++;
    startTime += 0.25;
  }

  return count;
}

const Booking = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const handleCloseClick = (e: MouseEvent<SVGElement>) => {
    e.stopPropagation();
    onClose();
  }

  return (
    <div className={styles.booking} style={{ height: 'calc(' + appointmentLength + '*4vh)', visibility: visible ? 'visible' : 'hidden' }}>
      <div className={styles['booking-inner-container']}>
        <div className={styles['booking-close-container']}>
          <GrFormClose onClick={handleCloseClick} />
        </div>
        <span>Selected Booking</span>
      </div>
    </div>
  )
}

type SubSlotProps = {
  startTime: number;
  booking: number | null;
  onBookableClick: (startTime: number) => void;
  onBookingClose: () => void;
};

const SubSlot = ({ startTime, onBookableClick, booking, onBookingClose }: SubSlotProps) => {
  const handleClick = () => {
    if (isBookable(startTime)) {
      onBookableClick(startTime);
    }
  }

  return (
    <div className={styles['sub-slot'] + (isBookable(startTime) ? ' ' + styles.bookable : '')} onClick={handleClick}>
      <Booking onClose={onBookingClose} visible={booking === startTime} />
    </div>
  );
}

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

  // the start time of the selected booking
  const [booking, setBooking] = useState<null | number>(null);

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

  const handleBookableClick = (startTime: number) => {
    if (countBookableSlotsFrom(startTime) >= appointmentLength) {
      setBooking(startTime);
    } else {
      setBooking(startTime - 0.25 * (appointmentLength - countBookableSlotsFrom(startTime)));
    }
  };

  const clearBooking = () => {
    setBooking(null);
  }

  const handleConfirmClick = () => {
    // TODO: determine whether user has quote or not and redirect to appropriate screen accordingly
    // what uniquely identifies a quote? is there a quote id?
  };

  return (
    <div className={styles.container}>
      <Header title="Book Appointment" rightIcon={booking === null ? undefined : AiOutlineCheck} rightIconStyle={{ fill: 'var(--primary-color)' }} onRightIconClick={handleConfirmClick} />

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
                <SubSlot startTime={Math.ceil(startTime) + i} onBookableClick={handleBookableClick} booking={booking} onBookingClose={clearBooking} />
                <SubSlot startTime={Math.ceil(startTime) + i + 0.25} onBookableClick={handleBookableClick} booking={booking} onBookingClose={clearBooking} />
                <SubSlot startTime={Math.ceil(startTime) + i + 0.5} onBookableClick={handleBookableClick} booking={booking} onBookingClose={clearBooking} />
                <SubSlot startTime={Math.ceil(startTime) + i + 0.75} onBookableClick={handleBookableClick} booking={booking} onBookingClose={clearBooking} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
