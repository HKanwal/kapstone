/* eslint-disable indent */
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import styles from '../../styles/pages/EmployeeDetails.module.css';
import FieldLabel from '../../components/FieldLabel';
import TextInput from '../../components/TextInput';
import { useRouter } from 'next/router';
import apiUrl from '../../constants/api-url';
import * as yup from 'yup';
import axios from 'axios';
import { useFormik, FormikProvider } from 'formik';
import { GrFormClose, GrFormEdit } from 'react-icons/gr';
import Cookies from 'js-cookie';
// @ts-ignore
import * as cookie from 'cookie';
import Button from '../../components/Button';
import employees from '.';
import { CardTextField, CardSelect, CardTextArea } from '../../components/CardComponents';
import Modal from '../../components/Modal';

type info = {
  [key: string]: any;
};

const EmployeeDetailsPage: NextPage = ({ employee }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [inEdit, setInEdit] = useState(false);
  const [errors, setErrors] = useState([]);
  const [modalVisible, setModalVisisble] = useState<boolean>(false);

  const showModal = () => {
    setModalVisisble(true);
  };

  const hideModal = () => {
    setModalVisisble(false);
  };

  const schema = yup.object().shape({
    user: yup.object().shape({
      first_name: yup.string().required(),
      last_name: yup.string().required(),
      email: yup.string().required(),
      phone_number: yup.number().optional(),
    }),
  });
  const form = useFormik({
    initialValues: {
      user: {
        first_name: employee.user.first_name,
        last_name: employee.user.last_name,
        email: employee.user.email,
        phone_number: employee.user.phone_number,
      },
      salary: employee.salary,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const employeeValuesToSend = {
        salary: values.salary,
      };

      const userValuesToSend = {
        email: values.user.email,
        first_name: values.user.first_name,
        last_name: values.user.last_name,
        phone_number: values.user.phone_number,
      };

      const access_token = Cookies.get('access');

      try {
        const res = await axios.patch(`${apiUrl}/accounts/employee/${id}/`, employeeValuesToSend, {
          headers: { Authorization: `JWT ${access_token}` },
        });
        if (res.status === 200) {
          try {
            const res = await axios.patch(
              `${apiUrl}/auth/users/${employee.user.id}/`,
              userValuesToSend,
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

  return (
    <div className={styles.container}>
      <Header
        title="Employee"
        rightIcon={inEdit ? GrFormClose : GrFormEdit}
        onRightIconClick={() => setInEdit(!inEdit)}
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
              <h2 className="form-header">Employee Details</h2>
              <div className={`card${inEdit ? 'edit' : ''}`} style={{ marginBottom: '12px' }}>
                <CardTextField
                  fieldValue={form.values.user.first_name}
                  fieldName="user.first_name"
                  fieldLabel="First Name"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.user?.first_name}
                />
                <CardTextField
                  fieldValue={form.values.user.last_name}
                  fieldName="user.last_name"
                  fieldLabel="Last Name"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.user?.last_name}
                />
                <CardTextField
                  fieldValue={form.values.user.email}
                  fieldName="user.email"
                  fieldLabel="Email"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.user?.email}
                />
                <CardTextField
                  fieldValue={form.values.user.phone_number}
                  fieldName="user.phone_number"
                  fieldLabel="Phone Number"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.user?.phone_number}
                />
                <CardTextField
                  fieldValue={form.values.salary ? form.values.salary : ''}
                  fieldName="salary"
                  fieldLabel="Salary ($)"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.salary}
                />
                {inEdit && <Button type="submit" title="Save" width={'100%'}></Button>}
                <div className={styles['field-container']}>
                  {inEdit && (
                    <Button
                      backgroundColor="red"
                      title="Delete"
                      onClick={showModal}
                      width={'100%'}
                    ></Button>
                  )}
                </div>
              </div>
            </form>
          </FormikProvider>
          <Modal visible={modalVisible} onClose={hideModal}>
            <div className={styles['modal-content']}>
              <div className={styles['modal-title-container']}>
                <span className={styles['modal-title']}>
                  {`Are you sure you wish to delete the following employee: ${form.values.user.first_name}
                  ${form.values.user.last_name}`}
                </span>
              </div>
              <div className={styles['modal-submit']}>
                <Button
                  title="Delete"
                  backgroundColor="red"
                  onClick={async () => {
                    const access_token = Cookies.get('access');
                    try {
                      const res = await axios.delete(
                        `${apiUrl}/accounts/employee/${employee.id}/`,
                        {
                          headers: { Authorization: `JWT ${access_token}` },
                        }
                      );
                      if (res.status === 204) {
                        hideModal();
                        router.push({
                          pathname: '/employees',
                        });
                      }
                    } catch (error: any) {
                      hideModal();
                      scrollTo(0, 0);
                      console.log(error);
                    }
                  }}
                  width="100%"
                />
              </div>
              <div className={styles['modal-submit']}>
                <Button title="Cancel" onClick={hideModal} width="100%" />
              </div>
            </div>
          </Modal>
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
    const employee = await axios.get(`${apiUrl}/accounts/employee/${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        employee: employee.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default EmployeeDetailsPage;
