import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequestList.module.css';
import { useRouter } from 'next/router';
import apiUrl from '../constants/api-url';

const QuoteRequestListPage: NextPage = () => {
  const router = useRouter();
  const [quoteRequests, setQuoteRequests] = useState('');
  const [quoteRequestCards, setQuoteRequestCards] = useState([] as JSX.Element[]);

  const sampleData = [
    { descriprion: "This is a test description for a quote request", dateCreated: '12/06/2022' },
    { descriprion: "This is a test description for another quote request", dateCreated: '12/06/2022' },
  ];

  useEffect(() => {
    const cards: JSX.Element[] = [];
    fetch(`${apiUrl}/quotes/quote-requests/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }).then((data) => { console.log(data) });
    sampleData.forEach((quoteRequest) => {
      cards.push(
        <div className={styles.card}>
          <div className={styles["description-container"]}>
            {quoteRequest.descriprion}
          </div>
          <div className={styles["date-container"]}>
            {quoteRequest.dateCreated}
          </div>
        </div >);
    });
    setQuoteRequestCards(cards);
  }, []);

  return (
    <div className={styles.container}>
      <Header title="Quote Requests" />
      <div className={styles["card-container"]}>
        {quoteRequestCards}
      </div>
    </div>
  )
};

export default QuoteRequestListPage;
