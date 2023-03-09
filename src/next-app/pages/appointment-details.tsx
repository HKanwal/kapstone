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

const AppointmentDetails: NextPage = ({ appointment, vehicle, workOrders }: any) => {
  const router = useRouter();
  const { id } = router.query;
  //const id = 1;
  const [inEdit, setInEdit] = useState(false);
  const [errors, setErrors] = useState([]);
  const schema = yup.object().shape({
    duration: yup.string().required(),
    quote: yup.object().shape({
      price: yup.string().required(),
    }),
  });
  const form = useFormik({
    initialValues: {
      duration: appointment.duration,
      quote: {
        price: appointment.quote?.price,
      },
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const quoteValuesToSend = {
        price: values.quote.price,
      };

      const appointmentValuesToSend = {
        duration: values.duration,
      };

      const access_token = Cookies.get('access');

      try {
        const res = await axios.patch(
          `${apiUrl}/quotes/quotes/${appointment.quote.id}/`,
          quoteValuesToSend,
          {
            headers: { Authorization: `JWT ${access_token}` },
          }
        );
        if (res.status === 200) {
          try {
            const res = await axios.patch(
              `${apiUrl}/shops/apponitments/${id}/`,
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
            : undefined
        }
        rightIcon={inEdit ? GrFormClose : undefined}
        onRightIconClick={() => setInEdit(!inEdit)}
      />
      <div className="wrapper">
        <div className="flex flex-row row-gap-large">
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
                  fieldValue={form.values.quote.price}
                  fieldName="quote.price"
                  fieldLabel="Estimated Price ($)"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.quote?.price}
                  fieldRequired
                />
                <div className={styles['link-container']}>
                  <Link
                    text="View Quote"
                    onClick={() => router.push({ pathname: '/quote', query: appointment.quote.id })}
                  />
                </div>
                <Link
                  text="View Work Order"
                  onClick={() => router.push(`/work-orders/${workOrder.id}`)}
                />
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
                <h2 className="form-header">Vehicle Information</h2>
                <CardTextField
                  fieldValue={vehicle.manufacturer}
                  fieldName="vehicle.manufacturer"
                  fieldLabel="Manufacturer"
                  fieldType="String"
                  fieldDisabled={true}
                  onChange={form.handleChange}
                />
                <CardTextField
                  fieldValue={vehicle.model}
                  fieldName="vehicle.model"
                  fieldLabel="Model"
                  fieldType="String"
                  fieldDisabled={true}
                  onChange={form.handleChange}
                />
                <CardTextField
                  fieldValue={vehicle.year}
                  fieldName="vehicle.year"
                  fieldLabel="Year"
                  fieldType="String"
                  fieldDisabled={true}
                  onChange={form.handleChange}
                />
                <CardTextField
                  fieldValue={vehicle.color}
                  fieldName="vehicle.color"
                  fieldLabel="Color"
                  fieldType="String"
                  fieldDisabled={true}
                  onChange={form.handleChange}
                />
                <CardTextField
                  fieldValue={vehicle.vin}
                  fieldName="vehicle.vin"
                  fieldLabel="VIN"
                  fieldType="String"
                  fieldDisabled={true}
                  onChange={form.handleChange}
                />
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
  //const id = 1;
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  try {
    const appointment = await axios.get(`${apiUrl}/shops/appointments/${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const vehicle = await axios.get(`${apiUrl}/vehicles/vehicles/${appointment.data.vehicle}/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const workOrders = await axios.get(`${apiUrl}/shops/work-orders/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });

    return {
      props: {
        appointment: appointment.data,
        vehicle: vehicle.data,
        workOrders: workOrders.data,
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
