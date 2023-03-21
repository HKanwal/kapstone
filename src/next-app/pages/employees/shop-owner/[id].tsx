/* eslint-disable indent */
import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import Header from '../../../components/Header';
import styles from '../../../styles/pages/EmployeeDetails.module.css';
import { useRouter } from 'next/router';
import apiUrl from '../../../constants/api-url';
import * as yup from 'yup';
import axios from 'axios';
import { useFormik, FormikProvider } from 'formik';
import { GrFormClose, GrFormEdit } from 'react-icons/gr';
import Cookies from 'js-cookie';
// @ts-ignore
import * as cookie from 'cookie';
import Button from '../../../components/Button';
import { CardTextField } from '../../../components/CardComponents';
import Modal from '../../../components/Modal';

type info = {
  [key: string]: any;
};

const ShopOwnerDetailsPage: NextPage = ({ shop_owner }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [inEdit, setInEdit] = useState(false);
  const [errors, setErrors] = useState([]);

  const schema = yup.object().shape({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().required(),
    phone_number: yup.number().optional(),
  });
  const form = useFormik({
    initialValues: {
      first_name: shop_owner.first_name,
      last_name: shop_owner.last_name,
      email: shop_owner.email,
      phone_number: shop_owner.phone_number,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const valuesToSend = {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
      };

      const access_token = Cookies.get('access');

      try {
        const res = await axios.patch(`${apiUrl}/auth/users/${id}/`, valuesToSend, {
          headers: { Authorization: `JWT ${access_token}` },
        });
        if (res.status === 200) {
          router.reload();
        }
      } catch (error: any) {
        setErrors(error.response.data.errors);
        scrollTo(0, 0);
      }
    },
  });

  return (
    <div className={styles.container}>
      <Header
        title="Shop Owner Profile"
        rightIcon={inEdit ? GrFormClose : GrFormEdit}
        onRightIconClick={!inEdit ? () => setInEdit(!inEdit) : () => router.reload()}
      />
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
              <h2 className="form-header">Profile Details</h2>
              <div className={`card${inEdit ? 'edit' : ''}`} style={{ marginBottom: '12px' }}>
                <CardTextField
                  fieldValue={form.values.first_name}
                  fieldName="first_name"
                  fieldLabel="First Name"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.first_name}
                />
                <CardTextField
                  fieldValue={form.values.last_name}
                  fieldName="last_name"
                  fieldLabel="Last Name"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.last_name}
                />
                <CardTextField
                  fieldValue={form.values.email}
                  fieldName="email"
                  fieldLabel="Email"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.email}
                />
                <CardTextField
                  fieldValue={form.values.phone_number}
                  fieldName="phone_number"
                  fieldLabel="Phone Number"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.phone_number}
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
  try {
    const { id } = context.query;
    const parsedCookies = cookie.parse(String(context.req.headers.cookie));
    const access_token = parsedCookies.access;
    const shop_owner = await axios.get(`${apiUrl}/auth/users/${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        shop_owner: shop_owner.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default ShopOwnerDetailsPage;
