/* eslint-disable indent */
import type { GetServerSideProps, NextPage } from 'next';
import Header from '../../components/Header';
import styles from '../../styles/pages/QuoteRequestDetails.module.css';
import FieldLabel from '../../components/FieldLabel';
import TextInput from '../../components/TextInput';
import { useRouter } from 'next/router';
import axios from 'axios';
import apiUrl from '../../constants/api-url';
import Cookies from 'js-cookie';
// @ts-ignore
import * as cookie from 'cookie';
import Button from '../../components/Button';

const ViewQuoteRequestsPage: NextPage = ({ quoteRequest, vehicle }: any) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className={styles.container}>
      <Header
        title={'Quote Request - ' + quoteRequest.description + ''}
        burgerMenu={[
          {
            option: 'Call Customer',
            onClick() {
              window.open(`tel: ${quoteRequest.customer.phone_number}`);
            },
          },
        ]}
      />
      <div className={styles.content}>
        <div className={styles['field-container']}>
          <div className={styles['date-container']}>
            <span className={styles['date-text']}>ID: {quoteRequest.id}</span>
            <span className={styles['date-text']}>Date: </span>
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Vehicle Information</span>
          <div className={styles['field-container']}>
            <FieldLabel label="Manufacturer" />
            <TextInput value={vehicle.manufacturer} disabled />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Model" />
            <TextInput value={vehicle.model} disabled />
          </div>

          <div className={styles['field-container']}>
            <FieldLabel label="Model Year" />
            <TextInput value={vehicle.year} disabled />
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Customer Information</span>
          <div className={styles['field-container']}>
            <FieldLabel label="Customer First Name" />
            <TextInput value={quoteRequest.customer.first_name} disabled />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Customer Last Name" />
            <TextInput value={quoteRequest.customer.last_name} disabled />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Customer Email" />
            <TextInput value={quoteRequest.customer.email} disabled />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Customer Phone Number" />
            <TextInput value={quoteRequest.customer.phone_number} disabled />
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Additional Information</span>
          <div className={styles['field-container']}>
            <FieldLabel label="Part Condition" />
            <TextInput value="" disabled />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Part Type" />
            <TextInput value="" disabled />
          </div>
          <div className={styles['field-container']}>
            <FieldLabel label="Notes" />
            <TextInput value={quoteRequest.description} disabled />
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
      <div className={styles['buttons-container']}>
        <div className={styles['reject-button']}>
          <Button
            title="Reject"
            margin="0 0 0 6vw"
            width="80%"
            backgroundColor="red"
            onClick={() => {
              console.log('TODO: API call for rejecting quote');
              router.push({
                pathname: '/new-quote-requests',
              });
            }}
          />
        </div>
        <div className={styles['accept-button']}>
          <Button
            title="Respond"
            margin="0 6vw 0 0"
            width="80%"
            onClick={() => {
              router.push({ pathname: '/quote-response', query: { id } });
            }}
          />
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
    const quoteRequest = await axios.get(`${apiUrl}/quotes/quote-requests/${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const vehicle = await axios.get(`${apiUrl}/vehicles/vehicles/${quoteRequest.data.vehicle}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        quoteRequest: quoteRequest.data,
        vehicle: vehicle.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default ViewQuoteRequestsPage;
