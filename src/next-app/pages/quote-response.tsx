import type { GetServerSideProps, NextPage } from 'next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequest.module.css';
import carData from '../data/data.json';
import validateEmail from '../utils/validateEmail';
import TextArea from '../components/TextArea';
import DropdownField from '../components/DropdownField';
import FieldLabel from '../components/FieldLabel';
import Link from '../components/Link';
import DatePickerField from '../components/DatePickerField';
import TimeRangeField from '../components/TimeRangeField';
import axios from 'axios';
import Cookies from 'js-cookie';
import apiUrl from '../constants/api-url';
import { Router, useRouter } from 'next/router';
import { Calendar } from '@mantine/dates';

const sampleQuoteRequest = {
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
};

const QuoteResponsePage: NextPage = ({ quoteRequest }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const shopID: number = quoteRequest.shop.id;
  const [price, setPrice] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const expiraryDate = '2025-01-01';

  const handleSubmit = async () => {
    const valuesToSend = JSON.stringify({
      status: 'pending',
      price: price,
      estimated_time: estimatedTime,
      expiry_date: expiraryDate,
      quote_request: id,
    });
    try {
      const access_token = Cookies.get('access');
      const res = await axios.post(`${apiUrl}/quotes/quotes`, valuesToSend, {
        headers: { Authorization: `JWT ${access_token}` },
      });
      if (res.status === 200) {
        router.push({ pathname: '/new-quote-requests' });
      }
    } catch (error: any) {
      scrollTo(0, 0);
    }
  };

  return (
    <div className={styles.container}>
      <Header title={`Quote Response - ${quoteRequest.description}`} />

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles['field-container']}>
            <TextField name="Price" placeholder="Enter Price" onChange={setPrice} required />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Estimated Time"
              placeholder="Enter Estimated Time"
              onChange={setEstimatedTime}
              required
            />
          </div>
        </div>
        {/* <div className={styles.section}>
          <div className={styles['field-container']}>
            <DropdownField
              name="Services"
              placeholder="Add Required Services"
              items={serviceList}
              type="multi-select"
            />
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Part Information</span>
          <div className={styles['field-container']}>
            <TextField name="Part Type" placeholder="Add Required Part Type" />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Part Price" placeholder="Add Required Part Price" />
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles['field-container']}>
            <TextField name="Labour Cost" placeholder="Add Required Labour Cost" />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Estimated Time" placeholder="Enter Estimated Time" />
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles['field-container']}>
            <DropdownField
              name="Discount Type"
              placeholder="Select Discount Type"
              items={['new customer', 'employee', 'friends & family']}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Discount Amount" placeholder="Enter Discount Amount" />
          </div>
        </div>*/}
        <Button title="Submit Quote" width="80%" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { id } = context.query;
  const access_token = Cookies.get('access');
  try {
    const quoteRequest = await axios.get(`${apiUrl}/quotes/quote-requests/${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const vehicle = await axios.get(
      `${apiUrl}/quotes/quote-requests/${quoteRequest.data.vehicle}`,
      {
        headers: { Authorization: `JWT ${access_token}` },
      }
    );
    return {
      props: {
        quoteRequest: quoteRequest.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        quoteRequest: sampleQuoteRequest,
      },
    };
  }
};

export default QuoteResponsePage;
