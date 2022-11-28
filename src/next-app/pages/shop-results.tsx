import type { NextPage } from 'next';
import Header from '../components/Header';
import styles from '../styles/pages/ShopResults.module.css';
import { BsFilter } from 'react-icons/bs';
import ShopResult from '../components/ShopResult';
import { useQuery } from 'react-query';

type ShopResult = {
  name: string;
  distance: string;
  cannedDetails?: {
    cost: number;
    time: string;
  };
};

const ShopResultsPage: NextPage = () => {
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

  const handleAppointmentClick = (i: number) => {
    console.log('TODO: handle appointment click');
  };

  const handleCallClick = (i: number) => {
    console.log('TODO: handle call click');
  };

  return (
    <div className={styles.container}>
      <Header
        title="Shop Results"
        rightIcon={BsFilter}
        onRightIconClick={() => console.log('clicked right icon')}
      />

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
    </div>
  );
};

export default ShopResultsPage;
