import type { GetServerSideProps, NextPage } from 'next';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import Header from '../../components/Header';
import styles from '../../styles/pages/NewQuoteRequests.module.css';
import QuoteRequestCard from '../../components/QuoteRequestCard';
import TextField from '../../components/TextField';
//import quoteRequestsData from '../data/newQuoteRequestData.json';
import { AuthContext } from '../../utils/api';
import Cookies from 'js-cookie';
import { accountTypes } from '../../utils/api';
import axios from 'axios';
import apiUrl from '../../constants/api-url';
// @ts-ignore
import * as cookie from 'cookie';

const NewQuoteRequestsPage: NextPage = ({ quoteRequests }: any) => {
  const [authData, setAuthData] = useState(useContext(AuthContext));
  const [QRFilter, setQRFilter] = useState('');

  if (authData.access !== '') {
  } else if (Cookies.get('access') && Cookies.get('access') !== '') {
    setAuthData({
      access: Cookies.get('access') as string,
      refresh: Cookies.get('refresh') as string,
      user_type: Cookies.get('user_type') as accountTypes,
    });
  }

  const quoteRequestList = quoteRequests.filter((newQuoteRequest: any) => {
    if (newQuoteRequest.status === 'Not Accepted') return true;
    else return false;
  });

  return (
    <div className={styles.container}>
      <Header title="New Quote Requests" />
      <div className={styles['field-container']}>
        <div className={styles['filter-container']}>
          <TextField
            name="Search"
            placeholder="Search by ID or description"
            onChange={setQRFilter}
          />
        </div>
        <div className={styles['card-container']}>
          {quoteRequestList
            .filter((newQuoteRequest: any) => {
              if (
                QRFilter != '' &&
                !(
                  newQuoteRequest.description.toLowerCase().startsWith(QRFilter.toLowerCase()) ||
                  String(newQuoteRequest.id).startsWith(QRFilter)
                )
              )
                return false;
              else return true;
            })
            .map((newQuoteRequest: any) => {
              return (
                <QuoteRequestCard
                  key={newQuoteRequest.id}
                  id={Number(newQuoteRequest.id)}
                  description={newQuoteRequest.description}
                  dateCreated={String(new Date())}
                  path={`new-quote-requests/${newQuoteRequest.id}`}
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
    const quoteRequests = await axios.get(`${apiUrl}/quotes/quote-requests/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        quoteRequests: quoteRequests.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        quoteRequests: [],
      },
    };
  }
};

export default NewQuoteRequestsPage;
