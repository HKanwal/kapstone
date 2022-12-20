import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequestList.module.css';
import QuoteRequestCard from '../components/QuoteRequestCard';
import { useRouter } from 'next/router';
import apiUrl from '../constants/api-url';

const QuoteRequestListPage: NextPage = () => {
  const router = useRouter();
  const [quoteRequestCards, setQuoteRequestCards] = useState([] as JSX.Element[]);

  const sampleData = [
    { description: "This is a test description for a quote request", dateCreated: '2022-12-17T06:25:24Z', id: 0 },
    { description: "This is a test description for a quote request", dateCreated: '2022-11-17T06:25:24Z', id: 1 },
    { description: "This is a test description for a quote request", dateCreated: '2022-10-17T06:25:24Z', id: 2 },
    { description: "This is a test description for a quote request", dateCreated: '2022-12-17T12:25:24Z', id: 3 },
    { description: "This is a test description for a quote request", dateCreated: '2022-12-17T06:25:24Z', id: 4 },
    { description: "This is a test description for a quote request", dateCreated: '2022-12-20T06:25:24Z', id: 5 },
    { description: "This is a test description for another quote request", dateCreated: '2022-12-19T06:25:24Z', id: 6 },
    { description: "This is a really long test decription for the quote request. The purpose of this is to test the character cut off limit.", dateCreated: '2022-12-18T06:25:24Z', id: 7 },
  ];

  useEffect(() => {
    const cards: JSX.Element[] = [];
    fetch(`${apiUrl}/quotes/quote-requests/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }).then((data) => { console.log(data) });

    // TODO: Replace sample data with API data and place in above .then handler
    sampleData.sort((a, b) => {
      let keyA = new Date(a.dateCreated);
      let keyB = new Date(b.dateCreated);
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });
    sampleData.forEach((quoteRequest) => {
      cards.push(<QuoteRequestCard id={quoteRequest.id} description={quoteRequest.description} dateCreated={quoteRequest.dateCreated} />)
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
