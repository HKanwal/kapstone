/* eslint-disable indent */
import type { NextPage } from 'next';
import { useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequestDetails.module.css';
import Dropdown from '../components/Dropdown';
import FieldLabel from '../components/FieldLabel';
import TextInput from '../components/TextInput';
import Card from '../components/Card';
import { quotes } from '../data/QuoteData';
import { useRouter } from 'next/router'

const QuoteRequestDetailsPage: NextPage = (props) => {
  const [status, setStatus] = useState('All');
  const [sortItem, setSortItem] = useState('Date');
  const router = useRouter();
  console.log(router.query);

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
              </div>
            ) : (
              <></>
            )}
            {status != 'All' && status != 'Accepted'
              ? quotes
                .filter((quote) => quote.status == status)
                .sort((a, b) => (Date.parse(a.date) < Date.parse(b.date) ? -1 : 1))
                .map((item, index) => {
                  return (
                    <Card
                      key={index}
                      name={item['shop-name']}
                      status={item.status}
                      date={item.date}
                      price={item.price}
                      id={item.id}
                    />
                  );
                })
              : status == 'Accepted' && sortItem == 'Date'
                ? quotes
                  .filter((quote) => quote.status == status)
                  .sort((a, b) => (Date.parse(a.date) < Date.parse(b.date) ? -1 : 1))
                  .map((item, index) => {
                    return (
                      <Card
                        key={index}
                        name={item['shop-name']}
                        status={item.status}
                        date={item.date}
                        price={item.price}
                        id={item.id}
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
                          id={item.id}
                        />
                      );
                    })
                  : quotes
                    .sort((a, b) => (Date.parse(a.date) < Date.parse(b.date) ? -1 : 1))
                    .map((item, index) => {
                      return (
                        <Card
                          key={index}
                          name={item['shop-name']}
                          status={item.status}
                          date={item.date}
                          price={item.price}
                          id={item.id}
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

export default QuoteRequestDetailsPage;
