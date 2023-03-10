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
import Dropdown from '../components/Dropdown';

const QuoteListPage: NextPage = ({ quotes }: any) => {
  const router = useRouter();
  const [authData, setAuthData] = useState(useContext(AuthContext));
  const [status, setStatus] = useState('All');
  const [quoteSearch, setQuoteSearch] = useState('');

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

  return (
    <div className={styles.container}>
      <Header
        title="Quotes"
        backButtonPath="/dashboard"
        burgerMenu={[
          {
            option: 'Home',
            onClick() {
              router.push('/dashboard');
            },
          },
        ]}
      />
      <div className={styles['field-container']}>
        <div className={styles['btn-container']}>
          <Button title="New Quote Requests" onClick={handleClick} width="100%" />
        </div>
        <div className={styles['filter-container']}>
          <TextField
            name="Search"
            placeholder="Search by ID, description or customer name"
            onChange={setQuoteSearch}
          />
        </div>
        <div className={styles['filter-container']}>
          <Dropdown
            name="Filter By"
            items={['All', 'Accepted', 'Pending', 'Rejected']}
            onSelect={setStatus}
          />
        </div>
        <div className={styles['card-container']}>
          {quoteList
            .filter((quote: any) =>
              status === 'All'
                ? true
                : quote.status == 'new_quote'
                ? status == 'Pending' && quote.status == 'new_quote'
                : quote.status_display == status
            )
            .filter((quote: any) => {
              if (
                quoteSearch != '' &&
                !(
                  quote.quote_request.description
                    .toLowerCase()
                    .includes(quoteSearch.toLowerCase()) ||
                  String(quote.id).startsWith(quoteSearch) ||
                  quote.quote_request.customer.first_name
                    .toLowerCase()
                    .includes(quoteSearch.toLowerCase()) ||
                  quote.quote_request.customer.last_name
                    .toLowerCase()
                    .includes(quoteSearch.toLowerCase())
                )
              )
                return false;
              else return true;
            })
            .sort((a: any, b: any) =>
              Date.parse(a.created_at) < Date.parse(b.created_at) ? 1 : -1
            )
            .sort((a: any, b: any) => (a.status < b.status ? -1 : 1))
            .map((quote: any) => {
              return (
                <Card
                  key={quote.id}
                  id={quote.id}
                  name={quote.quote_request.description}
                  status={quote.status === 'new_quote' ? 'Pending' : quote.status_display}
                  price={quote.price}
                  date={quote.created_at}
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
    return {
      props: {
        quotes: quotes.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        quotes: [],
      },
    };
  }
};

export default QuoteListPage;
