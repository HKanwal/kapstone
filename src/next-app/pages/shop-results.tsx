import type { NextPage, GetServerSideProps } from 'next';
import Header from '../components/Header';
import styles from '../styles/pages/ShopResults.module.css';
import { BsFilter } from 'react-icons/bs';
import ShopResult from '../components/ShopResult';
import Modal from '../components/Modal';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import SingleTextField from '../components/SingleTextField';
import DropdownField from '../components/DropdownField';
import DateRangePickerField from '../components/DateRangePickerField';
import { DateRangePickerValue } from '@mantine/dates';
import * as cookie from 'cookie';
import axios from 'axios';
import apiUrl from '../constants/api-url';

type ShopResult = {
  name: string;
  distance: string;
  cannedDetails?: {
    cost: number;
    time: string;
  };
};

// Must include 'Custom' because it gets special logic
const dateOptions = ['Today', 'This week', 'Next week', 'This month', 'Next month', 'Custom'];

const ShopResultsPage: NextPage = ({ shops }: any) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [shopResults, setShopResults] = useState([]);
  const [shopList, setShopList] = useState(shops);
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState('km');
  const [unitList, setUnitList] = useState(['km', 'miles'])
  const [dateRange, setDateRange] = useState('');
  const [customDates, setCustomDates] = useState<DateRangePickerValue>([null, null]);

  const handleFilterClick = () => {
    setFilterOpen((prev) => !prev);
  };

  const handleAppointmentClick = (shop: any) => {
    console.log('TODO: handle appointment click');
  };

  const handleCallClick = (phoneNumber: string) => {
    window.open(`tel: ${phoneNumber}`)
  };

  const applyFilters = () => {
    const filteredList: any = [];

    console.log(unit);

    if (distance !== '') {
      let distanceInMeters = parseFloat(distance);
      if (unit === 'km') {
        distanceInMeters = distanceInMeters * 1000;
      } else {
        distanceInMeters = distanceInMeters * 1609.34;
      }
      console.log(distanceInMeters);
      shops.forEach((shop: any) => {
        if (parseFloat(shop.distance_from_user_in_meters) <= distanceInMeters) {
          filteredList.push(shop);
        }
      });
      setShopList(filteredList);
    } else {
      setShopList(shops);
    }

    setFilterOpen((prev) => !prev);
    setDistance('');
  };

  console.log(shops);

  useEffect(() => {
    const results: any = [];
    console.log(shopList);
    shopList.forEach((shop: any) => {
      results.push(
        <div key={shop.id} className={styles['result-container']}>
          <ShopResult
            name={shop.name}
            distance={shop.distance_from_user}
            services={shop.shop_services.length > 0 ? shop.shop_services : undefined}
            // onClickAppointment={
            //   shop.shops_services.length() > 0 ? () => handleAppointmentClick(shop) : undefined
            // }
            onClickCall={shop.shop_phone_number !== null ? () => handleCallClick(shop.shop_phone_number) : undefined}
          />
        </div>
      )
    });
    setShopResults(results);
  }, [shopList]);

  return (
    <div className={styles.container}>
      <Header title="Shop Results" rightIcon={BsFilter} onRightIconClick={handleFilterClick} />
      <div className={styles.content}>
        {shopResults}
      </div>
      <Modal visible={filterOpen} onClose={() => setFilterOpen(false)} style={{ width: '85vw' }}>
        <div className={styles['field-container']}>
          <SingleTextField
            name="Distance limit"
            placeholder="Enter distance"
            onChange={(value) => setDistance(value)}
            rightItems={unitList}
            onRightItemChange={(value) => {
              setUnit(value);
              if (value === 'miles') {
                setUnitList(['miles', 'km']);
              } else {
                setUnitList(['km', 'miles']);
              }
            }}
            inputType="number"
          />
        </div>
        {/* <div className={styles['field-container']}>
          <DropdownField
            name="Date Range"
            placeholder="Select range"
            items={dateOptions}
            onSelect={setDateRange}
          />
        </div>
        {dateRange === 'Custom' ? (
          <div className={styles['field-container']}>
            <DateRangePickerField
              name="Custom Date Range"
              value={customDates}
              onChange={setCustomDates}
            />
          </div>
        ) : (
          <></>
        )} */}
        <Button title="Apply Filter(s)" width="100%" onClick={applyFilters} />
      </Modal>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const parsedCookies = cookie.parse(String(context.req.headers.cookie));
  const access_token = parsedCookies.access;
  const postalCode = parsedCookies.pocode;

  try {
    const shops = await axios.get(`${apiUrl}/shops/shops/distance/?postal_code=${postalCode}`, {
      headers: { Authorization: `JWT ${access_token}` },
    });
    return {
      props: {
        shops: shops.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        shops: [],
      },
    };
  }
};
export default ShopResultsPage;
