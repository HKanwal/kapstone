import type { NextPage } from 'next';
import Header from '../components/Header';
import styles from '../styles/pages/ShopResults.module.css';
import { BsFilter } from 'react-icons/bs';
import ShopResult from '../components/ShopResult';

const ShopResultsPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Header
        title="Shop Results"
        rightIcon={BsFilter}
        onRightIconClick={() => console.log('clicked right icon')}
      />

      <div className={styles.content}>
        <ShopResult
          name="Shop 1"
          distance="15 km"
          withAppointment
          onClickCall={() => console.log('TODO: Make quick call')}
        />
      </div>
    </div>
  );
};

export default ShopResultsPage;
