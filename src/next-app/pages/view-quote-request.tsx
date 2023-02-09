/* eslint-disable indent */
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequestDetails.module.css';
import Dropdown from '../components/Dropdown';
import FieldLabel from '../components/FieldLabel';
import TextInput from '../components/TextInput';
import Card from '../components/Card';
import { quotes } from '../data/QuoteData';
import { useRouter } from 'next/router';

type info = {
  [key: string]: any;
};

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

const ViewQuoteRequestsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [quoteRequest, setQuoteRequest] = useState<info>({
    id: 0,
    shop: {
      id: 0,
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
    preferred_date: '',
    preferred_time: '',
    preferred_phone_number: '',
    preferred_email: '',
    description: '',
    images: [
      {
        id: 0,
        photo: '',
        quote_request: 0,
      },
    ],
    vehicle: '',
  });

  function noChange(): void {
    throw new Error('Function not implemented.');
  }

  useEffect(() => {
    const getQuoteRequest = async () => {
      try {
        //const res = await axios.get(`${apiUrl}/quotes/quote-requests/`);
        setQuoteRequest(sampleQuoteRequests[Number(id)]);
        //console.log(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getQuoteRequest();
  }, []);

  return (
    <div className={styles.container}>
      <Header
        title={'Quote Request - ' + quoteRequest.description + ''}
        burgerMenu={[
          {
            option: 'Respond',
            onClick() {
              router.push({ pathname: 'quote-response', query: { id } });
            },
          },
          {
            option: 'Reject',
            onClick() {
              alert('Quote Request ' + String(quoteRequest.id) + ' Rejected.');
            },
          },
        ]}
      />
      <div className={styles.content}>
        <div className={styles['field-container']}>
          <div className={styles['date-container']}>
            <span className={styles['date-text']}>ID: {quoteRequest.id}</span>
            <span className={styles['date-text']}>Date:</span>
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Vehicle Information</span>
          <div className={styles['field-container']}>
            <FieldLabel label="Manufacturer" />
            <TextInput value="" disabled onChange={noChange} />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Model" />
            <TextInput value="" disabled onChange={noChange} />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Model Year" />
            <TextInput value="" disabled onChange={noChange} />
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Customer Information</span>
          <div className={styles['field-container']}>
            <FieldLabel label="Customer First Name" />
            <TextInput value={quoteRequest.customer.first_name} disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Customer Last Name" />
            <TextInput value={quoteRequest.customer.last_name} disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Customer Email" />
            <TextInput value={quoteRequest.customer.email} disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Customer Phone Number" />
            <TextInput value={quoteRequest.customer.phone_number} disabled onChange={noChange} />
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Additional Information</span>
          <div className={styles['field-container']}>
            <FieldLabel label="Part Condition" />
            <TextInput value="" disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Part Type" />
            <TextInput value="" disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Notes" />
            <TextInput value="" disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <div className={styles['images-field-container']}>
              <FieldLabel label="Images" />
              <div className={styles['images-container']}>
                <span className={styles['images-text']}>image1.jpg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuoteRequestsPage;
