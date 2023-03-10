import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import axios from 'axios';
import { useFormik, FormikProvider } from 'formik';
import { useState } from 'react';
import { GrFormEdit, GrFormClose } from 'react-icons/gr';
import { CardTextField, CardMultiSelect, CardHoursField } from '../components/CardComponents';
import Header from '../components/Header';
import apiUrl from '../constants/api-url';
import Button from '../components/Button';
// @ts-ignore
import * as cookie from 'cookie';
import Cookies from 'js-cookie';

const CreateShopPage: NextPage = ({ shop }: any) => {
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  // const [services, setServices] = useState(shop?.shop_services ?? []);
  const [shopHours, setShopHours] = useState(shop?.shophours_set ?? []);
  const schema = yup.object().shape({
    name: yup.string().required(),
    shop_email: yup.string().required(),
    shop_phone_number: yup.string().required(),
    num_bays: yup.number().optional(),
    address: yup.object().shape({
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
      shop_email: shop.shop_email,
      shop_phone_number: shop.shop_phone_number,
      num_bays: shop.num_bays,
      address: {
        street: shop.address.street,
        city: shop.address.city,
        province: shop.address.province,
        country: shop.address.country,
        postal_code: shop.address.postal_code,
      },
    },
    validationSchema: schema,
    // validateOnChange: false,
    onSubmit: async (values) => {
      const valuesToSend = {
        name: values.name,
        // shop_services: services
        //   .filter((service: any) => service.active)
        //   .map((service: any) => service.id)
        shop_email: values.shop_email,
        shop_phone_number: values.shop_phone_number,
        num_bays: values.num_bays,
        address: {
          street: values.address.street,
          city: values.address.city,
          province: values.address.province,
          country: values.address.country,
          postal_code: values.address.postal_code,
        },
        shophours_set: shopHours,
      };
      const access_token = Cookies.get('access');
      try {
        const res = await axios.post(`${apiUrl}/shops/shops/`, valuesToSend, {
          headers: { Authorization: `JWT ${access_token}` },
        });
        if (res.status === 201) {
          router.push(`/dashboard/`);
        }
      } catch (error: any) {
        setErrors(error.response.data?.errors);
        scrollTo(0, 0);
      }
    },
  });
  const inEdit = true;
  return (
    <div className="container">
      <Header
        title={`Create Shop`}
        backButtonDisabled
        rightIcon={GrFormClose}
        onRightIconClick={() => router.push('/dashboard/')}
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
                <CardTextField
                  fieldValue={form.values.shop_email}
                  fieldName="shop_email"
                  fieldLabel="Shop Email"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.shop_email}
                />
                <CardTextField
                  fieldValue={form.values.shop_phone_number}
                  fieldName="shop_phone_number"
                  fieldLabel="Shop Phone Number"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.shop_phone_number}
                />
                {/* <CardMultiSelect
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
                /> */}
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
                    const newShopHours = [...shopHours];
                    newShopHours[index][type] = time;
                    setShopHours(newShopHours);
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
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.num_bays}
                />
                <CardTextField
                  fieldValue={form.values.address.street}
                  fieldName="address.street"
                  fieldLabel="Street Address"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.address?.street}
                />
                <CardTextField
                  fieldValue={form.values.address.city}
                  fieldName="address.city"
                  fieldLabel="City"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.address?.city}
                />
                <CardTextField
                  fieldValue={form.values.address.province}
                  fieldName="address.province"
                  fieldLabel="Province"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.address?.province}
                />
                <CardTextField
                  fieldValue={form.values.address.country}
                  fieldName="address.country"
                  fieldLabel="Country"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  fieldRequired
                  onChange={form.handleChange}
                  error={form.errors.address?.country}
                />
                <CardTextField
                  fieldValue={form.values.address.postal_code}
                  fieldName="address.postal_code"
                  fieldLabel="Postal Code"
                  fieldType="string"
                  fieldDisabled={!inEdit}
                  fieldRequired
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
  //  TODO: Need API to get shop details of current shop_owner account to allow edit functionality of page
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const user_type = parsedCookies.user_type;
  if (user_type === 'shop_owner') {
    return {
      props: {
        shop: {
          name: '',
          num_bays: '',
          address: {
            street: '',
            city: '',
            province: '',
            country: '',
            postal_code: '',
          },
        },
      },
    };
  }

  return {
    notFound: true,
  };
};

export default CreateShopPage;
