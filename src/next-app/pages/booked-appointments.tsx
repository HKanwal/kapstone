import type { NextPage } from 'next';
import styles from '../styles/pages/BookedAppointments.module.css';
import Header from '../components/Header';
import { useQuery } from 'react-query';
import { getBookedAppointments } from '../utils/api';
import { useEffect, useState } from 'react';
import BookedAppointment from '../components/BookedAppointment';
import { useRouter } from 'next/router';

const BookedAppointmentsPage: NextPage = () => {
  const router = useRouter();
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
      <Header title="Booked Appointments" backButtonPath="/dashboard" />

      <div className={styles.content}>
        {query.data?.length === 0 ? (
          <h4 className={styles['no-appts-msg']}>You have no booked appointments.</h4>
        ) : (
          query.data?.map((appointment) => {
            const startTimeAsDate = new Date(appointment.start_time);
            const endTimeAsDate = new Date(appointment.end_time);
            return (
              <div className={styles['appointment-container']} key={appointment.id}>
                <BookedAppointment
                  date={startTimeAsDate.toDateString()}
                  startTime={startTimeAsDate.toTimeString().split(' ')[0].substring(0, 5)}
                  endTime={endTimeAsDate.toTimeString().split(' ')[0].substring(0, 5)}
                  shopName={appointment.shop.name}
                  serviceName={
                    appointment.service
                      ? appointment.service?.name
                      : appointment.quote?.quote_request.description
                  }
                  onClick={() => {
                    router.push({
                      pathname: '/appointment-details',
                      query: { id: `${appointment.id}` },
                    });
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BookedAppointmentsPage;
