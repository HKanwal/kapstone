import type { NextPage } from 'next';
import styles from '../styles/pages/BookedAppointments.module.css';
import Header from '../components/Header';
import { useQuery } from 'react-query';
import { getBookedAppointments } from '../utils/api';
import { useEffect, useState } from 'react';
import BookedAppointment from '../components/BookedAppointment';

const BookedAppointmentsPage: NextPage = () => {
  const [accessToken, setAccessToken] = useState<undefined | string>(undefined);
  const query = useQuery('getBookedAppointments', getBookedAppointments(accessToken || ''), {
    refetchOnWindowFocus: false,
    enabled: !!accessToken,
  });

  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token') || '');
  }, []);

  return (
    <div className={styles.container}>
      <Header title="Booked Appointments" />

      <div className={styles.content}>
        {query.data?.map((appointment) => {
          const startTimeAsDate = new Date(appointment.start_time);
          const endTimeAsDate = new Date(appointment.end_time);
          return (
            <div className={styles['appointment-container']}>
              <BookedAppointment
                date={startTimeAsDate.toDateString()}
                startTime={startTimeAsDate.toTimeString().split(' ')[0].substring(0, 5)}
                endTime={endTimeAsDate.toTimeString().split(' ')[0].substring(0, 5)}
                shopName={appointment.shop.name}
                key={appointment.start_time}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookedAppointmentsPage;
