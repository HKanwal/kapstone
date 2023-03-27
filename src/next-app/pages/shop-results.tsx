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
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { props } from 'cypress/types/bluebird';

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
  const [unitList, setUnitList] = useState(['km', 'miles']);
  const [shopModalVisible, setShopModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(<div></div>);
  const [dateRange, setDateRange] = useState('');
  const [customDates, setCustomDates] = useState<DateRangePickerValue>([null, null]);
  const nameFilter = Cookies.get('shopName');
  const service = Cookies.get('service');
  const bookings = Cookies.get('bookings');
  const handleFilterClick = () => {
    setFilterOpen((prev) => !prev);
  };
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const router = useRouter();

  const handleCallClick = (phoneNumber: string) => {
    window.open(`tel: ${phoneNumber}`)
  };

  const applyFilters = () => {
    const filteredList: any = [];

    if (distance !== '') {
      let distanceInMeters = parseFloat(distance);
      if (unit === 'km') {
        distanceInMeters = distanceInMeters * 1000;
      } else {
        distanceInMeters = distanceInMeters * 1609.34;
      }

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

  const openShopModal = (shop: any) => {
    setShopModalVisible(true);
    const hours: any = [];
    const services: any = [];

    shop.shophours_set.forEach((day: any) => {
      hours.push(
        <div key={day.id}>
          {day.day.toUpperCase()}
          <br></br>
          {day.from_time} - {day.to_time}
        </div>
      );
    });

    shop.shop_services.forEach((service: any) => {
      services.push(
        <div key={service.name}>
          {service.name}
        </div>
      );
    });

    const content = (
      <div>
        {shop.name}
        <br></br>
        {shop.address.street}, {shop.address.city}, {shop.address.province}, {shop.address.country}, {shop.address.postal_code}
        <br></br>
        {shop.shop_phone_number ? `Phone Number: ${shop.shop_phone_number}` : ''}
        <br></br>
        {shop.shop_email ? `Email: ${shop.shop_email}` : ''}
        <br></br>
        <div style={{ paddingTop: '2vh' }}>
          {hours.length > 0 ? 'Hours:' : ''}
          <div style={{ paddingLeft: '10vw' }}>
            {hours}
          </div>
        </div>
        <div style={{ paddingTop: '2vh' }}>
          {services.length > 0 ? 'Services:' : ''}
          <div style={{ paddingLeft: '10vw' }}>
            {services}
          </div>
        </div>
      </div >
    );
    setModalContent(content);
  }

  const onSelect = (id: number) => {
    setSelectedShops([...selectedShops, id.toString()]);
  }

  const onDeselect = (id: number) => {
    setSelectedShops(selectedShops.filter((selectedShopId) => selectedShopId !== id.toString()));
  }

  const handleAppointmentClick = (shop: any) => {
    router.push({
      pathname: '/book-appointment',
      query: { shopId: shop.id },
    });
  };

  const shopResult = (shop: any) => {
    return (
      <div key={shop.id} className={styles['result-container']}>
        <ShopResult
          name={shop.name}
          id={shop.id}
          shop={shop}
          onClick={() => openShopModal(shop)}
          distance={shop.distance_from_user}
          onSelect={onSelect}
          onDeselect={onDeselect}
          services={shop.shop_services.length > 0 && service ? shop.shop_services : undefined}
          showAppointment={shop.shop_services.length > 0 && service ? true : false}
          onClickAppointment={shop.shop_services.length > 0 && service ? () => handleAppointmentClick(shop) : () => { }}
          onClickCall={shop.shop_phone_number !== null ? () => handleCallClick(shop.shop_phone_number) : undefined}
        />
      </div>
    );
  }

  useEffect(() => {
    const results: any = [];

    if (selectedShops.length > 0) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }

    if (bookings && bookings == 'true') {
      if (nameFilter && !service) {
        shopList.forEach((shop: any) => {
          if (shop.name.toUpperCase().includes(nameFilter.toUpperCase()) && shop.shop_services.length > 0) {
            results.push(shopResult(shop));
          }
        });
      } else if (!nameFilter && service) {
        shopList.forEach((shop: any) => {
          let hasService = false;
          shop.shop_services.forEach((serviceType: any) => {
            if (serviceType.name === service) {
              hasService = true;
            }
          });

          if (hasService) {
            results.push(shopResult(shop));
          }
        });
      } else if (nameFilter && service) {
        shopList.forEach((shop: any) => {
          let hasService = false;
          shop.shop_services.forEach((serviceType: any) => {
            if (serviceType.name === service) {
              hasService = true;
            }
          });

          if (shop.name.toUpperCase().includes(nameFilter.toUpperCase()) && hasService) {
            results.push(shopResult(shop));
          }
        });
      } else {
        shopList.forEach((shop: any) => {
          if (shop.shop_services.length > 0) {
            results.push(shopResult(shop));
          }
        });
      }
    } else {
      if (nameFilter && !service) {
        shopList.forEach((shop: any) => {
          if (shop.name.toUpperCase().includes(nameFilter.toUpperCase())) {
            results.push(shopResult(shop));
          }
        });
      } else if (!nameFilter && service) {
        shopList.forEach((shop: any) => {
          let hasService = false;
          shop.shop_services.forEach((serviceType: any) => {
            if (serviceType.name === service) {
              hasService = true;
            }
          });

          if (hasService) {
            results.push(shopResult(shop));
          }
        });
      } else if (nameFilter && service) {
        shopList.forEach((shop: any) => {
          let hasService = false;
          shop.shop_services.forEach((serviceType: any) => {
            if (serviceType.name === service) {
              hasService = true;
            }
          });

          if (shop.name.toUpperCase().includes(nameFilter.toUpperCase()) && hasService) {
            results.push(shopResult(shop));
          }
        });
      } else {
        shopList.forEach((shop: any) => {
          results.push(shopResult(shop));
        });
      }
    }
    setShopResults(results);
  }, [shopList, selectedShops]);

  return (
    <div className={styles.container}>
      <Header title="Shop Results" rightIcon={BsFilter} onRightIconClick={handleFilterClick} />
      <div className={styles.content}>
        {shopResults}
      </div>
      <Modal visible={shopModalVisible} onClose={() => setShopModalVisible(false)}>
        {modalContent}
      </Modal>
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
  const postalCode = parsedCookies.pocode;
  try {
    const shops = await axios.get(`${apiUrl}/shops/shops/distance/?postal_code=${postalCode}`);
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
