import type { NextPage } from 'next';
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

const serviceList = ['a', 'b', 'c', 'd'];

const QuoteResponsePage: NextPage = () => {
  const [services, setServices] = useState<string[]>([]);

  console.log(services);
  return (
    <div className={styles.container}>
      <Header title="Quote Response - " />

      <div className={styles.content}>
        <div className={styles.section}>
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
        </div>
        <Button
          title="Submit Quote"
          width="80%"
          onClick={() => {
            console.log(
              'TODO: handle submit by verifying form, sending API request, and redirecting to find-shop'
            );
          }}
        />
      </div>
    </div>
  );
};

export default QuoteResponsePage;
