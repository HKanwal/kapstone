import type { NextPage } from 'next';
import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequestList.module.css';
import QuoteRequestCard from '../components/QuoteRequestCard';
import { useRouter } from 'next/router';
import apiUrl from '../constants/api-url';
import { IoIosAdd } from 'react-icons/io';
import { AuthContext, accountTypes } from '../utils/api';
import Cookies from 'js-cookie';
import { GrAddCircle } from 'react-icons/gr';

const QuoteRequestListPage: NextPage = () => {
  const router = useRouter();
  const [quoteRequestCards, setQuoteRequestCards] = useState([] as JSX.Element[]);
  const [authData, setAuthData] = useState(useContext(AuthContext));

  if (authData.access !== '') {
  } else if (Cookies.get('access') && Cookies.get('access') !== '') {
    setAuthData({
      access: Cookies.get('access') as string,
      refresh: Cookies.get('refresh') as string,
      user_type: Cookies.get('user_type') as accountTypes,
    });
  }

  useEffect(() => {
    const cards: JSX.Element[] = [];
    fetch(`${apiUrl}/quotes/quote-requests/`, {
      method: 'GET',
      headers: {
        Authorization: `JWT ${authData.access}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }).then((data) => {
      console.log(data);
      data.json().then((data) => {
        console.log(data);
        data.forEach((quoteRequest: any) => {
          //console.log(quoteRequest);
          // cards.push(<QuoteRequestCard id={quoteRequest.id} description={quoteRequest.description} dateCreated={quoteRequest.dateCreated} />)
          cards.push(
            <QuoteRequestCard
              key={quoteRequest.id}
              id={quoteRequest.id}
              description={quoteRequest.description}
              dateCreated={quoteRequest.created_at}
            />
          );
        });
        setQuoteRequestCards(cards);
      });
    });

    // TODO: Replace sample data with API data and place in above .then handler
    // sampleData.sort((a, b) => {
    //   let keyA = new Date(a.dateCreated);
    //   let keyB = new Date(b.dateCreated);
    //   if (keyA < keyB) return 1;
    //   if (keyA > keyB) return -1;
    //   return 0;
    // });
    // sampleData.forEach((quoteRequest) => {
    //   cards.push(<QuoteRequestCard id={quoteRequest.id} description={quoteRequest.description} dateCreated={quoteRequest.dateCreated} />)
    // });
  }, []);

  const handleAddClick = () => {
    router.push('/quote-request');
  };

  return (
    <div className={styles.container}>
      <Header title="Quote Requests" rightIcon={GrAddCircle} onRightIconClick={handleAddClick} />
      <div className={styles['card-container']}>{quoteRequestCards}</div>
    </div>
  );
};

export default QuoteRequestListPage;
