import React, { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import styles from '../styles/pages/Dashboard.module.css';
import { AuthContext, Jwt, accountTypes, getBookedAppointments, refreshToken } from '../utils/api';
import apiUrl from '../constants/api-url';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useQuery } from 'react-query';
import BookedAppointment from '../components/BookedAppointment';
import { useRouter } from 'next/router';

type DashboardPageProps = {
  onLogin: (jwt: Jwt) => void;
};
const Dashboard: NextPage<DashboardPageProps, {}> = (props) => {
  const router = useRouter();
  const [authData, setAuthData] = useState(useContext(AuthContext));
  const [notificationCount, setNotificationCount] = useState(0);
  const [headerName, setHeaderName] = useState('');
  const [modalBody, setModalBody] = useState([] as JSX.Element[]);
  const [profileURL, setProfileURL] = useState<null | string>(null);
  const [accessToken, setAccessToken] = useState<undefined | string>(undefined);
  const query = useQuery('getBookedAppointments', getBookedAppointments(accessToken || ''), {
    refetchOnWindowFocus: false,
    enabled: !!accessToken,
  });
  const todaysAppointments = query.data?.filter((appointment) => {
    const startTimeAsDate = new Date(appointment.start_time);
    const today = new Date();
    /** Source: https://flaviocopes.com/how-to-determine-date-is-today-javascript/ */
    return (
      startTimeAsDate.getDate() == today.getDate() &&
      startTimeAsDate.getMonth() == today.getMonth() &&
      startTimeAsDate.getFullYear() == today.getFullYear()
    );
  });

  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token') || '');
  }, []);

  useEffect(() => {
    if (authData.access !== '') {
    } else if (Cookies.get('access') && Cookies.get('access') !== '') {
      setAuthData({
        access: Cookies.get('access') as string,
        refresh: Cookies.get('refresh') as string,
        user_type: Cookies.get('user_type') as accountTypes,
      });
    }

    const access_token = Cookies.get('access');
    axios
      .get(`${apiUrl}/misc/notifications/count/`, {
        headers: { Authorization: `JWT ${access_token}` },
      })
      .then((response) => {
        setNotificationCount(response.data.count);
      });

    if (['shop_owner', 'employee'].includes(authData.user_type)) {
      const access_token = Cookies.get('access');
      axios
        .get(`${apiUrl}/shops/shops/me/`, {
          headers: { Authorization: `JWT ${access_token}` },
        })
        .then((response) => {
          const shop = response.data;
          setHeaderName(shop.name);
          setModalBody([
            <span style={{ display: 'block' }} key="1">
              {shop.address?.street}
            </span>,
            <span style={{ display: 'block' }} key="2">
              {shop.address?.city}, {shop.address?.province}
            </span>,
            <span style={{ display: 'block' }} key="3">
              {shop.address?.country}, {shop.address?.postal_code}
            </span>,
          ]);
          setProfileURL(`/shop/${shop.id}/profile`);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (authData.access !== '') {
        fetch(`${apiUrl}/auth/users/me`, {
          method: 'GET',
          headers: {
            Authorization: `JWT ${authData.access}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }).then((response) =>
          response.json().then((response) => {
            if (response.type === 'client_error' && response.errors[0].code === 'token_not_valid') {
              // Function to refresh token
              refreshToken({
                authData: authData,
                setAuthData: setAuthData,
                onLogin: props.onLogin,
              });
            } else {
              setHeaderName(response.username);
            }
          })
        );
      } else {
        setHeaderName('Not Logged In');
      }
    }
  }, [authData, props.onLogin]);

  return (
    <div id={styles.wrapper}>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Sayyara automotive matcher (working title)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar
        authData={authData}
        onLogin={props.onLogin}
        headerName={headerName}
        modalBody={modalBody}
        profileURL={profileURL ?? ''}
        showProfileButton={profileURL !== null}
        notificationCount={notificationCount}
      />
      <div className={styles.container}>
        <h2>Today&apos;s Appointments</h2>
        {todaysAppointments?.length === 0 ? (
          <h4 className={styles['no-appts-msg']}>You have no appointments for today.</h4>
        ) : (
          todaysAppointments?.map((appointment) => {
            const startTimeAsDate = new Date(appointment.start_time);
            const endTimeAsDate = new Date(appointment.end_time);
            return (
              <div className={styles['appointment-container']} key={appointment.id}>
                <BookedAppointment
                  date={startTimeAsDate.toDateString()}
                  startTime={startTimeAsDate.toTimeString().split(' ')[0].substring(0, 5)}
                  endTime={endTimeAsDate.toTimeString().split(' ')[0].substring(0, 5)}
                  serviceName={
                    appointment.service
                      ? appointment.service?.name
                      : appointment.quote?.quote_request.description
                  }
                  shopName={authData.user_type === 'customer' ? appointment.shop.name : undefined}
                  customerName={
                    authData.user_type === 'shop_owner'
                      ? `${appointment.customer.first_name} ${appointment.customer.last_name}`
                      : undefined
                  }
                  onClick={
                    authData.user_type === 'shop_owner'
                      ? () => {
                          router.push({
                            pathname: '/appointment-details',
                            query: { id: `${appointment.id}` },
                          });
                        }
                      : undefined
                  }
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
