import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import axios from 'axios';
import styles from '../styles/pages/QuoteRequestDetails.module.css';
import { useFormik, FormikProvider } from 'formik';
import { useState } from 'react';
import { GrFormEdit, GrFormClose } from 'react-icons/gr';
import { CardTextField, CardTextArea, CardSelect } from '../components/CardComponents';
import Header from '../components/Header';
import apiUrl from '../constants/api-url';
import Button from '../components/Button';
import Cookies from 'js-cookie';
// @ts-ignore
import * as cookie from 'cookie';
import Link from '../components/Link';

const AppointmentDetails: NextPage = ({ appointment, workOrders, shop }: any) => {
  const router = useRouter();
  const { id } = router.query;
  //const id = 1;
  const [inEdit, setInEdit] = useState(false);
  const [errors, setErrors] = useState([]);
  const schema = yup.object().shape({
    duration: yup.string().required(),
    price: yup.string().optional(),
  });
  const form = useFormik({
    initialValues: {
      service: appointment.service?.name ?? appointment.quote.quote_request.description,
      duration: appointment.duration,
      price: appointment.quote?.price ?? appointment.service?.price,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const appointmentValuesToSend = {
        duration: values.duration,
      };

      const access_token = Cookies.get('access');

      try {
        const res = await axios.patch(
          `${apiUrl}/shops/appointments/${id}/`,
          appointmentValuesToSend,
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
    },
  });

  const workOrder = workOrders.filter((workOrder: any) => {
    if (workOrder.appointment.id === appointment.id) return true;
    else return false;
  })[0];

  return (
    <div className="container">
      <Header
        title={`Appointment Details`}
        burgerMenu={
          !inEdit
            ? Cookies.get('user_type') === 'shop_owner'
              ? [
                  {
                    option: 'Edit',
                    onClick() {
                      setInEdit(true);
                    },
                  },
                  {
                    option: 'Cancel',
                    onClick() {},
                  },
                  {
                    option: 'Reschedule',
                    onClick() {},
                  },
                  {
                    option: 'Call Customer',
                    onClick() {
                      window.open(`tel: ${appointment.customer.phone_number}`);
                    },
                  },
                ]
              : [
                  {
                    option: 'Call Shop',
                    onClick() {
                      window.open(`tel: ${shop.phone_number}`);
                    },
                  },
                ]
            : undefined
        }
        rightIcon={inEdit ? GrFormClose : undefined}
        onRightIconClick={() => setInEdit(!inEdit)}
      />
      <div className="wrapper">
        <div>
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
              <div className={`card${inEdit ? 'edit' : ''}`} style={{ marginBottom: '12px' }}>
                <CardTextField
                  fieldValue={form.values.service}
                  fieldName="service"
                  fieldLabel="Service"
                  fieldType="string"
                  fieldDisabled={true}
                  onChange={form.handleChange}
                  error={form.errors.service}
                />
                <CardTextField
                  fieldValue={form.values.duration}
                  fieldName="duration"
                  fieldLabel="Estimated Length"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.duration}
                />
                <CardTextField
                  fieldValue={form.values.price}
                  fieldName="price"
                  fieldLabel="Estimated Price ($)"
                  fieldType="string"
                  fieldDisabled={true}
                  onChange={form.handleChange}
                  error={form.errors.price}
                  fieldRequired
                />
                {appointment.quote ? (
                  <div className={styles['link-container']}>
                    <Link
                      text="View Quote"
                      onClick={() =>
                        router.push({ pathname: '/quote', query: { id: appointment.quote.id } })
                      }
                    />
                  </div>
                ) : Cookies.get('user_type') === 'shop_owner' && appointment.service ? (
                  <div className={styles['link-container']}>
                    <Link
                      text="View Service"
                      onClick={() => router.push(`/services/${appointment.service.id}`)}
                    />
                  </div>
                ) : null}
                {Cookies.get('user_type') === 'shop_owner' ? (
                  <Link
                    text="View Work Order"
                    onClick={() => router.push(`/work-orders/${workOrder.id}`)}
                  />
                ) : (
                  <></>
                )}

                {Cookies.get('user_type') === 'shop_owner' ? (
                  <div>
                    <h2 className="form-header">Customer Information</h2>
                    <CardTextField
                      fieldValue={appointment.customer.first_name}
                      fieldName="customer.first_name"
                      fieldLabel="First Name"
                      fieldType="String"
                      fieldDisabled={true}
                      onChange={form.handleChange}
                    />
                    <CardTextField
                      fieldValue={appointment.customer.last_name}
                      fieldName="customer.last_name"
                      fieldLabel="Last Name"
                      fieldType="String"
                      fieldDisabled={true}
                      onChange={form.handleChange}
                    />
                    <CardTextField
                      fieldValue={appointment.customer.phone_number}
                      fieldName="customer.phone_number"
                      fieldLabel="Phone Number"
                      fieldType="String"
                      fieldDisabled={true}
                      onChange={form.handleChange}
                    />
                    <CardTextField
                      fieldValue={appointment.customer.email}
                      fieldName="customer.email"
                      fieldLabel="Email"
                      fieldType="String"
                      fieldDisabled={true}
                      onChange={form.handleChange}
                    />
                  </div>
                ) : (
                  <></>
                )}
                {Cookies.get('user_type') === 'customer' ? (
                  <div>
                    <h2 className="form-header">Shop Information</h2>
                    <CardTextField
                      fieldValue={appointment.shop.name}
                      fieldName="shop.name"
                      fieldLabel="Shop Name"
                      fieldType="String"
                      fieldDisabled={true}
                      onChange={form.handleChange}
                    />
                    <CardTextArea
                      fieldValue={`${shop.address.street}\n${shop.address.city} ${shop.address.province} ${shop.address.country}\n${shop.address.postal_code}`}
                      fieldName="shop.address"
                      fieldLabel="Shop Address"
                      fieldDisabled={true}
                      onChange={form.handleChange}
                    />
                  </div>
                ) : (
                  <></>
                )}
                {appointment.vehicle ? (
                  <div>
                    <h2 className="form-header">Vehicle Information</h2>
                    <CardTextField
                      fieldValue={appointment.vehicle.manufacturer}
                      fieldName="vehicle.manufacturer"
                      fieldLabel="Manufacturer"
                      fieldType="String"
                      fieldDisabled={true}
                      onChange={form.handleChange}
                    />
                    <CardTextField
                      fieldValue={appointment.vehicle.model}
                      fieldName="vehicle.model"
                      fieldLabel="Model"
                      fieldType="String"
                      fieldDisabled={true}
                      onChange={form.handleChange}
                    />
                    <CardTextField
                      fieldValue={appointment.vehicle.year}
                      fieldName="vehicle.year"
                      fieldLabel="Year"
                      fieldType="String"
                      fieldDisabled={true}
                      onChange={form.handleChange}
                    />
                    <CardTextField
                      fieldValue={appointment.vehicle.color}
                      fieldName="vehicle.color"
                      fieldLabel="Color"
                      fieldType="String"
                      fieldDisabled={true}
                      onChange={form.handleChange}
                    />
                    <CardTextField
                      fieldValue={appointment.vehicle.vin}
                      fieldName="vehicle.vin"
                      fieldLabel="VIN"
                      fieldType="String"
                      fieldDisabled={true}
                      onChange={form.handleChange}
                    />
                  </div>
                ) : null}
                {inEdit && <Button type="submit" title="Save" width={'100%'}></Button>}
              </div>
            </form>
          </FormikProvider>
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
    const appointment = await axios.get(`${apiUrl}/shops/appointments/${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });

    const workOrders =
      parsedCookies.user_type === 'shop_owner'
        ? await axios.get(`${apiUrl}/shops/work-orders/`, {
            headers: { Authorization: `JWT ${access_token}` },
          })
        : null;

    const shop = await axios.get(`${apiUrl}/shops/shops/${appointment.data.shop.id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        appointment: appointment.data,
        workOrders: workOrders ? workOrders.data : [],
        shop: shop ? shop.data : {},
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default AppointmentDetails;
