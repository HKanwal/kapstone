import type { GetServerSideProps, NextPage } from 'next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequest.module.css';
import carData from '../data/data.json';
import validateEmail from '../utils/validateEmail';
import TextArea from '../components/TextArea';
import DropdownField from '../components/DropdownField';
import FieldLabel from '../components/FieldLabel';
import Link from '../components/Link';
import DatePickerField from '../components/DatePickerField';
import TimeRangeField from '../components/TimeRangeField';
import axios from 'axios';
import Cookies from 'js-cookie';
import apiUrl from '../constants/api-url';
import { Router, useRouter } from 'next/router';
// @ts-ignore
import * as cookie from 'cookie';
import TextInput from '../components/TextInput';
import { CardMultiSelect } from '../components/CardComponents';

const QuoteResponsePage: NextPage = ({ quoteRequest, shop }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [service, setService] = useState('');
  const [customService, setCustomService] = useState('');
  const [price, setPrice] = useState('');
  const [labourCost, setLabourCost] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [expiraryDate, setExpiraryDate] = useState('2025-01-01');
  const [partsList, setPartsList] = useState([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [partsCost, setPartsCost] = useState('');

  useEffect(() => {
    setSelectedParts;
    setPartsCost(
      String(
        selectedParts
          .map((part) => {
            return part.split('$')[1];
          })
          .reduce((partialSum, a) => partialSum + Number(a), 0)
      )
    );
    setPrice(String(Number(labourCost) + Number(partsCost)));
  });

  const handleServiceSelect = (item: any) => {
    setService(item);
    if (!['Other', ''].includes(item)) {
      setLabourCost(shop.shop_services.find((s: any) => s.name === item).price);
      setPartsList(shop.shop_services.find((s: any) => s.name === item).parts);
      console.log();
    } else {
      setLabourCost('');
      setPartsList([]);
      setSelectedParts([]);
    }
  };

  const handleSubmit = () => {
    const access_token = Cookies.get('access');
    fetch(`${apiUrl}/quotes/quotes/`, {
      method: 'POST',
      body: JSON.stringify({
        status: 'new_quote',
        price: price,
        estimated_time: estimatedTime,
        expiry_date: expiraryDate,
        quote_request: id,
      }),
      headers: {
        Authorization: `JWT ${access_token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }).then((response) => {
      console.log(response);
      if (response.status === 201) {
        router.push({ pathname: '/quote-list' });
      }
      response.json().then((response) => {
        console.log(response);
      });
    });
  };

  return (
    <div className={styles.container}>
      <Header title={`Quote Response - ${quoteRequest.description}`} />

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles['field-container']}>
            <DropdownField
              name="Service"
              placeholder="Add Required Service"
              items={shop.shop_services
                .map((service: any) => {
                  return service.name;
                })
                .concat('Other')}
              onSelect={(item) => handleServiceSelect(item)}
              required
            />
          </div>
          {service === 'Other' ? (
            <div className={styles['field-container']}>
              <TextField
                name="Custom Service"
                placeholder="Enter Custom Service"
                onChange={setCustomService}
                required
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className={styles.section}>
          <div className={styles['field-container']}>
            <FieldLabel label="Labour Cost ($)" required />
            <TextInput
              placeholder="Enter Labour Cost"
              onChange={setLabourCost}
              value={labourCost}
            />
          </div>
          <div className={styles.section}>
            <div className={styles['field-container']}>
              <TextField
                name="Estimated Time"
                placeholder="Enter Estimated Time"
                onChange={setEstimatedTime}
                required
              />
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles['section-header']}>Part Information</span>
            <div className={styles['field-container']}>
              <CardMultiSelect
                fieldLabel={'Parts Needed'}
                fieldData={partsList.map((part: any) => {
                  return `${part.name} | $${part.price}`;
                })}
                fieldValues={selectedParts}
                onChange={setSelectedParts}
                fieldPlaceholder="Add Required Parts"
                fieldSearchable
              />
              {selectedParts.length > 0 ? (
                <span className={styles['price-text']}>Total Parts Cost: ${partsCost}</span>
              ) : (
                <></>
              )}
            </div>
            {/* <div className={styles['field-container']}>
            <TextField name="Parts Needed" placeholder="Add Required Part" />
              <TextField name="Part Price" placeholder="Add Required Part Price" />
            </div> */}
          </div>
          <div className={styles.section}>
            <span className={styles['section-header']}>Additional Information</span>
            <div className={styles['field-container']}>
              <TextArea name="Notes" placeholder="Enter Notes" />
            </div>
          </div>
        </div>
        <span className={styles['section-header']}>Total Cost: ${price}</span>
        {/* 
        <div className={styles.section}>
          <div className={styles['field-container']}>
            <DropdownField
              name="Discount Type"
              placeholder="Select Discount Type"
              items={['new customer', 'employee', 'friends & family']}
            />
          </div>
          <div className={styles['field-container']}>
            <TextField name="Discount Amount" placeholder="Enter Discount Amount" />
          </div>
        </div>*/}
        <Button title="Submit Quote" width="80%" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { id } = context.query;
  console.log(id);
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  try {
    const shop = await axios.get(`${apiUrl}/shops/shops/me`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const quoteRequest = await axios.get(`${apiUrl}/quotes/quote-requests/${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        shop: shop.data,
        quoteRequest: quoteRequest.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default QuoteResponsePage;
