/* eslint-disable indent */
import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequestDetails.module.css';
import TextArea from '../components/TextArea';
import DropdownField from '../components/DropdownField';
import Dropdown from '../components/Dropdown';
import FieldLabel from '../components/FieldLabel';
import TextInput from '../components/TextInput';
import ShopCard from '../components/ShopCard';
import Card from '../components/Card';
import apiUrl from '../constants/api-url';
import { quotes } from '../data/QuoteData';

const QuoteRequestDetailsPage: NextPage = () => {
  const [status, setStatus] = useState('All');
  const [sortItem, setSortItem] = useState('');
  const [sortMethod, setSortMethod] = useState('');
  function noChange(): void {
    throw new Error('Function not implemented.');
  }
  return (
    <div className={styles.container}>
      <Header title="Quote Request - " />
      <div className={styles.content}>
        <div className={styles['field-container']}>
          <div className={styles['date-container']}>
            <span className={styles['date-text']}>Date:</span>
          </div>
        </div>

        <div className={styles.section}>
          <span className={styles['section-header']}>Quotes</span>
          <div className={styles['field-container']}>
            <div className={styles['filter-container']}>
              <Dropdown
                name="Filter By"
                items={['All', 'Accepted', 'Pending', 'Rejected']}
                onSelect={setStatus}
              />
            </div>
            {status === 'Accepted' ? (
              <div className={styles['filter-container']}>
                <Dropdown name="Sort By" items={['Date', 'Price']} onSelect={setSortItem} />
                {/**<Dropdown items={['High to low', 'Low to high']} onSelect={setSortMethod} />**/}
              </div>
            ) : (
              <></>
            )}
            {status != 'All' && status != 'Accepted'
              ? quotes
                  .filter((quote) => quote.status == status)
                  .map((item, index) => {
                    return (
                      <Card
                        key={index}
                        name={item['shop-name']}
                        status={item.status}
                        date={item.date}
                        price={item.price}
                      />
                    );
                  })
              : status == 'Accepted' && sortItem == 'Date'
              ? quotes
                  .filter((quote) => quote.status == status)
                  .sort((a, b) => (a.date > b.date ? -1 : 1))
                  .map((item, index) => {
                    return (
                      <Card
                        key={index}
                        name={item['shop-name']}
                        status={item.status}
                        date={item.date}
                        price={item.price}
                      />
                    );
                  })
              : status == 'Accepted' && sortItem == 'Price'
              ? quotes
                  .filter((quote) => quote.status == status)
                  .sort((a, b) => (a.price && b.price && a.price > b.price ? 1 : -1))
                  .map((item, index) => {
                    return (
                      <Card
                        key={index}
                        name={item['shop-name']}
                        status={item.status}
                        date={item.date}
                        price={item.price}
                      />
                    );
                  })
              : quotes.map((item, index) => {
                  return (
                    <Card
                      key={index}
                      name={item['shop-name']}
                      status={item.status}
                      date={item.date}
                      price={item.price}
                    />
                  );
                })}
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

/**export async function getQuotes() {
  const res = await fetch(`${apiUrl}/quotes/quotes/`)
  const data = await res.json()
  return{
    props: {
      quotes : data
    }
  }
}**/

export default QuoteRequestDetailsPage;
