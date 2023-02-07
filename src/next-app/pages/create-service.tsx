import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequest.module.css';
import TextArea from '../components/TextArea';
import DropdownField from '../components/DropdownField';
import FieldLabel from '../components/FieldLabel';
import Link from '../components/Link';

const ServicesPage: NextPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [parts, setParts] = useState([]);
  const [isActive, setIsActive] = useState('Inactive');

  let valid = false;
  if (name.length > 0 && description.length > 0 && price.length > 0 && parts.length > 0) {
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
              placeholder="Enter services..."
              items={['Muffler', 'Headlight', 'Bumper']}
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
            console.log('TODO: handle submit');
          }}
        />
      </div>
    </div>
  );
};

export default ServicesPage;
