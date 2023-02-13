import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios';
import Header from '../../components/Header';
import Link from 'next/link';
import apiUrl from '../../constants/api-url';
// @ts-ignore
import * as cookie from 'cookie';

const ServicesList: NextPage = ({ services }: any) => {
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
              <b>Status</b>: {service.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </Link>
    );
  });
  return (
    <div className="container">
      <Header title="Shop Services" />
      <div className="wrapper">
        <div className="flex flex-row row-gap-large">
          {servicesList.length > 0 ? servicesList : <p>No services found.</p>}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  try {
    const parsedCookies = cookie.parse(context.req.headers.cookie);
    const access_token = parsedCookies.access;
    const services = await axios.get(`${apiUrl}/shops/services/`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        services: services.data,
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
