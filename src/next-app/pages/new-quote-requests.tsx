import type { NextPage } from 'next';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/NewQuoteRequests.module.css';
import QuoteRequestCard from '../components/QuoteRequestCard';
import { useRouter } from 'next/router';
import TextField from '../components/TextField';
//import quoteRequestsData from '../data/newQuoteRequestData.json';

const sampleQuoteRequests = [
  {
    id: 0,
    shop: {
      id: 0,
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
    preferred_date: '2023-02-08',
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
  },
  {
    id: 1,
    shop: {
      id: 0,
      name: 'string',
    },
    customer: {
      id: 1,
      username: 'string1',
      first_name: 'string1',
      last_name: 'string1',
      email: 'user@example.com',
      phone_number: 'string1',
    },
    preferred_date: '2123-12-18',
    preferred_time: 'string1',
    preferred_phone_number: 'string1',
    preferred_email: 'user@example.com',
    description: 'string1',
    images: [
      {
        id: 1,
        photo: 'string1',
        quote_request: 1,
      },
    ],
    vehicle: 'string1',
  },
];

const NewQuoteRequestsPage: NextPage = () => {
  type filter = {
    [key: string]: any;
  };
  const router = useRouter();
  const shop = '0';
  const pathName = 'view-quote-request';
  const [newQuoteRequests, setNewQuoteRequests] = useState<any[]>([]);
  const [QRFilter, setQRFilter] = useState('');

  useEffect(() => {
    const getAllNewQuoteRequests = async () => {
      try {
        //const res = await axios.get(`${apiUrl}/accounts/newQuoteRequest/`);
        setNewQuoteRequests(sampleQuoteRequests);
        console.log(String(newQuoteRequests[0].shop.id) == shop);
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
              if (String(newQuoteRequest.shop.id) == shop) return true;
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
