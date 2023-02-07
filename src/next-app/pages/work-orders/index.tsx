import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios';
import Header from '../../components/Header';
import Link from 'next/link';
import Moment from 'react-moment';
import 'moment-timezone';
import apiUrl from '../../constants/api-url';

const WorkOrdersList: NextPage = ({ workOrders }: any) => {
  return (
    <div className="container">
      <Header title="Work Orders" />
      <div className="wrapper">
        <div className="flex flex-row row-gap-large">
          {workOrders.map((workOrder: any) => {
            return (
              <Link href={`/work-orders/${workOrder.id}`} key={workOrder.id}>
                <a className="card hover-scale-up active-scale-down">
                  <div className="flex flex-row row-gap-small">
                    <span>
                      <b>Customer</b>: @{workOrder.appointment.customer?.username}
                    </span>
                    <span>
                      <b>Employee</b>: @{workOrder.employee?.username}
                    </span>
                    <span>
                      <b>Date</b>:{' '}
                      <Moment date={workOrder.appointment?.start_time} format="MMM D, YYYY" />
                    </span>
                    <span>
                      <b>Time</b>:{' '}
                      <Moment date={workOrder.appointment?.start_time} format="h:mm A" />
                    </span>
                    <span className="capitalize">
                      <b>Status</b>: {workOrder.appointment?.status}
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
    const workOrders = await axios.get(`${apiUrl}/shops/work-orders/`, {
      headers: { Authorization: `JWT ${token}` },
    });
    return {
      props: {
        workOrders: workOrders.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        workOrders: [],
      },
    };
  }
};

export default WorkOrdersList;