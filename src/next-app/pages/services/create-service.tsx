import type { NextPage, GetServerSideProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import axios from 'axios';
import { useFormik, FormikProvider } from 'formik';
import { useState } from 'react';
import {
  CardTextField,
  CardTextArea,
  CardSelect,
  CardMultiSelect,
} from '../../components/CardComponents';
import Header from '../../components/Header';
import apiUrl from '../../constants/api-url';
import Button from '../../components/Button';
// @ts-ignore
import * as cookie from 'cookie';
import Cookies from 'js-cookie';

const ServicesDetail: NextPage = ({ service, parts, shop }: any) => {
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const [serviceParts, setParts] = useState([]);
  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
    price: yup.number().positive().required(),
    active: yup.string().required(),
  });
  const form = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      active: 'Active',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const valuesToSend = {
        shop: shop.id,
        name: values.name,
        description: values.description,
        price: values.price,
        active: values.active === 'Active' ? true : false,
        parts: serviceParts.map((part: any) => part.id),
      };
      const access_token = Cookies.get('access');
      try {
        const res = await axios.post(`${apiUrl}/shops/services/`, valuesToSend, {
          headers: { Authorization: `JWT ${access_token}` },
        });
        if (res.status === 200) {
          router.push('/services');
        }
      } catch (error: any) {
        setErrors(error.response.data.errors);
        scrollTo(0, 0);
      }
    },
  });

  return (
    <div className="container">
      <Header title={`New Service`} />
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
              <h2 className="form-header">Service Information</h2>
              <div className={`card edit`} style={{ marginBottom: '12px' }}>
                <CardTextField
                  fieldValue={`${form.values.name}`}
                  fieldName="name"
                  fieldLabel="Service Name"
                  fieldType="string"
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.name}
                />
                <CardTextField
                  fieldValue={`${form.values.description}`}
                  fieldName="description"
                  fieldLabel="Description"
                  fieldType="string"
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.description}
                />
                <CardTextField
                  fieldValue={form.values.price}
                  fieldName="price"
                  fieldLabel="Price ($)"
                  fieldType="number"
                  onChange={form.handleChange}
                  error={form.errors.price}
                  fieldRequired
                />
                <CardMultiSelect
                  fieldLabel="Parts Required"
                  fieldData={parts.map((part: any) => {
                    return { value: part.id.toString(), label: part.name };
                  })}
                  fieldValues={serviceParts.map((part: any) => {
                    return part.id.toString();
                  })}
                  onChange={(values) => {
                    const newParts = parts.filter((part: any) => {
                      if (values.includes(part.id.toString())) {
                        return true;
                      }
                    });
                    setParts(newParts);
                  }}
                  fieldPlaceholder="Select the required parts"
                  fieldSearchable
                  className="input-multiselect"
                />
                <CardSelect
                  fieldName="active"
                  fieldLabel="Status"
                  options={['Active', 'Inactive'].map((op: any) => {
                    return (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    );
                  })}
                  fieldRequired
                  error={form.errors.active}
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
    const parts = await axios.get(`${apiUrl}/vehicles/parts/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const shop = await axios.get(`${apiUrl}/shops/shops/me/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        parts: parts.data,
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

export default ServicesDetail;
