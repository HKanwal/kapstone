import type { NextPage } from 'next';
import Header from '../components/Header';
import styles from '../styles/pages/ShopResults.module.css';
import { BsFilter } from 'react-icons/bs';
import ShopResult from '../components/ShopResult';
import Modal from '../components/Modal';
import { useState } from 'react';
import Button from '../components/Button';
import SingleTextField from '../components/SingleTextField';
import DropdownField from '../components/DropdownField';
import DateRangePickerField from '../components/DateRangePickerField';
import { DateRangePickerValue } from '@mantine/dates';

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

const ShopResultsPage: NextPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  // TODO: fetch results from server
  const resultsData: ShopResult[] = [
    {
      name: 'Shop 1',
      distance: '4 km',
      cannedDetails: {
        cost: 500,
        time: '2 hours',
      },
    },
    {
      name: 'Shop 2',
      distance: '10 km',
    },
    {
      name: 'Shop 3',
      distance: '11 km',
    },
    {
      name: 'Shop 4',
      distance: '9 km',
      cannedDetails: {
        cost: 100,
        time: '1 hour',
      },
    },
  ];
  const [dateRange, setDateRange] = useState('');
  const [customDates, setCustomDates] = useState<DateRangePickerValue>([null, null]);

  const handleFilterClick = () => {
    setFilterOpen((prev) => !prev);
  };

  const handleAppointmentClick = (i: number) => {
    console.log('TODO: handle appointment click');
  };

  const handleCallClick = (i: number) => {
    console.log('TODO: handle call click');
  };

  const applyFilters = () => {
    console.log('TODO: handle application of filters');
  };

  return (
    <div className={styles.container}>
      <Header title="Shop Results" rightIcon={BsFilter} onRightIconClick={handleFilterClick} />

      <div className={styles.content}>
        {resultsData.map((result, i) => {
          return (
            <div key={i} className={styles['result-container']}>
              <ShopResult
                name={result.name}
                distance={result.distance}
                cannedDetails={result.cannedDetails}
                onClickAppointment={
                  result.cannedDetails ? () => handleAppointmentClick(i) : undefined
                }
                onClickCall={() => handleCallClick(i)}
              />
            </div>
          );
        })}
      </div>
      <Modal visible={filterOpen} onClose={() => setFilterOpen(false)} style={{ width: '85vw' }}>
        <div className={styles['field-container']}>
          <SingleTextField
            name="Distance limit"
            placeholder="Enter distance"
            rightItems={['km', 'miles']}
            inputType="number"
          />
        </div>
        <div className={styles['field-container']}>
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
        )}
        <Button title="Apply Filter(s)" width="100%" />
      </Modal>
    </div>
  );
};

export default ShopResultsPage;
