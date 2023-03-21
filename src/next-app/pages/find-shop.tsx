import type { GetServerSideProps, NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import Button from '../components/Button';
import DropdownField from '../components/DropdownField';
import Header from '../components/Header';
import TextField from '../components/TextField';
import styles from '../styles/pages/FindShop.module.css';
import formStyles from '../styles/pages/Form.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import apiUrl from '../constants/api-url';
import * as cookie from 'cookie';

const FindShopPage: NextPage = ({ services, title }: any) => {
  const [postalCode, setPostalCode] = useState('');
  const [shopName, setShopName] = useState('');
  const [serviceOptions, setServiceOptions] = useState([]);
  const [serviceType, setServiceType] = useState('');
  const [checked, setChecked] = useState(false);
  const valid = postalCode.length > 0;
  const router = useRouter();
  const qr = Cookies.get('qr');

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const handleSubmit = () => {
    Cookies.set("pocode", postalCode);
    Cookies.set("shopName", shopName);
    Cookies.set("service", serviceType);
    Cookies.set("bookings", checked.toString());

    router.push({ pathname: '/shop-results' });
  };

  useEffect(() => {
    const tempServices: any = [];
    services.forEach((service: any) => {
      tempServices.push(service.name);
    });
    setServiceOptions(tempServices);
  }, [])

  return (
    <div className={formStyles['page-container']}>
      <Header title={title} />

      <div className={formStyles.content}>
        <div className={formStyles['field-container']}>
          <TextField
            name="Your Location"
            placeholder="Enter your postal code"
            onChange={setPostalCode}
            required
          />
        </div>
        <div className={formStyles['field-container']}>
          <TextField name="Shop Name" placeholder="Search for a specific shop" onChange={setShopName} />
        </div>
        <div className={formStyles['field-container']}>
          <DropdownField name="Service Type" items={serviceOptions} onSelect={setServiceType} />
        </div>
        <div className={formStyles['field-container']}>
          <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
          <label style={{ marginLeft: '1vw' }}>Show direct booking shops only</label>
        </div>
        <div className={formStyles['submit-container']}>
          <Button title="Search" disabled={!valid} width="80%" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  const qr = parsedCookies.qr;
  let title = 'Find Shop';
  if (qr && qr === 'true') {
    title = 'Send to Shops';
  }

  try {
    const services = await axios.get(`${apiUrl}/shops/services/`);
    return {
      props: {
        services: services.data,
        title: title,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        services: [],
        title: 'Find Shop',
      },
    };
  }
};

export default FindShopPage;