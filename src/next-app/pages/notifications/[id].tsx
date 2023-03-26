import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import Header from '../../components/Header';
import apiUrl from '../../constants/api-url';
// @ts-ignore
import * as cookie from 'cookie';
import moment from 'moment';

const NotificationDetail: NextPage = ({ notification }: any) => {
  const router = useRouter();

  return (
    <div className="container">
      <Header title={`Notification`} />
      <div className="wrapper">
        <div className="padding-bottom-large card">
          <h2 className="notification-title">{notification.title}</h2>
          <span className="notification-date">
            Received on {moment(notification.created_at).format('MMMM Do YYYY, h:mm:ss a')}
          </span>
          <p className="notification-message">{notification.message}</p>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { id } = context.query;
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  let auth_error: Error | AxiosError | null = null;
  try {
    const notification: any = await axios
      .get(`${apiUrl}/misc/notifications/${id}/`, {
        headers: { Authorization: `JWT ${access_token}` },
      })
      .catch((error) => {
        // console.log(error);
        auth_error = error;
      });
    return {
      props: {
        notification: notification.data,
      },
    };
  } catch (error) {
    if (auth_error !== null) {
      if (
        // @ts-ignore
        auth_error.response.status === 401 &&
        // @ts-ignore
        (auth_error.response.data.errors[0].code === 'token_not_valid' ||
          // @ts-ignore
          auth_error.response.data.errors[0].code === 'not_authenticated')
      ) {
        const { resolvedUrl } = context;
        return {
          redirect: {
            destination: `/login?from=${resolvedUrl}`,
            permanent: false,
          },
        };
      }
    }
    return {
      notFound: true,
    };
  }
};

export default NotificationDetail;
