import type { NextPage } from 'next';
import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/Quote.module.css';
import { useRouter } from 'next/router';
import apiUrl from '../constants/api-url';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { AuthContext, accountTypes } from '../utils/api';
import Cookies from 'js-cookie';

type QuoteProps = {
  id: number;
  description: string;
  status: string;
  date: string;
  acceptedBy: string;
  partCost?: string;
  labourCost?: string;
  cost: string;
  estimatedTime: string;
  dueDate: string,
};

const Quote: NextPage = (props) => {
  const [quoteData, setQuoteData] = useState({} as QuoteProps);
  const [authData, setAuthData] = useState(useContext(AuthContext));

  const router = useRouter();
  const { id } = router.query;

  if (authData.access !== '') {
  } else if (Cookies.get('access') && Cookies.get('access') !== '') {
    setAuthData(
      {
        'access': Cookies.get('access') as string,
        'refresh': Cookies.get('refresh') as string,
        'user_type': Cookies.get('user_type') as accountTypes,
      }
    )
  }

  const sampleData = {
    id: 0,
    description: 'This is a test description for an accepted quote',
    status: 'Accepted',
    date: '2022-12-17T06:25:24Z',
    acceptedBy: 'Test Shop',
    partCost: '504.85',
    labourCost: '298.20',
    cost: '803.05',
    estimatedTime: '1 Week',
    dueDate: '2022-12-28T00:00:00Z',
    shopNumber: '123456789'
  };

  useEffect(() => {
    const tempData = sampleData;
    if (tempData.description.length > 30) {
      tempData.description = `${tempData.description.slice(0, 30)}...`
    }
    const dateString = new Date(sampleData.date).toDateString();
    tempData.date = dateString;

    const dueDateString = new Date(sampleData.dueDate).toDateString();
    tempData.dueDate = dueDateString;

    setQuoteData(tempData);
  }, []);

  const handleCallClick = () => {
    window.open(`tel:${sampleData.shopNumber}`);
  }

  if (id) {
    return (
      <div className={styles.container}>
        <Header title={`Quote - ${quoteData.description}`} burgerMenu={[{
          option: "Call Shop", onClick() {
            handleCallClick();
          },
        }]} />
        <div className={styles["quote-container"]}>
          <div className={styles["status-container"]}>
            <label>
              {`Status: ${quoteData.status}`}
            </label>
          </div>
          <div className={styles["cost-container"]}>
            <label>
              {`Cost: $${quoteData.cost}`}
            </label>
          </div>
          <div className={styles["date-container"]}>
            <label>
              {`Date: ${quoteData.date}`}
            </label>
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Accepted By"
              placeholder={quoteData.acceptedBy}
              disabled={true}
            />
          </div>
          {quoteData.partCost || quoteData.labourCost ? (
            < div className={styles.section}>
              <div className={styles['section-header']}>
                <label>
                  Cost Breakdown:
                </label>
              </div>
              {quoteData.partCost ? (
                <div className={styles['field-container']}>
                  <TextField
                    name="Parts Cost:"
                    placeholder={`$${quoteData.partCost}`}
                    disabled={true}
                  />
                </div>) : null}
              {quoteData.labourCost ? (
                <div className={styles['field-container']}>
                  <TextField
                    name="Labour Cost:"
                    placeholder={`$${quoteData.labourCost}`}
                    disabled={true}
                  />
                </div>) : null}
            </div>)
            : null}
          <div className={styles['field-container']}>
            <TextField
              name="Estimated Time:"
              placeholder={quoteData.estimatedTime}
              disabled={true}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Quote Expires On:"
              placeholder={quoteData.dueDate}
              disabled={true}
            />
          </div>
          <div className={styles['buttons-container']}>
            <div className={styles['reject-button']}>
              <Button
                title="Reject Quote"
                width="80%"
                backgroundColor="red"
                onClick={() => {
                  console.log(
                    'TODO: API call for rejecting quote'
                  );
                }}
              />
            </div>
            <div className={styles['accept-button']}>
              <Button
                title="Accept Quote"
                margin="0 0 0 9vw"
                width="80%"
                onClick={() => {
                  console.log(
                    'TODO: API call for accepting quote'
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div >
    )
  } else {
    return (
      <div className={styles.container}>
        <Header title={`Quote`} />
        <div className={styles['error-page-container']}>
          <label>
            No Quote Request Selected
          </label>
        </div>
      </div>
    )
  }
};

export default Quote;