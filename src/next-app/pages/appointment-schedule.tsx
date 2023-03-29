import type { NextPage } from 'next';
import styles from '../styles/pages/AppointmentSchedule.module.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'; // TODO: Change icons to left and right carets
import { GrFormClose } from 'react-icons/gr';
import { BiPlus } from 'react-icons/bi';
import { AiOutlineCheck } from 'react-icons/ai';
import IconButton from '../components/IconButton';
import DatePicker from '../components/DatePicker';
import { useState, MouseEvent, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  AppointmentSlot,
  AppointmentSlotsResponse,
  AppointmentStatus,
  Weekday,
  bookAppointment,
  getAppointmentSlots,
  getBookedAppointments,
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

type BookingStatus = 'no show' | 'in progress' | 'completed' | 'future';

function convertStatus(status: AppointmentStatus): BookingStatus {
  if (status === 'no show') {
    return 'no show';
  } else if (status === 'in_progress') {
    return 'in progress';
  } else if (status === 'completed' || status === 'done') {
    return 'completed';
  } else if (status === 'pending') {
    return 'future';
  } else {
    return 'future';
  }
}

const Booking = (props: {
  appointmentLength: number;
  width: number;
  status: BookingStatus;
  text: string;
  onClick: () => void;
}) => {
  return (
    <div
      className={styles.booking + ' ' + status.split(' ').join('-')}
      style={{
        height: 'calc(' + props.appointmentLength + '*4vh)',
        width: props.width + '%',
      }}
    >
      <div className={styles['booking-inner-container']} onClick={props.onClick}>
        <span>{props.text}</span>
      </div>
    </div>
  );
};

type SubSlotProps = {
  startTime: number;
  bookings: {
    appointmentLength: number;
    status: BookingStatus;
    text: string;
    onClick: () => void;
  }[];
};

const SubSlot = (props: SubSlotProps) => {
  const bookingWidth = 100 / props.bookings.length;

  return (
    <div className={styles['sub-slot']}>
      {props.bookings.map((booking, i) => {
        return (
          <Booking
            appointmentLength={booking.appointmentLength}
            status={booking.status}
            width={bookingWidth}
            text={booking.text}
            onClick={booking.onClick}
            key={props.startTime + '-' + i}
          />
        );
      })}
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
  const [date, setDate] = useState(new Date());
  const [accessToken, setAccessToken] = useState<undefined | string>(undefined);
  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token') || '');
  }, []);
  const appointmentsQuery = useQuery('getAppointments', getBookedAppointments(accessToken || ''), {
    refetchOnWindowFocus: false,
    enabled: !!accessToken,
  });
  const shopDetailsQuery = useQuery('getShopDetails', getShopDetails(accessToken || ''), {
    refetchOnWindowFocus: false,
    enabled: !!accessToken,
  });
  const shopHoursQuery = useQuery('getShopHours', getShopHours(shopDetailsQuery.data?.id || -1), {
    refetchOnWindowFocus: false,
    enabled: !!shopDetailsQuery.data,
  });
  const daysAppointments = useMemo(() => {
    return appointmentsQuery.data
      ?.filter((appointment) => {
        const startTimeAsDate = new Date(appointment.start_time);
        /** Source: https://flaviocopes.com/how-to-determine-date-is-today-javascript/ */
        return (
          startTimeAsDate.getDate() == date.getDate() &&
          startTimeAsDate.getMonth() == date.getMonth() &&
          startTimeAsDate.getFullYear() == date.getFullYear()
        );
      })
      .map((a) => {
        const startTimeAsDate = new Date(a.start_time);
        const startHour = startTimeAsDate.getHours();
        const startMinutes = startTimeAsDate.getMinutes();
        const startTime = startHour + startMinutes / 60;
        const endTimeAsDate = new Date(a.end_time);
        const endHour = endTimeAsDate.getHours();
        const endMinutes = endTimeAsDate.getMinutes();
        const endTime = endHour + endMinutes / 60;
        const appointmentLength = (endTime - startTime) / 0.25;
        return { startTime: startTime, length: appointmentLength, appointment: a };
      })
      .sort((a, b) => {
        if (a.startTime < b.startTime) {
          return -1;
        } else if (a.startTime === b.startTime) {
          return 0;
        } else {
          return 1;
        }
      });
  }, [appointmentsQuery.data, date]);

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
      <Header
        title="Appointments"
        rightIcon={BiPlus}
        onRightIconClick={() => {
          router.push('/create-appointment');
        }}
        backButtonPath="/dashboard"
      />

      <div className={styles.content}>
        <div className={styles['date-selection']}>
          <IconButton icon={BsChevronLeft} onClick={decrementDate} />
          <DatePicker value={[date]} onChange={handleDateChange} single />
          <IconButton icon={BsChevronRight} onClick={incrementDate} />
        </div>
        {appointmentsQuery.isLoading || appointmentsQuery.isFetching ? (
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
                  {[0, 0.25, 0.5, 0.75].map((j) => {
                    return (
                      <SubSlot
                        startTime={Math.ceil(startTime) + i + j}
                        bookings={
                          daysAppointments
                            ?.filter((a) => {
                              return a.startTime === Math.ceil(startTime) + i + j;
                            })
                            .map((a) => {
                              return {
                                appointmentLength: a.length,
                                status: convertStatus(a.appointment.status),
                                text: a.appointment.service?.name || 'custom',
                                onClick: () => {
                                  console.log('clicked');
                                  router.push(`/appointment-details?id=${a.appointment.id}`);
                                },
                              };
                            }) || []
                        }
                        key={i + '-' + j}
                      />
                    );
                  })}
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
