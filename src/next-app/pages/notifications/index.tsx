import type { NextPage } from 'next';
import Header from '../../components/Header';
import Link from 'next/link';
import moment from 'moment';
import 'moment-timezone';
// @ts-ignore
import { useQuery } from 'react-query';
import { getNotifications } from '../../utils/api';
import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';

const NotificationList: NextPage = () => {
  const [accessToken, setAccessToken] = useState<undefined | string>(undefined);
  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token') || '');
  }, []);
  const query = useQuery('getNotifications', getNotifications(accessToken || ''), {
    refetchOnWindowFocus: false,
    enabled: !!accessToken,
  });
  const notificationsList = query.data?.map((notification: any) => {
    return (
      <Link href={`/notifications/${notification.id}`} key={notification.id} legacyBehavior>
        <a
          className={`card hover-scale-up active-scale-down ${
            notification.read ? 'notification-read' : 'notification-unread'
          }`}
        >
          <div className="flex flex-col row-gap-small">
            <span>
              <b>{notification.title}</b>
            </span>
            <span className="notification-date">
              Received{' '}
              {moment.duration(moment(notification.created_at).diff(moment())).humanize(true)}
            </span>
          </div>
        </a>
      </Link>
    );
  });
  return (
    <div className="container">
      <Header title="Notifications" />
      <div className="wrapper">
        <div className="flex flex-col"></div>
        {notificationsList === undefined ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Loader />
          </div>
        ) : (
          <div className="grid-list" id="work-orders-list">
            {notificationsList.length > 0 ? notificationsList : <p>No notifications found.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
