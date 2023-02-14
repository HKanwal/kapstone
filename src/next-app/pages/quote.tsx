import type { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/Quote.module.css';
import { useRouter } from 'next/router';
import apiUrl from '../constants/api-url';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { AuthContext, accountTypes } from '../utils/api';
import Cookies from 'js-cookie';
import axios from 'axios';
// @ts-ignore
import * as cookie from 'cookie';

type QuoteProps = {
  id: number;
  description: string;
  status: string;
  date: string;
  acceptedBy: string;
  partCost?: string;
  labourCost?: string;
  cost: string;
  estimatedTime: string;
  dueDate: string;
};

const Quote: NextPage = ({ quote, quoteRequest, shop }: any) => {
  const [authData, setAuthData] = useState(useContext(AuthContext));

  const router = useRouter();
  const { id } = router.query;

  if (authData.access !== '') {
  } else if (Cookies.get('access') && Cookies.get('access') !== '') {
    setAuthData({
      access: Cookies.get('access') as string,
      refresh: Cookies.get('refresh') as string,
      user_type: Cookies.get('user_type') as accountTypes,
    });
  }

  const handleCallClick = () => {
    window.open(`tel: ${shop.shop_owner.phone_number}`);
  };

  if (id) {
    return (
      <div className={styles.container}>
        <Header
          title={`Quote - ${quoteRequest.description}`}
          burgerMenu={[
            {
              option: 'Call Shop',
              onClick() {
                handleCallClick();
              },
            },
          ]}
        />
        <div className={styles['quote-container']}>
          <div className={styles['status-container']}>
            <label>{`Status: ${quote.status === 'new_quote' ? 'Pending' : quote.status}`}</label>
          </div>
          <div className={styles['cost-container']}>
            <label>{`Cost: $${quote.price}`}</label>
          </div>
          <div className={styles['date-container']}>
            <label>{`Date: ${new Date().toISOString().split('T')[0]}`}</label>
          </div>
          <div className={styles['field-container']}>
            <TextField name="Accepted By" placeholder={shop.name} disabled={true} />
          </div>
          {quote.partCost || quote.labourCost ? (
            <div className={styles.section}>
              <div className={styles['section-header']}>
                <label>Cost Breakdown:</label>
              </div>
              {quote.partCost ? (
                <div className={styles['field-container']}>
                  <TextField
                    name="Parts Cost:"
                    placeholder={`$${quote.partCost}`}
                    disabled={true}
                  />
                </div>
              ) : null}
              {quote.labourCost ? (
                <div className={styles['field-container']}>
                  <TextField
                    name="Labour Cost:"
                    placeholder={`$${quote.labourCost}`}
                    disabled={true}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
          <div className={styles['field-container']}>
            <TextField name="Estimated Time:" placeholder={quote.estimated_time} disabled={true} />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Quote Expires On:" placeholder={quote.expiry_date} disabled={true} />
          </div>
          <div className={styles['buttons-container']}>
            <div className={styles['reject-button']}>
              <Button
                title="Reject Quote"
                width="80%"
                backgroundColor="red"
                onClick={() => {
                  console.log('TODO: API call for rejecting quote');
                  router.push({
                    pathname: 'quote-request-details',
                    query: { id: id },
                  });
                }}
              />
            </div>
            <div className={styles['accept-button']}>
              <Button
                title="Accept Quote"
                margin="0 0 0 9vw"
                width="80%"
                onClick={() => {
                  console.log('TODO: API call for accepting quote');
                  router.push({
                    pathname: 'quote-request-details',
                    query: { id: quote.quote_request },
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <Header title={`Quote`} />
        <div className={styles['error-page-container']}>
          <label>No Quote Request Selected</label>
        </div>
      </div>
    );
  }
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { id } = context.query;
  console.log(id);
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  try {
    const quote = await axios.get(`${apiUrl}/quotes/quotes/${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const quoteRequest = await axios.get(
      `${apiUrl}/quotes/quote-requests/${quote.data.quote_request}`,
      {
        headers: { Authorization: `JWT ${access_token}` },
      }
    );
    const shop = await axios.get(`${apiUrl}/shops/shops/${quote.data.shop}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        quote: quote.data,
        quoteRequest: quoteRequest.data,
        shop: shop.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        notFound: true,
      },
    };
  }
};

export default Quote;
