import type { GetServerSideProps, NextPage } from 'next';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/NewQuoteRequests.module.css';
import QuoteRequestCard from '../components/QuoteRequestCard';
import TextField from '../components/TextField';
import { AuthContext } from '../utils/api';
import Cookies from 'js-cookie';
import { accountTypes } from '../utils/api';
import axios from 'axios';
import apiUrl from '../constants/api-url';
// @ts-ignore
import * as cookie from 'cookie';
import Card from '../components/Card';
import { useRouter } from 'next/router';
import Button from '../components/Button';

const QuoteListPage: NextPage = ({ quotes, quoteRequests }: any) => {
  const router = useRouter();
  const [authData, setAuthData] = useState(useContext(AuthContext));

  if (authData.access !== '') {
  } else if (Cookies.get('access') && Cookies.get('access') !== '') {
    setAuthData({
      access: Cookies.get('access') as string,
      refresh: Cookies.get('refresh') as string,
      user_type: Cookies.get('user_type') as accountTypes,
    });
  }

  const quoteList = quotes.filter((quote: any) => {
    if (quote.status != 'Not Accepted') return true;
    else return false;
  });

  const handleClick = () => {
    router.push({ pathname: '/new-quote-requests' });
  };

  //console.log(quotes.find((quote: any) => quote.id === 5));
  console.log(quoteRequests.find((quoteRequest: any) => quoteRequest.id === 1));
  return (
    <div className={styles.container}>
      <Header title="Quotes" />
      <div className={styles['field-container']}>
        <div className={styles['btn-container']}>
          <Button title="New Quote Requests" onClick={handleClick} width="100%" />
        </div>
        <div className={styles['card-container']}>
          {quoteList.map((quote: any) => {
            return (
              <Card
                key={quote.id}
                id={quote.id}
                name={quoteRequests.find((quoteRequest: any) => quoteRequest.id === 1).description}
                status={quote.status === 'new_quote' ? 'Pending' : quote.status}
                price={quote.price}
                date={quote.expiry_date}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  try {
    const quotes = await axios.get(`${apiUrl}/quotes/quotes/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const quoteRequests = await axios.get(`${apiUrl}/quotes/quote-requests/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        quotes: quotes.data,
        quoteRequests: quoteRequests.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        quotes: [],
        quoteRequests: [],
      },
    };
  }
};

export default QuoteListPage;
