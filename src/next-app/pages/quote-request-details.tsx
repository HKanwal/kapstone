/* eslint-disable indent */
import type { GetServerSideProps, NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequestDetails.module.css';
import Dropdown from '../components/Dropdown';
import FieldLabel from '../components/FieldLabel';
import TextInput from '../components/TextInput';
import Card from '../components/Card';
import { quotes } from '../data/QuoteData';
import { useRouter } from 'next/router';
import apiUrl from '../constants/api-url';
import axios from 'axios';
import { AuthContext } from '../utils/api';
import Cookies from 'js-cookie';
import { accountTypes } from '../utils/api';
// @ts-ignore
import * as cookie from 'cookie';

const QuoteRequestDetailsPage: NextPage = ({ quotes, quoteRequest, vehicle, shops }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [authData, setAuthData] = useState(useContext(AuthContext));
  const [status, setStatus] = useState('All');
  const [sortItem, setSortItem] = useState('Date');

  function noChange(): void {
    throw new Error('Function not implemented.');
  }

  if (authData.access !== '') {
  } else if (Cookies.get('access') && Cookies.get('access') !== '') {
    setAuthData({
      access: Cookies.get('access') as string,
      refresh: Cookies.get('refresh') as string,
      user_type: Cookies.get('user_type') as accountTypes,
    });
  }

  const quotesList = quotes.filter((quote: any) => {
    if (quote.quote_request === quoteRequest.id) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <div className={styles.container}>
      <Header
        title={`Quote Request - ${quoteRequest.description}`}
        burgerMenu={[
          {
            option: 'Edit',
            // onClick() {
            //   router.push('/quote-request-edit');
            // },
          },
          { option: 'Delete' },
        ]}
      />
      <div className={styles.content}>
        <div className={styles['field-container']}>
          <div className={styles['date-container']}>
            <span className={styles['date-text']}>Date: {quoteRequest.preferred_date}</span>
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
              ? quotesList
                  .filter((quote: any) =>
                    quote.status == 'new_quote'
                      ? status == 'Pending' && quote.status == 'new_quote'
                      : quote.status == status
                  )
                  .sort((a: any, b: any) => (Date.parse(a.date) < Date.parse(b.date) ? -1 : 1))
                  .map((quote: any) => {
                    return (
                      <Card
                        key={quote.id}
                        id={quote.id}
                        name={shops.find((shop: any) => shop.id === quote.shop).name}
                        status={quote.status === 'new_quote' ? 'Pending' : quote.status}
                        date={quote.expiry_date}
                        price={quote.price}
                      />
                    );
                  })
              : status == 'Accepted' && sortItem == 'Date'
              ? quotesList
                  .filter((quote: any) => quote.status == status)
                  .sort((a: any, b: any) => (Date.parse(a.date) < Date.parse(b.date) ? -1 : 1))
                  .map((quote: any) => {
                    return (
                      <Card
                        key={quote.id}
                        id={quote.id}
                        name={shops.find((shop: any) => shop.id === quote.shop).name}
                        status={quote.status === 'new_quote' ? 'Pending' : quote.status}
                        date={quote.expiry_date}
                        price={quote.price}
                      />
                    );
                  })
              : status == 'Accepted' && sortItem == 'Price'
              ? quotesList
                  .filter((quote: any) => quote.status == status)
                  .sort((a: any, b: any) => (a.price && b.price && a.price > b.price ? 1 : -1))
                  .map((quote: any) => {
                    return (
                      <Card
                        key={quote.id}
                        id={quote.id}
                        name={shops.find((shop: any) => shop.id === quote.shop).name}
                        status={quote.status === 'new_quote' ? 'Pending' : quote.status}
                        date={quote.expiry_date}
                        price={quote.price}
                      />
                    );
                  })
              : quotesList
                  .sort((a: any, b: any) => (Date.parse(a.date) < Date.parse(b.date) ? -1 : 1))
                  .map((quote: any) => {
                    return (
                      <Card
                        key={quote.id}
                        id={quote.id}
                        name={shops.find((shop: any) => shop.id === quote.shop).name}
                        status={quote.status === 'new_quote' ? 'Pending' : quote.status}
                        date={quote.expiry_date}
                        price={quote.price}
                      />
                    );
                  })}
          </div>
        </div>

        <div className={styles.section}>
          <span className={styles['section-header']}>Vehicle Information</span>
          <div className={styles['field-container']}>
            <FieldLabel label="Manufacturer" />
            <TextInput value={vehicle.manufacturer} disabled onChange={noChange} />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Model" />
            <TextInput value={vehicle.model} disabled onChange={noChange} />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Model Year" />
            <TextInput value={vehicle.year} disabled onChange={noChange} />
          </div>
        </div>

        <div className={styles.section}>
          <span className={styles['section-header']}>Additional Information</span>
          <div className={styles['field-container']}>
            <FieldLabel label="Part Condition" />
            <TextInput value="No Preference" disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Part Type" />
            <TextInput value="No Preference" disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Notes" />
            <TextInput value={quoteRequest.description} disabled onChange={noChange} />
          </div>
          <div className={styles['field-container']}>
            <div className={styles['images-field-container']}>
              <FieldLabel label="Images" />
              <div className={styles['images-container']}>
                <span className={styles['no-images-text']}>no images uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { id } = context.query;
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  try {
    const quotes = await axios.get(`${apiUrl}/quotes/quotes`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const quoteRequest = await axios.get(`${apiUrl}/quotes/quote-requests/${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const vehicle = await axios.get(`${apiUrl}/vehicles/vehicles/${quoteRequest.data.vehicle}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const shops = await axios.get(`${apiUrl}/shops/shops/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        quotes: quotes.data,
        quoteRequest: quoteRequest.data,
        vehicle: vehicle.data,
        shops: shops.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default QuoteRequestDetailsPage;
