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
import Modal from '../components/Modal';
import Button from '../components/Button';

const QuoteRequestListPage: NextPage = () => {
  const router = useRouter();
  const [quoteRequestCards, setQuoteRequestCards] = useState([] as JSX.Element[]);
  const [authData, setAuthData] = useState(useContext(AuthContext));
  const [modalVisible, setModalVisisble] = useState<boolean>(false);

  if (authData.access !== '') {
  } else if (Cookies.get('access') && Cookies.get('access') !== '') {
    setAuthData({
      access: Cookies.get('access') as string,
      refresh: Cookies.get('refresh') as string,
      user_type: Cookies.get('user_type') as accountTypes,
    });
  }
  useEffect(() => {
    if (Cookies.get('access')) {
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
    }
  }, []);

  const handleAddClick = () => {
    router.push('/quote-request');
  };

  const showModal = () => {
    setModalVisisble(true);
  };

  const hideModal = () => {
    setModalVisisble(false);
  };

  return (
    <div className={styles.container}>
      <Header
        title="Quote Requests"
        rightIcon={GrAddCircle}
        onRightIconClick={Cookies.get('access') ? handleAddClick : showModal}
      />
      <div className={styles['card-container']}>{quoteRequestCards}</div>
      <Modal visible={modalVisible} onClose={hideModal}>
        <div className={styles['modal-content']}>
          <div className={styles['modal-title-container']}>
            <span className={styles['modal-title']}>
              Login or Register to Access Quote Request Creation
            </span>
          </div>
          <div className={styles['modal-submit']}>
            <Button title="Log In" onClick={() => router.push('/login')} width="100%" />
          </div>
          <div className={styles['modal-submit']}>
            <Button title="Register" onClick={() => router.push('/create-account')} width="100%" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuoteRequestListPage;
