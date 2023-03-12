import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios';
import Link from 'next/link';
import apiUrl from '../../constants/api-url';
import { useRouter } from 'next/router';
import { GrAddCircle } from 'react-icons/gr';
import styles from '../../styles/components/Header.module.css';
import IconButton from '../../components/IconButton';
import { IoMdArrowBack } from 'react-icons/io';
// @ts-ignore
import * as cookie from 'cookie';

const ServicesList: NextPage = ({ services, shop }: any) => {
  const router = useRouter();
  const servicesList = services.map((service: any) => {
    return (
      <Link href={`/services/${service.id}`} key={service.id}>
        <div className="card hover-scale-up active-scale-down">
          <div className="flex flex-row row-gap-small">
            <span>
              <b>Service Name</b>: {service.name}
            </span>
            <span>
              <b>Price</b>: {service.price}
            </span>
            <span>
              <b>Description</b>:{' '}
              {service.description.length > 45
                ? service.description.slice(0, 45) + '...'
                : service.description}
            </span>
            <span className="capitalize">
              <b>Status</b>: {service.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </Link>
    );
  });
  return (
    <div className="container">
      <div className={styles.header}>
        <div className={styles['back-btn-container']}>
          <IconButton icon={IoMdArrowBack} onClick={() => router.push('/dashboard')} />
        </div>
        <span className={styles.title}>Shop Services</span>
        <div className={styles['right-btn-container']}>
          <IconButton icon={GrAddCircle} onClick={() => router.push('/services/create-service')} />
        </div>
      </div>
      <div className="wrapper">
        <div className="grid-list">
          {servicesList.length > 0 ? servicesList : <p>No services found.</p>}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  try {
    const parsedCookies = cookie.parse(String(context.req.headers.cookie));
    const access_token = parsedCookies.access;
    const services = await axios.get(`${apiUrl}/shops/services/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    const shop = await axios.get(`${apiUrl}/shops/shops/me/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        services: services.data,
        shop: shop.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        services: [],
      },
    };
  }
};

export default ServicesList;
