import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import axios from 'axios';
import { useFormik, FormikProvider } from 'formik';
import { useState } from 'react';
import { GrFormEdit, GrFormClose } from 'react-icons/gr';
import {
  CardTextField,
  CardTextArea,
  CardSelect,
  CardMultiSelect,
} from '../../components/CardComponents';
import Header from '../../components/Header';
import apiUrl from '../../constants/api-url';
import Button from '../../components/Button';
import * as cookie from 'cookie';
import Cookies from 'js-cookie';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc3MDI0NTU2LCJqdGkiOiI2ZDEzY2I0ZWUyMWE0MWE3YTI0MTBmMDMxYWQxYzA5NSIsInVzZXJfaWQiOjE0MX0.367Y4E9-80CO86CgB8JGttMKL10l3ayNeWSFYigIIbU';

const ServicesDetail: NextPage = ({ service, parts }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [inEdit, setInEdit] = useState(false);
  const [errors, setErrors] = useState([]);
  const [serviceParts, setParts] = useState(service?.parts ?? []);
  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
    price: yup.number().positive().required(),
    active: yup.boolean().required(),
  });
  const form = useFormik({
    initialValues: {
      name: service.name,
      description: service.description,
      price: service.price,
      active: service.active,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const valuesToSend = {
        name: values.name,
        description: values.description,
        price: values.price,
        active: values.active === 'Active' ? true : false,
        parts: serviceParts,
      };
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

  return (
    <div className="container">
      <Header
        title={`Service: #${service.id}`}
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
                  fieldValue={`@${form.values.name}`}
                  fieldName="name"
                  fieldLabel="Service Name"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.name}
                />
                <CardTextArea
                  fieldValue={`@${form.values.description}`}
                  fieldName="description"
                  fieldLabel="Description"
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
                  fieldValues={parts.map((part: any) => {
                    return part.id.toString();
                  })}
                  onChange={(values) => {
                    const newParts = parts.map((part: any) => {
                      if (values.includes(part.id.toString())) {
                        return part;
                      }
                    });
                    setParts(newParts);
                  }}
                  fieldPlaceholder="Select the required parts"
                  fieldSearchable
                  fieldDisabled={!inEdit}
                  className="input-multiselect"
                />
                <CardSelect
                  fieldName="active"
                  fieldLabel="Status"
                  options={['Active', 'Inactive']}
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
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const access_token = parsedCookies.access;
  try {
    const service = await axios.get(`${apiUrl}/services/${id}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const parts = await axios.get(`${apiUrl}/vehicles/parts`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        service: service.data,
        parts: parts.data,
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
