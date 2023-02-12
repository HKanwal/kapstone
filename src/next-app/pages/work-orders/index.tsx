import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios';
import Header from '../../components/Header';
import Link from 'next/link';
import Moment from 'react-moment';
import 'moment-timezone';
import apiUrl from '../../constants/api-url';
// @ts-ignore
import * as cookie from 'cookie';
import { Radio } from '@mantine/core';
import { useState } from 'react';

const WorkOrdersList: NextPage = ({ workOrders }: any) => {
  const [sortStatus, setSortStatus] = useState('all');
  const workOrdersList = workOrders
    .filter((workOrder: any) => {
      if (sortStatus === 'all') {
        return true;
      }
      return workOrder.appointment?.status === sortStatus;
    })
    .map((workOrder: any) => {
      return (
        <Link href={`/work-orders/${workOrder.id}`} key={workOrder.id} legacyBehavior>
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
                <b>Time</b>: <Moment date={workOrder.appointment?.start_time} format="h:mm A" />
              </span>
              <span className="capitalize">
                <b>Status</b>: {workOrder.appointment?.status_display}
              </span>
            </div>
          </a>
        </Link>
      );
    });
  return (
    <div className="container">
      <Header title="Work Orders" />
      <div className="wrapper">
        <div className="flex flex-row">
          <Radio.Group
            label="Filter by Status"
            defaultValue={sortStatus}
            style={{ paddingBottom: '10px' }}
            onChange={(value) => setSortStatus(value)}
          >
            <Radio value="all" label="All" />
            <Radio value="completed" label="Completed" />
            <Radio value="in_progress" label="In Progress" />
          </Radio.Group>
        </div>
        <div className="flex flex-row row-gap-large">
          {workOrdersList.length > 0 ? workOrdersList : <p>No work orders found.</p>}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const access_token = parsedCookies.access;
  try {
    const workOrders = await axios.get(`${apiUrl}/shops/work-orders/`, {
      headers: { Authorization: `JWT ${access_token}` },
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
