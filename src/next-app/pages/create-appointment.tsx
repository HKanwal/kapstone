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
import { calculateSizeAdjustValues } from 'next/dist/server/font-utils';

const CreateAppointment: NextPage = ({ shop }: any) => {
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const [services, setServices] = useState(shop?.shop_services);
  const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.number().required(),
    email: yup.string().required(),
    carYear: yup.number().positive().required(),
    carMake: yup.string().required(),
    carModel: yup.string().required(),
    vin: yup.number().positive().required(),
    licensePlate: yup.string().max(8).min(2).required(),
    service: yup.number(),
  });
  const form = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      carYear: '',
      carMake: '',
      carModel: '',
      vin: '',
      licensePlate: '',
      service: services === undefined || services.length === 0 ? -1 : services[0].id,
    },
    validationSchema: schema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const access_token = Cookies.get('access');
      const vehicleValuesToSend = {
        manufacturer: values.carMake,
        year: values.carYear,
        model: values.carModel,
        vin: values.vin,
        color: '',
      };
      try {
        const vehicle_res = await axios.post(`${apiUrl}/vehicles/vehicles/`, vehicleValuesToSend, {
          headers: { Authorization: `JWT ${access_token}` },
        });
        const vehicle = vehicle_res.data['vin'];
        if (vehicle_res.status === 201) {
          const pass = 'pass' + Math.random().toString(36).slice(-8);
          const customerValuesToSend = {
            first_name: values.firstName,
            last_name: values.lastName,
            phone_number: '+' + values.phone,
            email: values.email,
            password: pass,
            re_password: pass,
            username: 'user' + Math.random().toString(36).slice(-8),
            type: 'customer',
          };
          try {
            const customer_res = await axios.post(`${apiUrl}/auth/users/`, customerValuesToSend);
            if (customer_res.status === 201) {
              try {
                const customer_details_res = await axios.get(
                  `${apiUrl}/accounts/customer/get_customer_by_email/`,
                  {
                    headers: { Authorization: `JWT ${access_token}` },
                    params: { email: customer_res.data['email'] },
                  }
                );
                if (customer_details_res.status === 200) {
                  const customer = customer_details_res.data.user['id'];
                  router.push(
                    '/create-appointment-calendar?appointmentLength=2&service=' +
                      values.service +
                      '&customerId=' +
                      customer +
                      '&vehicle=' +
                      vehicle
                  ); // TODO: service model (BE) needs to have duration field according to which appointmentLength is determined
                }
              } catch (error: any) {
                setErrors(error.response.data.errors);
              }
            }
          } catch (error: any) {
            setErrors(error.response.data.errors);
          }
        }
      } catch (error: any) {
        setErrors(error.response.data.errors);
      }
    },
  });

  return (
    <div className="container">
      <Header title={`New Appointment`} />
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
              <h2 className="form-header">Service</h2>
              <div className={`card edit`} style={{ marginBottom: '12px' }}>
                {services ? (
                  <CardSelect
                    fieldName="service"
                    fieldLabel="Service"
                    fieldRequired
                    options={services.map((service: any) => {
                      return (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      );
                    })}
                    error={form.errors.service}
                  />
                ) : (
                  <h2 className="form-header">No Services.</h2>
                )}
              </div>
              <h2 className="form-header">Customer Bio</h2>
              <div className={`card edit`} style={{ marginBottom: '12px' }}>
                <CardTextField
                  fieldValue={form.values.firstName}
                  fieldName="firstName"
                  fieldLabel="First Name"
                  fieldType="string"
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.firstName}
                />
                <CardTextField
                  fieldValue={form.values.lastName}
                  fieldName="lastName"
                  fieldLabel="Last Name"
                  fieldType="string"
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.lastName}
                />
                <CardTextField
                  fieldValue={form.values.phone}
                  fieldName="phone"
                  fieldLabel="Phone Number"
                  fieldType="number"
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.phone}
                />
                <CardTextField
                  fieldValue={form.values.email}
                  fieldName="email"
                  fieldLabel="Email Address"
                  fieldType="string"
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.email}
                />
              </div>
              <h2 className="form-header">Car Details</h2>
              <div className={`card edit`} style={{ marginBottom: '12px' }}>
                <CardTextField
                  fieldValue={form.values.carMake}
                  fieldName="carMake"
                  fieldLabel="Car Make"
                  fieldType="string"
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.carMake}
                />
                <CardTextField
                  fieldValue={form.values.carModel}
                  fieldName="carModel"
                  fieldLabel="Car Model"
                  fieldType="string"
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.carModel}
                />
                <CardTextField
                  fieldValue={form.values.carYear}
                  fieldName="carYear"
                  fieldLabel="Car Year"
                  fieldType="number"
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.carYear}
                />
                <CardTextField
                  fieldValue={form.values.vin}
                  fieldName="vin"
                  fieldLabel="VIN"
                  fieldType="number"
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.vin}
                />
                <CardTextField
                  fieldValue={form.values.licensePlate}
                  fieldName="licensePlate"
                  fieldLabel="License Plate"
                  fieldType="string"
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.licensePlate}
                />
                <Button type="submit" title="Save" width={'100%'}></Button>
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
    const shop = await axios.get(`${apiUrl}/shops/shops/me/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        shop: shop.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default CreateAppointment;
