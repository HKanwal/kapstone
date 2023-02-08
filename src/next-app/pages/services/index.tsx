import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios';
import Header from '../../components/Header';
import Link from 'next/link';
import apiUrl from '../../constants/api-url';

const ServicesList: NextPage = ({ services }: any) => {
  return (
    <div className="container">
      <Header title="Shop Services" />
      <div className="wrapper">
        <div className="flex flex-row row-gap-large">
          {services.map((service: any) => {
            return (
              <Link href={`/services/${service.id}`} key={service.id}>
                <a className="card hover-scale-up active-scale-down">
                  <div className="flex flex-row row-gap-small">
                    <span>
                      <b>Service Name</b>: @{service.name}
                    </span>
                    <span>
                      <b>Price</b>: @{service.price}
                    </span>
                    <span>
                      <b>Description</b>: @
                      {service.description.length > 45
                        ? service.description.slice(0, 30) + '...'
                        : service.description}
                    </span>
                    <span className="capitalize">
                      <b>Status</b>: {service.isActive}
                    </span>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async () => {
  try {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc2MjQ0OTgzLCJqdGkiOiIxZDg4MTJhYTg5ZmI0N2JjYjFlODU3ODU4NWZjMDNjMyIsInVzZXJfaWQiOjE0OH0.vZ8GjUqu9NUbGX4um7MSoCWI6OQVZrFDZQmJ6I57tlI';
    const services = await axios.get(`${apiUrl}/shops/services/`, {
      headers: { Authorization: `JWT ${token}` },
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
