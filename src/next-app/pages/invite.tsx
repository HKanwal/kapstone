import type { NextPage, GetServerSideProps } from 'next';
import { useState } from 'react';
import Button from '../components/Button';
import EmailsField from '../components/EmailsField';
import Header from '../components/Header';
import styles from '../styles/pages/Invite.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import apiUrl from '../constants/api-url';
import axios from 'axios';
// @ts-ignore
import * as cookie from 'cookie';

const InvitePage: NextPage = ({ shop }: any) => {
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const [emails, setEmails] = useState<string[]>([]);
  const inviteEmployees = async () => {
    const access_token = Cookies.get('access');
    const valuesToSend = {
      emails: emails,
      shop: shop?.id,
    };
    try {
      const res = await axios.post(`${apiUrl}/shops/invitations/bulk_invite/`, valuesToSend, {
        headers: { Authorization: `JWT ${access_token}` },
      });
      if (res.status === 201) {
        router.push('/invitations');
      }
    } catch (error: any) {
      setErrors(error.response.data?.errors);
      scrollTo(0, 0);
    }
  };

  return (
    <div className={styles.container}>
      <Header title="Invite Employees" />

      <div className={styles.content}>
        {errors?.length > 0 && (
          <div className="flex flex-col row-gap-small">
            {errors.map((error: any, index) => {
              return (
                <span className="error" key={`error_${index}`}>
                  {error.detail}
                </span>
              );
            })}
          </div>
        )}
        <div className={styles['field-container']}>
          <EmailsField
            name="Emails"
            placeholder="Enter your employees' emails"
            emails={emails}
            setEmails={(emails) => setEmails(emails)}
          />
        </div>
        <Button
          title="Invite"
          width="80%"
          onClick={inviteEmployees}
          disabled={emails.length === 0}
        />
        <span className={styles.or}>OR</span>
        <Button title="Skip" width="80%" onClick={() => router.push('/dashboard')} />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const access_token = parsedCookies.access;
  try {
    const shop = await axios.get(`${apiUrl}/shops/shops/me/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        shop: shop.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default InvitePage;
