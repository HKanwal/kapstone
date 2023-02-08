import type { NextPage, GetServerSideProps } from 'next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import axios from 'axios';
import TextField from '../../components/TextField';
import Header from '../../components/Header';
import styles from '../../styles/pages/QuoteRequest.module.css';
import DropdownField from '../../components/DropdownField';
import apiUrl from '../../constants/api-url';

const ServicesPage: NextPage = ({ parts }: any) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [specifiedParts, setParts] = useState([]);
  const [isActive, setIsActive] = useState('Inactive');

  let valid = false;
  if (name.length > 0 && description.length > 0 && price.length > 0 && specifiedParts.length > 0) {
    valid = true;
  }

  return (
    <div className={styles.container}>
      <Header title="Create New Service" />

      <div className={styles.content}>
        <div className={styles.section}>
          <span className={styles['section-header']}>Service Information</span>
          <div className={styles['field-container']}>
            <TextField
              name="Service Name"
              placeholder="Enter service name"
              onChange={setName}
              required
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Service Description"
              placeholder="Enter a description of the service"
              onChange={setDescription}
              required
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Price"
              placeholder="Enter the price of the service"
              onChange={setPrice}
              required
            />
          </div>
          <div className={styles['field-container']}>
            <DropdownField
              type="multi-select"
              name="Required Parts"
              placeholder="Enter parts..."
              items={parts.map((part: any) => part.name)}
            />
          </div>
          <div className={styles['field-container']}>
            <DropdownField
              name="Service Availibility"
              placeholder="Is this service available at your shop?"
              items={['Available', 'Unavailable']}
              onSelect={setIsActive}
            />
          </div>
        </div>
        <Button
          title="Create"
          disabled={!valid}
          width="80%"
          onClick={() => {
            console.log();
          }}
        />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async () => {
  try {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc2MjQ0OTgzLCJqdGkiOiIxZDg4MTJhYTg5ZmI0N2JjYjFlODU3ODU4NWZjMDNjMyIsInVzZXJfaWQiOjE0OH0.vZ8GjUqu9NUbGX4um7MSoCWI6OQVZrFDZQmJ6I57tlI';
    const parts = await axios.get(`${apiUrl}/shops/service-parts/`, {
      headers: { Authorization: `JWT ${token}` },
    });
    return {
      props: {
        parts: parts.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        parts: [],
      },
    };
  }
};

export default ServicesPage;
