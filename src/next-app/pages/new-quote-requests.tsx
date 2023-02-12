import type { NextPage } from 'next';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/NewQuoteRequests.module.css';
import QuoteRequestCard from '../components/QuoteRequestCard';
import { useRouter } from 'next/router';
import TextField from '../components/TextField';
//import quoteRequestsData from '../data/newQuoteRequestData.json';
import { AuthContext } from '../utils/api';
import Cookies from 'js-cookie';
import { accountTypes } from '../utils/api';
import axios from 'axios';
import apiUrl from '../constants/api-url';

const sampleQuoteRequests = [
  {
    id: 0,
    shop: {
      id: 1,
      name: '',
    },
    customer: {
      id: 0,
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
    },
    preferred_date: new Date().toISOString().slice(0, 10),
    preferred_time: '',
    preferred_phone_number: '',
    preferred_email: '',
    description: 'Quote Request',
    images: [
      {
        id: 0,
        photo: '',
        quote_request: 0,
      },
    ],
    vehicle: '',
    status: '',
  },
];

const NewQuoteRequestsPage: NextPage = () => {
  const router = useRouter();
  let userID: number | null = null;
  let shopID: number | null = 1;
  const [authData, setAuthData] = useState(useContext(AuthContext));
  const pathName = 'view-quote-request';
  const [newQuoteRequests, setNewQuoteRequests] = useState<any[]>(sampleQuoteRequests);
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

  useEffect(() => {
    const getAllNewQuoteRequests = async () => {
      try {
        fetch(`${apiUrl}/quotes/quote-requests`, {
          method: 'GET',
          headers: {
            Authorization: `JWT ${authData.access}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }).then((response) =>
          response.json().then((response) => {
            if (!typeof response.data === undefined) {
              setNewQuoteRequests(response.data);
            }
          })
        );
        console.log(newQuoteRequests);
      } catch (e) {
        console.log(e);
      }
    };
    getAllNewQuoteRequests();
  }, []);

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
          {newQuoteRequests
            .filter((newQuoteRequest) => {
              if (newQuoteRequest.shop.id == shopID) return true;
              else return false;
            })
            .filter((newQuoteRequest) => {
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
            .map((newQuoteRequest) => {
              return (
                <QuoteRequestCard
                  key={newQuoteRequest.id}
                  id={Number(newQuoteRequest.id)}
                  description={newQuoteRequest.description}
                  dateCreated={newQuoteRequest.preferred_date}
                  path={pathName}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default NewQuoteRequestsPage;
