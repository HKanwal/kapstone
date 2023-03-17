import type { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useState, useContext, useRef } from 'react';
import Header from '../components/Header';
import styles from '../styles/pages/Quote.module.css';
import { useRouter } from 'next/router';
import apiUrl from '../constants/api-url';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { AuthContext, accountTypes } from '../utils/api';
import Cookies from 'js-cookie';
import axios from 'axios';
// @ts-ignore
import * as cookie from 'cookie';
import TextArea from '../components/TextArea';
import EditableTextArea from '../components/EditableTextArea';
import * as yup from 'yup';
import moment from 'moment-timezone';

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
  dueDate: string;
};

const Quote: NextPage = ({ quote, comments }: any) => {
  const [authData, setAuthData] = useState(useContext(AuthContext));
  const [quoteComments, setQuoteComments] = useState(comments);
  const [addingComment, setAddingComment] = useState(false);
  const newCommentRef = useRef<null | HTMLDivElement>(null);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (addingComment) {
      newCommentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [addingComment]);

  useEffect(() => {
    if (authData.access !== '') {
    } else if (Cookies.get('access') && Cookies.get('access') !== '') {
      setAuthData({
        access: Cookies.get('access') as string,
        refresh: Cookies.get('refresh') as string,
        user_type: Cookies.get('user_type') as accountTypes,
      });
    }
  }, [authData]);

  const handleCallClick = (callType: string) => {
    let phoneNumber = '';
    if (callType === 'shop') {
      phoneNumber = quote.shop.shop_phone_number;
    } else if (callType === 'customer') {
      phoneNumber = quote.quote_request.customer.phone_number;
    }
    window.open(`tel: ${phoneNumber}`);
  };

  const quoteCommentSchema = yup.object().shape({
    comment: yup.string().required(),
  });

  if (id) {
    return (
      <div className={styles.container}>
        <Header
          title={`Quote - ${
            quote.quote_request.description.length > 20
              ? quote.quote_request.description.slice(0, 20) + '...'
              : quote.quote_request.description
          }`}
          burgerMenu={
            authData.user_type === 'customer'
              ? [
                  {
                    option: 'Call Shop',
                    onClick() {
                      handleCallClick('shop');
                    },
                  },
                ]
              : authData.user_type === 'shop_owner'
              ? [
                  {
                    option: 'Call Customer',
                    onClick() {
                      handleCallClick('customer');
                    },
                  },
                ]
              : undefined
          }
        />
        <div className={styles['quote-container']}>
          <div className={styles['container']}>
            <div className={styles['status-container']}>
              <label>{`Status: ${
                quote.status === 'new_quote' ? 'Pending' : quote.status_display
              }`}</label>
            </div>
            <div className={styles['id-container']}>
              <label>{`ID: ${quote.id}`}</label>
            </div>
          </div>
          <div className={styles['cost-container']}>
            <label>{`Cost: $${quote.price}`}</label>
          </div>
          <div className={styles['date-container']}>
            <label>{`Date: ${new Date(quote.created_at).toDateString()}`}</label>
          </div>
          {authData.user_type === 'customer' ? (
            <div className={styles['field-container']}>
              <TextField name="Sent By" placeholder={quote.shop.name} disabled={true} />
            </div>
          ) : authData.user_type === 'shop_owner' || authData.user_type === 'employee' ? (
            <div className={styles['customer-container']}>
              <span className={styles['section-header']}>Customer Contact Information</span>
              <div className={styles['field-container']}>
                <TextField
                  name="First Name"
                  placeholder={quote.quote_request.customer.first_name}
                  disabled={true}
                />
              </div>
              <div className={styles['field-container']}>
                <TextField
                  name="Last Name"
                  placeholder={quote.quote_request.customer.last_name}
                  disabled={true}
                />
              </div>
              <div className={styles['field-container']}>
                <TextField
                  name="Phone Number"
                  placeholder={quote.quote_request.customer.phone_number}
                  disabled={true}
                />
              </div>
              <div className={styles['field-container']}>
                <TextField
                  name="Email"
                  placeholder={quote.quote_request.customer.email}
                  disabled={true}
                />
              </div>
            </div>
          ) : null}
          <div className={styles['section-header']}>
            <label>Quote Information</label>
          </div>
          {quote.partCost || quote.labourCost ? (
            <div className={styles.section}>
              <div className={styles['section-header']}>
                <label>Cost Breakdown:</label>
              </div>
              {quote.partCost ? (
                <div className={styles['field-container']}>
                  <TextField
                    name="Parts Cost:"
                    placeholder={`$${quote.partCost}`}
                    disabled={true}
                  />
                </div>
              ) : null}
              {quote.labourCost ? (
                <div className={styles['field-container']}>
                  <TextField
                    name="Labour Cost:"
                    placeholder={`$${quote.labourCost}`}
                    disabled={true}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
          <div className={styles['field-container']}>
            <TextField name="Estimated Time:" placeholder={quote.estimated_time} disabled={true} />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Quote Expires On:"
              placeholder={new Date(quote.expiry_date).toDateString()}
              disabled={true}
            />
          </div>
          <div className={styles['field-container']}>
            <TextArea name="Notes" placeholder={`${quote.notes}`} disabled={true} />
          </div>
          <div className={styles['section-header']}>
            <label>Quote Comments</label>
            <div className={styles['comments-container']}>
              {quoteComments.map((comment: any, index: number) => {
                return (
                  <EditableTextArea
                    key={comment.id}
                    value={comment.comment}
                    name="comment"
                    schema={quoteCommentSchema}
                    title={`@${comment.user.username}`}
                    subtitle={moment
                      .tz(comment.created_at, 'America/New_York')
                      .format('MMM D, YYYY h:mm A z')}
                    hasEditPermission={comment.has_edit_permission}
                    onSubmit={async (values: any, id: number) => {
                      const valuesToSend = {
                        comment: values.comment,
                      };
                      const access_token = Cookies.get('access');
                      try {
                        const res = await axios.patch(
                          `${apiUrl}/quotes/quote-comments/${id}/`,
                          valuesToSend,
                          {
                            headers: { Authorization: `JWT ${access_token}` },
                          }
                        );
                        if (res.status === 200) {
                          return true;
                        }
                      } catch (error: any) {
                        console.error(error);
                        return false;
                      }
                    }}
                    onDelete={async () => {
                      const access_token = Cookies.get('access');
                      try {
                        const res = await axios.delete(
                          `${apiUrl}/quotes/quote-comments/${comment.id}/`,
                          {
                            headers: { Authorization: `JWT ${access_token}` },
                          }
                        );
                        if (res.status === 204) {
                          setQuoteComments(quoteComments.filter((c: any) => c.id !== comment.id));
                          return true;
                        }
                      } catch (error: any) {
                        console.error(error);
                        return false;
                      }
                    }}
                    id={comment.id}
                  />
                );
              })}
              {addingComment ? (
                <EditableTextArea
                  new
                  value=""
                  name="comment"
                  schema={quoteCommentSchema}
                  onCancel={() => setAddingComment(false)}
                  onSubmit={async (values: any) => {
                    const valuesToSend = {
                      comment: values.comment,
                      quote: id,
                    };
                    const access_token = Cookies.get('access');
                    try {
                      const res = await axios.post(
                        `${apiUrl}/quotes/quote-comments/`,
                        valuesToSend,
                        {
                          headers: { Authorization: `JWT ${access_token}` },
                        }
                      );
                      if (res.status === 201) {
                        const comment = await axios.get(
                          `${apiUrl}/quotes/quote-comments/${res.data.id}`,
                          {
                            headers: { Authorization: `JWT ${access_token}` },
                          }
                        );
                        setQuoteComments([...quoteComments, comment.data]);
                        setAddingComment(false);
                        return true;
                      }
                    } catch (error: any) {
                      console.error(error);
                      return false;
                    }
                  }}
                />
              ) : (
                <Button title="Add comment" onClick={() => setAddingComment(true)} />
              )}
              <div ref={newCommentRef} />
            </div>
          </div>
          {authData.user_type === 'customer' && quote.status === 'new_quote' ? (
            <div className={styles['buttons-container']}>
              <div className={styles['reject-button']}>
                <Button
                  title="Reject Quote"
                  width="80%"
                  backgroundColor="red"
                  onClick={async () => {
                    const access_token = Cookies.get('access');
                    const valuesToSend = { status: 'rejected' };
                    try {
                      const res = await axios.patch(
                        `${apiUrl}/quotes/quotes/${id}/`,
                        valuesToSend,
                        {
                          headers: { Authorization: `JWT ${access_token}` },
                        }
                      );
                      if (res.status === 200) {
                        router.push({
                          pathname: 'quote-request-details',
                          query: { id: quote.quote_request.id },
                        });
                      }
                    } catch (error: any) {
                      scrollTo(0, 0);
                      console.log(error);
                    }
                  }}
                />
              </div>
              <div className={styles['accept-button']}>
                <Button
                  title="Accept Quote"
                  margin="0 0 0 9vw"
                  width="80%"
                  onClick={async () => {
                    const access_token = Cookies.get('access');
                    const valuesToSend = { status: 'accepted' };
                    try {
                      const res = await axios.patch(
                        `${apiUrl}/quotes/quotes/${id}/`,
                        valuesToSend,
                        {
                          headers: { Authorization: `JWT ${access_token}` },
                        }
                      );
                      if (res.status === 200) {
                        router.push({
                          pathname: 'quote-request-details',
                          query: { id: quote.quote_request.id },
                        });
                      }
                    } catch (error: any) {
                      scrollTo(0, 0);
                      console.log(error);
                    }
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <Header title={`Quote`} />
        <div className={styles['error-page-container']}>
          <label>No Quote Request Selected</label>
        </div>
      </div>
    );
  }
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { id } = context.query;
  console.log(id);
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  try {
    const quote = await axios.get(`${apiUrl}/quotes/quotes/${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const quoteComments = await axios.get(`${apiUrl}/quotes/quote-comments?quote=${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    // const quoteRequest = await axios.get(
    //   `${apiUrl}/quotes/quote-requests/${quote.data.quote_request}`,
    //   {
    //     headers: { Authorization: `JWT ${access_token}` },
    //   }
    // );
    // const shop = await axios.get(`${apiUrl}/shops/shops/${quote.data.shop}`, {
    //   headers: { Authorization: `JWT ${access_token}` },
    // });
    return {
      props: {
        quote: quote.data,
        comments: quoteComments.data,
        // quoteRequest: quoteRequest.data,
        // shop: shop.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        notFound: true,
      },
    };
  }
};

export default Quote;
