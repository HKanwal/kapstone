// @ts-nocheck
import type { NextPage, GetServerSideProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import axios from 'axios';
import { useFormik, FormikProvider } from 'formik';
import { useState } from 'react';
import { GrFormEdit, GrFormClose } from 'react-icons/gr';
import { CardTextField, CardSelect, CardMultiSelect } from '../../components/CardComponents';
import Modal from '../../components/Modal';
import Header from '../../components/Header';
import apiUrl from '../../constants/api-url';
import Button from '../../components/Button';
// @ts-ignore
import * as cookie from 'cookie';
import Cookies from 'js-cookie';

const ServicesDetail: NextPage = ({ service, parts, shop }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [inEdit, setInEdit] = useState(false);
  const [errors, setErrors] = useState([]);
  const [serviceParts, setParts] = useState(service?.parts ?? []);
  const [partModal, setPartModal] = useState(false);
  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
    price: yup.number().positive().required(),
    active: yup.string().required(),
  });
  const partSchema = yup.object().shape({
    name: yup.string().required(),
    condition: yup.string(),
    type: yup.string(),
    price: yup.number().positive().required(),
  });
  const handlePartClose = () => {
    setPartModal((prev) => !prev);
  };
  const form = useFormik({
    initialValues: {
      name: service.name,
      description: service.description,
      price: service.price,
      active: service.active === true ? 'Active' : 'Inactive',
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
      setParts(
        parts.filter((part: any) => {
          return service.parts.some(
            (servicePart: any) => servicePart.id.toString() == part.id.toString()
          );
        })
      );
      const access_token = Cookies.get('access');
      try {
        const res = await axios.patch(`${apiUrl}/shops/services/${id}/`, valuesToSend, {
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

  const partForm = useFormik({
    initialValues: {
      name: '',
      condition: 'new',
      type: 'oem',
      price: '',
    },
    validationSchema: partSchema,
    onSubmit: async (values) => {
      const valuesToSend = {
        name: values.name,
        condition: values.condition === 'New' ? 'new' : 'used',
        type: values.type === 'OEM' ? 'oem' : 'aftermarket',
        price: values.price,
      };
      const access_token = Cookies.get('access');
      try {
        const res = await axios.post(`${apiUrl}/vehicles/parts/`, valuesToSend, {
          headers: { Authorization: `JWT ${access_token}` },
        });
        if (res.status === 201) {
          handlePartClose();
          router.reload();
        }
      } catch (error: any) {
        setErrors(error.response.data.errors);
      }
    },
  });

  return (
    <div className="container">
      <Header
        title={`Service: ${service.name}`}
        rightIcon={service.has_edit_permission ? (inEdit ? GrFormClose : GrFormEdit) : undefined}
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
              <h2 className="form-header">Service Information</h2>
              <div className={`card${inEdit ? 'edit' : ''}`} style={{ marginBottom: '12px' }}>
                <CardTextField
                  fieldValue={`${form.values.name}`}
                  fieldName="name"
                  fieldLabel="Service Name"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.name}
                />
                <CardTextField
                  fieldValue={`${form.values.description}`}
                  fieldName="description"
                  fieldLabel="Description"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.description}
                />
                <CardTextField
                  fieldValue={form.values.price}
                  fieldName="price"
                  fieldLabel="Price ($)"
                  fieldType="number"
                  fieldDisabled={!inEdit}
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
                  fieldDisabled={!inEdit}
                  className="input-multiselect"
                />
                {inEdit && (
                  <div className="modal-wrapper">
                    <Button title="Create New Part" onClick={handlePartClose}></Button>
                    <Modal visible={partModal} onClose={handlePartClose} title="Create New Part">
                      <div className="modal-content">
                        <FormikProvider value={partForm}>
                          <form onSubmit={partForm.handleSubmit}>
                            <h2 className="form-header">Part Information</h2>
                            <div className={`card edit`} style={{ marginBottom: '12px' }}>
                              <CardTextField
                                fieldValue={`${partForm.values.name}`}
                                fieldName="name"
                                fieldLabel="Part Name"
                                fieldType="string"
                                fieldRequired
                                onChange={partForm.handleChange}
                                error={partForm.errors.name}
                              />
                              <CardTextField
                                fieldValue={`${partForm.values.price}`}
                                fieldName="price"
                                fieldLabel="Price ($)"
                                fieldType="number"
                                fieldRequired
                                onChange={partForm.handleChange}
                                error={partForm.errors.price}
                              />
                              <CardSelect
                                fieldName="type"
                                fieldLabel="Type"
                                options={['OEM', 'Aftermarket'].map((op: any) => {
                                  return (
                                    <option key={op} value={op}>
                                      {op}
                                    </option>
                                  );
                                })}
                                fieldRequired
                                error={partForm.errors.type}
                              />
                              <CardSelect
                                fieldName="condition"
                                fieldLabel="Condition"
                                options={['New', 'Used'].map((op: any) => {
                                  return (
                                    <option key={op} value={op}>
                                      {op}
                                    </option>
                                  );
                                })}
                                fieldRequired
                                error={partForm.errors.condition}
                              />
                              <Button
                                type="button"
                                title="Save"
                                width={'100%'}
                                onClick={partForm.handleSubmit}
                              ></Button>
                            </div>
                          </form>
                        </FormikProvider>
                      </div>
                    </Modal>
                  </div>
                )}
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
                  fieldDisabled={!inEdit}
                  error={form.errors.active}
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
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  try {
    const service = await axios.get(`${apiUrl}/shops/services/${id}/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const parts = await axios.get(`${apiUrl}/vehicles/parts/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const shop = await axios.get(`${apiUrl}/shops/shops/me/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        service: service.data,
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
