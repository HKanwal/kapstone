import type { NextPage } from 'next';
import styles from '../styles/pages/BookedAppointments.module.css';
import Header from '../components/Header';

const BookedAppointmentsPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Header title="Booked Appointments" />
    </div>
  );
};

export default BookedAppointmentsPage;
