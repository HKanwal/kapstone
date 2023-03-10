import type { GetServerSideProps, NextPage } from 'next';
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
import TextField from '../components/TextField';
import axios from 'axios';
// @ts-ignore
import * as cookie from 'cookie';

const QuoteRequestListPage: NextPage = ({ quoteRequests }: any) => {
  const router = useRouter();
  const [quoteRequestCards, setQuoteRequestCards] = useState([] as JSX.Element[]);
  const [authData, setAuthData] = useState(useContext(AuthContext));
  const [modalVisible, setModalVisisble] = useState<boolean>(false);
  const [QRFilter, setQRFilter] = useState('');

  if (authData.access !== '') {
  } else if (Cookies.get('access') && Cookies.get('access') !== '') {
    setAuthData({
      access: Cookies.get('access') as string,
      refresh: Cookies.get('refresh') as string,
      user_type: Cookies.get('user_type') as accountTypes,
    });
  }

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
        backButtonPath="/dashboard"
        rightIcon={GrAddCircle}
        onRightIconClick={Cookies.get('access') ? handleAddClick : showModal}
      />
      <div className={styles['filter-container']}>
        <TextField name="Search" placeholder="Search by ID or description" onChange={setQRFilter} />
      </div>
      <div className={styles['card-container']}>
        {quoteRequests
          .filter((quoteRequest: any) => {
            if (
              QRFilter != '' &&
              !(
                quoteRequest.description.toLowerCase().includes(QRFilter.toLowerCase()) ||
                String(quoteRequest.id).startsWith(QRFilter)
              )
            )
              return false;
            else return true;
          })
          .sort((a: any, b: any) => (Date.parse(a.created_at) < Date.parse(b.created_at) ? 1 : -1))
          .map((quoteRequest: any) => {
            return (
              <QuoteRequestCard
                key={quoteRequest.id}
                id={Number(quoteRequest.id)}
                description={quoteRequest.description}
                dateCreated={quoteRequest.created_at}
              />
            );
          })}
      </div>
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

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  try {
    const quoteRequests = await axios.get(`${apiUrl}/quotes/quote-requests/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        quoteRequests: quoteRequests.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        quoteRequests: [],
      },
    };
  }
};

export default QuoteRequestListPage;
