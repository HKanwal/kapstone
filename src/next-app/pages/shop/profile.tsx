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
  CardHoursField,
} from '../../components/CardComponents';
import Header from '../../components/Header';
import apiUrl from '../../constants/api-url';
import Button from '../../components/Button';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc3MDEzMzc2LCJqdGkiOiJiYTUyY2FhNWFmNDc0MTBmYmJlN2Q5Mjc3YjcxZDk1ZSIsInVzZXJfaWQiOjE0NH0.kjw5CmZoOe-R8JzvsOrUo9OsFpWNt9qr1rS1WQR9ZTo';
const shopId = 3;

const ProfilePage: NextPage = ({ shop }: any) => {
  const router = useRouter();
  const [inEdit, setInEdit] = useState(false);
  const [errors, setErrors] = useState([]);
  const [services, setServices] = useState(shop?.shop_services ?? []);
  const [shopHours, setShopHours] = useState(shop?.shophours_set ?? []);
  const schema = yup.object().shape({
    name: yup.string().required(),
    num_bays: yup.number().optional(),
    num_employees: yup.number().optional(),
    address: yup.object().shape({
      id: yup.number().required().positive().integer(),
      street: yup.string().required(),
      city: yup.string().required(),
      province: yup.string().required(),
      postal_code: yup.string().required(),
      country: yup.string().required(),
    }),
  });
  const form = useFormik({
    initialValues: {
      name: shop.name,
      num_bays: shop.num_bays,
      num_employees: shop.num_employees,
      address: {
        id: shop.address.id,
        street: shop.address.street,
        city: shop.address.city,
        province: shop.address.province,
        country: shop.address.country,
        postal_code: shop.address.postal_code,
      },
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const valuesToSend = {
        name: values.name,
        shop_services: services
          .filter((service: any) => service.active)
          .map((service: any) => service.id),
        address: {
          id: values.address.id,
          street: values.address.street,
          city: values.address.city,
          province: values.address.province,
          country: values.address.country,
          postal_code: values.address.postal_code,
        },
        shophours_set: shopHours,
      };
      try {
        const res = await axios.patch(`${apiUrl}/shops/shops/${shopId}/`, valuesToSend, {
          headers: { Authorization: `JWT ${token}` },
        });
        if (res.status === 200) {
          router.reload();
        }
      } catch (error: any) {
        setErrors(error.response.data?.errors);
        scrollTo(0, 0);
      }
    },
  });

  return (
    <div className="container">
      <Header
        title={`Shop Profile`}
        rightIcon={inEdit ? GrFormClose : GrFormEdit}
        onRightIconClick={() => setInEdit(!inEdit)}
      />
      <div className="wrapper">
        <div className="flex flex-row row-gap-large">
          {errors?.length > 0 && (
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
              <h2 className="form-header">Shop Details</h2>
              <div className={`card${inEdit ? 'edit' : ''}`} style={{ marginBottom: '12px' }}>
                <CardTextField
                  fieldValue={form.values.name}
                  fieldName="name"
                  fieldLabel="Shop Name"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.name}
                />
                <CardMultiSelect
                  fieldLabel="Shop Services"
                  fieldData={services.map((service: any) => {
                    return { value: service.id.toString(), label: service.name };
                  })}
                  fieldValues={services
                    .filter((service: any) => service.active)
                    .map((service: any) => {
                      return service.id.toString();
                    })}
                  onChange={(values) => {
                    const newServices = services.map((service: any) => {
                      if (values.includes(service.id.toString())) {
                        service.active = true;
                      } else {
                        service.active = false;
                      }
                      return service;
                    });
                    setServices(newServices);
                  }}
                  fieldPlaceholder="Select the services"
                  fieldSearchable
                  fieldDisabled={!inEdit}
                  className="input-multiselect"
                />
                <CardHoursField
                  fieldLabel="Shop Hours"
                  fieldRequired
                  hours={shopHours}
                  fieldDisabled={!inEdit}
                  onChange={(event: any, index: number) => {
                    const newShopHours = [...shopHours];
                    newShopHours[index].day = event.currentTarget.value.toLowerCase();
                    setShopHours(newShopHours);
                  }}
                  onTimeChange={(time: any, type: string, index: number) => {
                    console.log(time, type, index);
                    const newShopHours = [...shopHours];
                    newShopHours[index][type] = time;
                    setShopHours(newShopHours);
                    console.log(newShopHours);
                  }}
                  onCreate={(day: any) => {
                    const newShopHours = [...shopHours];
                    newShopHours.push(day);
                    setShopHours(newShopHours);
                  }}
                  onDelete={(index: number) => {
                    const newShopHours = [...shopHours];
                    newShopHours.splice(index, 1);
                    setShopHours(newShopHours);
                  }}
                />
                <CardTextField
                  fieldValue={form.values.num_bays}
                  fieldName="num_bays"
                  fieldLabel="Number of Bays"
                  fieldType="string"
                  fieldDisabled={true}
                  onChange={form.handleChange}
                  error={form.errors.num_bays}
                />
                <CardTextField
                  fieldValue={form.values.address.street}
                  fieldName="address.street"
                  fieldLabel="Street Address"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.address?.street}
                />
                <CardTextField
                  fieldValue={form.values.address.city}
                  fieldName="address.city"
                  fieldLabel="City"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.address?.city}
                />
                <CardTextField
                  fieldValue={form.values.address.country}
                  fieldName="address.country"
                  fieldLabel="Country"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.address?.country}
                />
                <CardTextField
                  fieldValue={form.values.address.postal_code}
                  fieldName="address.postal_code"
                  fieldLabel="Postal Code"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.address?.postal_code}
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
    const shop = await axios.get(`${apiUrl}/shops/shops/${shopId}/`, {
      headers: { Authorization: `JWT ${token}` },
    });
    // const services = await axios.get(`http://127.0.0.1:8000/shops/services/?shop=${shopId}`);
    // const employees = await axios.get(`${apiUrl}/shops/shops/services/?shop=${shopId}`, {
    //   headers: { Authorization: `JWT ${token}` },
    // });
    return {
      props: {
        shop: shop.data,
        // employees: employees.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        shop: {},
        // employees: [],
      },
    };
  }
};

export default ProfilePage;
