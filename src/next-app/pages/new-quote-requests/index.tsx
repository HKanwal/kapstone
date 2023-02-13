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

const NewQuoteRequestsPage: NextPage = ({ quoteRequests }: any) => {
  let userID: number | null = null;
  let shopID: number = 1;
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

  if (['shop_owner', 'employee'].includes(authData.user_type)) {
    fetch(`${apiUrl}/auth/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `JWT ${authData.access}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }).then((response) =>
      response.json().then((response) => {
        userID = response.id;
      })
    );
    // axios.get(`${apiUrl}/shops/shops/`).then((response) => {
    //   const shops = response.data;
    //   console.log(shops);
    //   shopID = shops.filter((shop: { shop_owner: { id: number | null } }) => {
    //     if (shop.shop_owner.id == shopID) return true;
    //     else return false;
    //   }).id;
    // });
  }

  const quoteRequestList = quoteRequests.filter((newQuoteRequest: any) => {
    if (newQuoteRequest.shop.id == shopID) return true;
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
                  newQuoteRequest.description.toLowerCase().startsWith(QRFilter) ||
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
                  dateCreated={newQuoteRequest.preferred_date}
                  path={`new-quote-requests/${newQuoteRequest.id}`}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async () => {
  const access_token = Cookies.get('access');
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
        quoteRequests: [
          {
            id: 0,
            shop: {
              id: 1,
              name: 'string',
            },
            customer: {
              id: 0,
              username: 'string',
              first_name: 'string',
              last_name: 'string',
              email: 'user@example.com',
              phone_number: 'string',
            },
            preferred_date: '2023-02-12',
            preferred_time: 'string',
            preferred_phone_number: 'string',
            preferred_email: 'user@example.com',
            description: 'string',
            images: [
              {
                id: 0,
                photo: 'string',
                quote_request: 0,
              },
            ],
            vehicle: 'string',
            status: 'string',
          },
        ],
      },
    };
  }
};

export default NewQuoteRequestsPage;
