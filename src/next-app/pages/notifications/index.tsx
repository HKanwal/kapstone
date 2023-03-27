import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios';
import Header from '../../components/Header';
import Link from 'next/link';
import moment from 'moment';
import 'moment-timezone';
import apiUrl from '../../constants/api-url';
// @ts-ignore
import * as cookie from 'cookie';

const NotificationList: NextPage = ({ notifications, accessToken, cookie }: any) => {
  console.log('access=' + accessToken + ', cookie=' + cookie);
  const notificationsList = notifications.map((notification: any) => {
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
        <div className="grid-list" id="work-orders-list">
          {notificationsList.length > 0 ? notificationsList : <p>No notifications found.</p>}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  try {
    const notifications = await axios.get(`${apiUrl}/misc/notifications/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        notifications: notifications.data,
        accessToken: access_token,
        cookie: String(context.req.headers.cookie),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
      props: {
        notifications: [],
      },
    };
  }
};

export default NotificationList;
