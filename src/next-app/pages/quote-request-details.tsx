/* eslint-disable indent */
import type { GetServerSideProps, NextPage } from 'next';
import { useContext, useState } from 'react';
import * as yup from 'yup';
import { useFormik, FormikProvider } from 'formik';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequestDetails.module.css';
import Dropdown from '../components/Dropdown';
import FieldLabel from '../components/FieldLabel';
import Card from '../components/Card';
import { GrFormEdit, GrFormClose } from 'react-icons/gr';
import { useRouter } from 'next/router';
import apiUrl from '../constants/api-url';
import axios from 'axios';
import { AuthContext } from '../utils/api';
import Cookies from 'js-cookie';
import { accountTypes } from '../utils/api';
// @ts-ignore
import * as cookie from 'cookie';
import { CardTextField, CardTextArea, CardSelect } from '../components/CardComponents';
import Button from '../components/Button';
import Link from 'next/link';

const QuoteRequestDetailsPage: NextPage = ({ quotes: quotesList, quoteRequest, vehicle }: any) => {
  const router = useRouter();
  const { batch_id } = router.query;
  const [authData, setAuthData] = useState(useContext(AuthContext));
  const [status, setStatus] = useState('All');
  const [sortItem, setSortItem] = useState('Date');
  const [inEdit, setInEdit] = useState(false);
  const [errors, setErrors] = useState([]);

  const schema = yup.object().shape({
    description: yup.string().required(),
    vehicle: yup.object().shape({
      manufacturer: yup.string().required(),
      model: yup.string().required(),
      color: yup.string().optional(),
      year: yup.number().required().positive().integer(),
    }),
  });
  const form = useFormik({
    initialValues: {
      description: quoteRequest.description,
      part_condition: quoteRequest.preferred_part_condition ?? 'none',
      part_type: quoteRequest.preferred_part_type ?? 'none',
      vehicle: {
        manufacturer: vehicle.manufacturer,
        model: vehicle.model,
        color: vehicle.color,
        year: vehicle.year,
      },
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const vehicleValuesToSend = {
        manufacturer: values.vehicle.manufacturer,
        model: values.vehicle.model,
        color: values.vehicle.color,
        year: values.vehicle.year,
      };

      const qrValuesToSend = {
        batch_id: batch_id,
        description: values.description,
        preferred_part_condition: values.part_condition === 'none' ? null : values.part_condition,
        preferred_part_type: values.part_type === 'none' ? null : values.part_type,
      };

      const access_token = Cookies.get('access');

      try {
        const res = await axios.patch(
          `${apiUrl}/vehicles/vehicles/${quoteRequest.vehicle}/`,
          vehicleValuesToSend,
          {
            headers: { Authorization: `JWT ${access_token}` },
          }
        );
        if (res.status === 200) {
          try {
            const res = await axios.patch(
              `${apiUrl}/quotes/quote-requests/bulk_patch/`,
              qrValuesToSend,
              {
                headers: { Authorization: `JWT ${access_token}` },
              }
            );
            if (res.status === 200) {
              router.reload();
            }
          } catch (error: any) {
            setErrors(error.response.data.errors);
            scrollTo(0, 0);
          }
        }
      } catch (error: any) {
        setErrors(error.response.data.errors);
        scrollTo(0, 0);
      }
    },
  });

  if (authData.access !== '') {
  } else if (Cookies.get('access') && Cookies.get('access') !== '') {
    setAuthData({
      access: Cookies.get('access') as string,
      refresh: Cookies.get('refresh') as string,
      user_type: Cookies.get('user_type') as accountTypes,
    });
  }

  const date = new Date(quoteRequest.created_at);
  const dateString = date.toDateString();
  return (
    <div className={styles.container}>
      <Header
        title={`Quote Request - ${
          quoteRequest.description.length > 10
            ? quoteRequest.description.slice(0, 10) + '...'
            : quoteRequest.description
        }`}
        backButtonPath="/quote-request-list"
        rightIcon={inEdit ? GrFormClose : GrFormEdit}
        onRightIconClick={() => setInEdit(!inEdit)}
      />
      <div className={styles.content}>
        <div className={styles['field-container']}>
          <div className={styles['date-container']}>
            <span className={styles['date-text']}>Date: {dateString}</span>
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
            {status === 'Pending' ? (
              <div className={styles['filter-container']}>
                <Dropdown name="Sort By" items={['Date', 'Price']} onSelect={setSortItem} />
              </div>
            ) : (
              <></>
            )}

            {status != 'All' && status != 'Pending' ? (
              quotesList
                .filter((quote: any) => quote.status_display == status)
                .sort((a: any, b: any) => (Date.parse(a.date) < Date.parse(b.date) ? -1 : 1))
                .map((quote: any) => {
                  return (
                    <Card
                      key={quote.id}
                      id={quote.id}
                      name={
                        quote.shop.name.length > 14
                          ? quote.shop.name.slice(0, 14) + '...'
                          : quote.shop.name
                      }
                      status={quote.status === 'new_quote' ? 'Pending' : quote.status_display}
                      date={quote.created_at}
                      price={quote.price}
                    />
                  );
                })
            ) : status == 'Pending' && sortItem == 'Date' ? (
              quotesList
                .filter((quote: any) =>
                  quote.status == 'new_quote'
                    ? status == 'Pending' && quote.status == 'new_quote'
                    : quote.status_display == status
                )
                .sort((a: any, b: any) => (Date.parse(a.date) < Date.parse(b.date) ? -1 : 1))
                .map((quote: any) => {
                  return (
                    <Card
                      key={quote.id}
                      id={quote.id}
                      name={
                        quote.shop.name.length > 14
                          ? quote.shop.name.slice(0, 14) + '...'
                          : quote.shop.name
                      }
                      status={quote.status === 'new_quote' ? 'Pending' : quote.status_display}
                      date={quote.created_at}
                      price={quote.price}
                    />
                  );
                })
            ) : status == 'Pending' && sortItem == 'Price' ? (
              quotesList
                .filter((quote: any) =>
                  quote.status == 'new_quote'
                    ? status == 'Pending' && quote.status == 'new_quote'
                    : quote.status_display == status
                )
                .sort((a: any, b: any) => (a.price && b.price && a.price > b.price ? -1 : 1))
                .map((quote: any) => {
                  return (
                    <Card
                      key={quote.id}
                      id={quote.id}
                      name={
                        quote.shop.name.length > 14
                          ? quote.shop.name.slice(0, 14) + '...'
                          : quote.shop.name
                      }
                      status={quote.status === 'new_quote' ? 'Pending' : quote.status_display}
                      date={quote.created_at}
                      price={quote.price}
                    />
                  );
                })
            ) : quotesList.length > 0 ? (
              quotesList
                .sort((a: any, b: any) => (Date.parse(a.date) < Date.parse(b.date) ? -1 : 1))
                .map((quote: any) => {
                  return (
                    <Link key={quote.id} href={`/quote?id=${quote.id}`}>
                      <Card
                        id={quote.id}
                        name={
                          quote.shop.name.length > 14
                            ? quote.shop.name.slice(0, 14) + '...'
                            : quote.shop.name
                        }
                        status={quote.status === 'new_quote' ? 'Pending' : quote.status_display}
                        date={quote.created_at}
                        price={quote.price}
                      />
                    </Link>
                  );
                })
            ) : (
              <div className={styles['container']}>
                <span className={styles['no-quotes-text']}>No Quotes Received</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="wrapper">
          <div className="flex flex-col row-gap-large">
            {errors.length > 0 && (
              <div className="flex flex-col row-gap-small">
                {errors.map((error: any, index) => {
                  return (
                    <span className="error" key={`error_${index}`}>
                      {error.detail}
                    </span>
                  );
                })}
              </div>
            )}
            <FormikProvider value={form}>
              <form onSubmit={form.handleSubmit}>
                <h2 className="form-header">Quote Request Details</h2>
                <div className={`card${inEdit ? 'edit' : ''}`} style={{ marginBottom: '12px' }}>
                  <h1 className="form-header">Vehicle Information</h1>
                  <CardTextField
                    fieldValue={form.values.vehicle.manufacturer}
                    fieldName="vehicle.manufacturer"
                    fieldLabel="Manufacturer"
                    fieldType="string"
                    fieldDisabled={!inEdit}
                    onChange={form.handleChange}
                    error={form.errors.vehicle?.manufacturer}
                  />
                  <CardTextField
                    fieldValue={form.values.vehicle.model}
                    fieldName="vehicle.model"
                    fieldLabel="Model"
                    fieldType="string"
                    fieldDisabled={!inEdit}
                    onChange={form.handleChange}
                    error={form.errors.vehicle?.model}
                  />
                  <CardTextField
                    fieldValue={form.values.vehicle.year}
                    fieldName="vehicle.year"
                    fieldLabel="Model Year"
                    fieldType="number"
                    fieldDisabled={!inEdit}
                    onChange={form.handleChange}
                    error={form.errors.vehicle?.year}
                  />
                  <h1 className="form-header">Additional Information</h1>
                  <CardSelect
                    fieldName="part_condition"
                    fieldLabel="Part Condition"
                    options={[
                      {
                        label: 'No Preference',
                        value: 'none',
                      },
                      {
                        label: 'New Parts Only',
                        value: 'new',
                      },
                      {
                        label: 'Used Parts Only',
                        value: 'used',
                      },
                    ].map((op: any) => {
                      return (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      );
                    })}
                    fieldDisabled={!inEdit}
                  />
                  <CardSelect
                    fieldName="part_type"
                    fieldLabel="Part Type"
                    options={[
                      {
                        label: 'No Preference',
                        value: 'none',
                      },
                      {
                        label: 'OEM Parts Only',
                        value: 'oem',
                      },
                      {
                        label: 'Aftermarket Parts Only',
                        value: 'aftermarket',
                      },
                    ].map((op: any) => {
                      return (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      );
                    })}
                    fieldDisabled={!inEdit}
                  />
                  <CardTextArea
                    fieldValue={form.values.description}
                    fieldName="description"
                    fieldLabel="Notes"
                    fieldDisabled={!inEdit}
                    onChange={form.handleChange}
                    error={form.errors.description}
                  />
                  <FieldLabel label="Images" />
                  <div className={styles['images-container']}>
                    {quoteRequest.images && quoteRequest.images.length > 0 ? (
                      quoteRequest.images.map((image: any, index: number) => {
                        return (
                          <img
                            src={`${apiUrl}${image.url}`}
                            className={styles.image}
                            key={`image_${index}`}
                          />
                        );
                      })
                    ) : (
                      <span className={styles['no-images-text']}>no images uploaded</span>
                    )}
                  </div>
                  {inEdit && <Button type="submit" title="Save" width={'100%'}></Button>}
                </div>
              </form>
            </FormikProvider>
            {/* {inEdit ? (
              <Button
                title="Delete"
                margin="0 0 4vw 0"
                width="100%"
                backgroundColor="red"
                onClick={async () => {
                  const access_token = Cookies.get('access');
                  try {
                    const res = await axios.delete(
                      `${apiUrl}/quotes/quote-requests/${quoteRequest.id}/`,
                      {
                        headers: { Authorization: `JWT ${access_token}` },
                      }
                    );
                    if (res.status === 204) {
                      router.push('/quote-request-list');
                    }
                  } catch (error: any) {
                    scrollTo(0, 0);
                  }
                }}
              />
            ) : null} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { batch_id } = context.query;
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  try {
    const quotes = await axios.get(`${apiUrl}/quotes/quotes?batch_id=${batch_id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const quoteRequestBatch = await axios.get(
      `${apiUrl}/quotes/quote-requests/batch_retrieve?batch_id=${batch_id}`,
      {
        headers: { Authorization: `JWT ${access_token}` },
      }
    );
    console.log(quoteRequestBatch);
    const vehicle = quoteRequestBatch.data.vehicle
      ? await axios.get(`${apiUrl}/vehicles/vehicles/${quoteRequestBatch.data.vehicle}`, {
          headers: { Authorization: `JWT ${access_token}` },
        })
      : null;
    console.log(quoteRequestBatch.data);
    return {
      props: {
        quotes: quotes.data,
        quoteRequest: quoteRequestBatch.data,
        vehicle: vehicle ? vehicle.data : {},
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
