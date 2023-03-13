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

const CreateAppointment: NextPage = (any) => {
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.number().max(15).required(),
    email: yup.string(),
    address: yup.string(),
    carYear: yup.number().positive().required(),
    carMake: yup.string().required(),
    carModel: yup.string().required(),
    vin: yup.number().positive().required(),
    licensePlate: yup.string().max(8).min(2).required(),
  });
  const form = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      carYear: '',
      carMake: '',
      carModel: '',
      vin: '',
      licensePlate: '   ',
    },
    validationSchema: schema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {},
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
                  fieldLabel="First Name"
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
                  fieldLabel="Email Address (Optional)"
                  fieldType="string"
                  onChange={form.handleChange}
                  error={form.errors.email}
                />
                <CardTextField
                  fieldValue={form.values.address}
                  fieldName="address"
                  fieldLabel="Address (Optional)"
                  fieldType="string"
                  onChange={form.handleChange}
                  error={form.errors.address}
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

export default CreateAppointment;
