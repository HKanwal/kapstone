/* eslint-disable indent */
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import styles from '../../styles/pages/QuoteRequestDetails.module.css';
import Dropdown from '../../components/Dropdown';
import FieldLabel from '../../components/FieldLabel';
import TextInput from '../../components/TextInput';
import Card from '../../components/Card';
import { quotes } from '../../data/QuoteData';
import { useRouter } from 'next/router';
import axios from 'axios';
import apiUrl from '../../constants/api-url';
import Cookies from 'js-cookie';

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

const sampleVehicle = {
  vin: 'string',
  manufacturer: 'string',
  model: 'string',
  color: 'string',
  year: 1950,
  customer: 0,
};

const ViewQuoteRequestsPage: NextPage = ({ quoteRequest, vehicle }: any) => {
  const router = useRouter();
  const { id } = router.query;
  console.log(quoteRequest);
  console.log(vehicle);
  function noChange(): void {
    throw new Error('Function not implemented.');
  }

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
            <span className={styles['date-text']}>Date: {quoteRequest.preferred_date}</span>
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Vehicle Information</span>
          <div className={styles['field-container']}>
            <FieldLabel label="Manufacturer" />
            <TextInput value={vehicle.manufacturer} disabled onChange={noChange} />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Model" />
            <TextInput value={vehicle.model} disabled onChange={noChange} />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Model Year" />
            <TextInput value={vehicle.year} disabled onChange={noChange} />
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
                <span className={styles['no-images-text']}>no images uploaded</span>
              </div>
            </div>
          </div>
        </div>
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
        vehicle: vehicle.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        quoteRequest: sampleQuoteRequest,
        vehicle: sampleVehicle,
      },
    };
  }
};

export default ViewQuoteRequestsPage;
