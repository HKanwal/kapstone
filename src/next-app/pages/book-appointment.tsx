import type { NextPage } from 'next';
import styles from '../styles/pages/BookAppointment.module.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'; // TODO: Change icons to left and right carets
import { GrFormClose } from 'react-icons/gr';
import { AiOutlineCheck } from 'react-icons/ai';
import IconButton from '../components/IconButton';
import DatePicker from '../components/DatePicker';
import { useState, MouseEvent, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  AppointmentSlot,
  AppointmentSlotsResponse,
  Weekday,
  bookAppointment,
  getAppointmentSlots,
  getShopDetails,
  getShopHours,
  getUserDetails,
} from '../utils/api';
import { Loader } from '@mantine/core';
import Modal from '../components/Modal';

function createEmptyArray(n: number): undefined[] {
  let a = [];
  for (let i = 0; i < n; i++) {
    a.push(undefined);
  }
  return a;
}

function getWeekday(date: Date): Weekday {
  return (
    ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as Weekday[]
  )[date.getDay()];
}

const Booking = ({
  visible,
  onClose,
  appointmentLength,
}: {
  visible: boolean;
  onClose: () => void;
  appointmentLength: number;
}) => {
  const handleCloseClick = (e: MouseEvent<SVGElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className={styles.booking}
      style={{
        height: 'calc(' + appointmentLength + '*4vh)',
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      <div className={styles['booking-inner-container']}>
        <div className={styles['booking-close-container']}>
          <GrFormClose onClick={handleCloseClick} />
        </div>
        <span>Selected Booking</span>
      </div>
    </div>
  );
};

type SubSlotProps = {
  startTime: number;
  booking: number | null;
  onBookableClick: (startTime: number) => void;
  onBookingClose: () => void;
  appointmentLength: number;
  isBookable: (startTime: number) => boolean;
};

const SubSlot = ({
  startTime,
  onBookableClick,
  booking,
  onBookingClose,
  appointmentLength,
  isBookable,
}: SubSlotProps) => {
  const handleClick = () => {
    if (isBookable(startTime)) {
      onBookableClick(startTime);
    }
  };

  return (
    <div
      className={styles['sub-slot'] + (isBookable(startTime) ? ' ' + styles.bookable : '')}
      onClick={handleClick}
    >
      <Booking
        onClose={onBookingClose}
        visible={booking === startTime}
        appointmentLength={appointmentLength}
      />
    </div>
  );
};

/** Eg: "05:30" -> 5.5 */
function timeToNumber(time: string): number {
  const split = time.split(':');
  const hour = parseInt(split[0]);
  if (split.length < 2 || split[1].length === 0) {
    return hour;
  }
  const minutes = parseInt(split[1]);
  return hour + minutes / 60;
}

/**
 * Compares start time of slot (as returned by API) to given time as number
 * for equality.
 */
function startTimeEquals(slot: AppointmentSlot, startTime: number): boolean {
  const startTimeAsDate = new Date(slot.start_time);
  const startHour = startTimeAsDate.getHours();
  const startMinutes = startTimeAsDate.getMinutes();
  return startTime === startHour + startMinutes / 60;
}

const BookAppointmentPage: NextPage = () => {
  const router = useRouter();
  const { appointmentLength, shopId, quoteId } = router.query;
  const parsedShopId =
    typeof shopId === 'object'
      ? parseInt(shopId[0])
      : typeof shopId === 'string'
      ? parseInt(shopId)
      : -1;
  const appointmentLengthNum =
    typeof appointmentLength === 'string'
      ? parseInt(appointmentLength)
      : appointmentLength === undefined
      ? 1
      : (parseInt(appointmentLength[0]) as number);
  const [date, setDate] = useState(new Date());
  const strDate = date.toISOString().split('T')[0];
  const [accessToken, setAccessToken] = useState<undefined | string>(undefined);
  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token') || '');
  }, []);
  const userQuery = useQuery('getUserDetails', getUserDetails(accessToken || ''), {
    refetchOnWindowFocus: false,
    enabled: !!accessToken,
  });
  const query = useQuery(
    'getAppointmentSlots',
    getAppointmentSlots({
      startDate: strDate,
      endDate: strDate,
      availableOnly: true,
      shop:
        typeof shopId === 'string'
          ? parseInt(shopId)
          : shopId === undefined
          ? -1
          : parseInt(shopId[0]),
      minutes: appointmentLengthNum * 15,
    }),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      enabled: !!userQuery.data?.id,
    }
  );
  const mutation = useMutation({
    mutationFn: bookAppointment,
  });
  const shopHoursQuery = useQuery('getShopHours', getShopHours(parsedShopId), {
    refetchOnWindowFocus: false,
    enabled: !!shopId,
  });

  // all times are represented as a number between 0 and 24
  // start time can only be x.00 (xx:00), x.25 (xx:15), x.50 (xx:30), or x.75 (xx:45)
  const [startTime, setStartTime] = useState(6);
  const [endTime, setEndTime] = useState(17);

  useEffect(() => {
    const currentWeekday = getWeekday(date);
    const hours = shopHoursQuery.data?.shophours_set.find((hours) => {
      return hours.day === currentWeekday;
    });
    if (hours !== undefined) {
      setStartTime(timeToNumber(hours.from_time.substring(0, hours.from_time.length - 3)));
      setEndTime(timeToNumber(hours.to_time.substring(0, hours.to_time.length - 3)));
    }
  }, [date, shopHoursQuery.data]);

  // # of sub-slots before first xx:00 mark
  // minimum of 1 for aesthetic purposes
  const preSlots = (1 - (startTime % 1)) / 0.25 || 1;

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

  useEffect(() => {
    query.refetch();
  }, [date, query]);

  const handleBookableClick = (startTime: number) => {
    let flag = false;
    query.data?.slots.forEach((slots) => {
      const startTimeAsDate = new Date(slots[0].start_time);
      const startHour = startTimeAsDate.getHours();
      const startMinutes = startTimeAsDate.getMinutes();
      if (startTime === startHour + startMinutes / 60) {
        setBooking(startTime);
        flag = true;
      }
    });
    if (!flag) {
      query.data?.slots.forEach((slots) => {
        slots.forEach((slot, i) => {
          const startTimeAsDate = new Date(slot.start_time);
          const startHour = startTimeAsDate.getHours();
          const startMinutes = startTimeAsDate.getMinutes();
          if (startTime === startHour + startMinutes / 60) {
            setBooking(startTime - 0.25 * i);
            flag = true;
          }
        });
      });
    }
  };

  const clearBooking = () => {
    setBooking(null);
  };

  const handleConfirmClick = () => {
    if (quoteId !== undefined) {
      const duration: number = appointmentLengthNum * 0.25;
      mutation.mutate({
        status: 'pending',
        duration: `${Math.floor(duration)}:${(duration % 1) * 60 || '00'}:00`,
        appointment_slots:
          query.data?.slots
            .find((slots) => {
              return startTimeEquals(slots[0], booking || -1);
            })
            ?.map((slots) => {
              return slots.id;
            }) || [],
        customer: userQuery.data?.id || -1,
        shop: (typeof shopId === 'string' ? parseInt(shopId) : -1) || -1,
        vehicle: 5, // TODO: should be removed and should have an association with quote in its place
        jwtToken: localStorage.getItem('access_token') || '',
      });
    } else {
      router.push('/appointment-form');
    }
  };

  const isBookable = (startTime: number) => {
    let flag = false;
    query.data?.slots.forEach((slots) => {
      slots.forEach((slot) => {
        const startTimeAsDate = new Date(slot.start_time);
        const startHour = startTimeAsDate.getHours();
        const startMinutes = startTimeAsDate.getMinutes();
        if (startTime === startHour + startMinutes / 60) {
          flag = true;
        }
      });
    });
    return flag;
  };

  return (
    <div className={styles.container}>
      <Header
        title="Book Appointment"
        rightIcon={booking === null ? undefined : AiOutlineCheck}
        rightIconStyle={{ fill: 'var(--primary-color)' }}
        onRightIconClick={handleConfirmClick}
      />

      <div className={styles.content}>
        <div className={styles['date-selection']}>
          <IconButton icon={BsChevronLeft} onClick={decrementDate} />
          <DatePicker value={[date]} onChange={handleDateChange} single />
          <IconButton icon={BsChevronRight} onClick={incrementDate} />
        </div>
        {query.isLoading || query.isFetching ? (
          <div className={styles['loader-container']}>
            <Loader />
          </div>
        ) : (
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
                  <SubSlot
                    startTime={Math.ceil(startTime) + i}
                    onBookableClick={handleBookableClick}
                    booking={booking}
                    onBookingClose={clearBooking}
                    appointmentLength={appointmentLengthNum}
                    isBookable={isBookable}
                  />
                  <SubSlot
                    startTime={Math.ceil(startTime) + i + 0.25}
                    onBookableClick={handleBookableClick}
                    booking={booking}
                    onBookingClose={clearBooking}
                    appointmentLength={appointmentLengthNum}
                    isBookable={isBookable}
                  />
                  <SubSlot
                    startTime={Math.ceil(startTime) + i + 0.5}
                    onBookableClick={handleBookableClick}
                    booking={booking}
                    onBookingClose={clearBooking}
                    appointmentLength={appointmentLengthNum}
                    isBookable={isBookable}
                  />
                  <SubSlot
                    startTime={Math.ceil(startTime) + i + 0.75}
                    onBookableClick={handleBookableClick}
                    booking={booking}
                    onBookingClose={clearBooking}
                    appointmentLength={appointmentLengthNum}
                    isBookable={isBookable}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointmentPage;
