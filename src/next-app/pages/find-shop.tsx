import type { NextPage } from 'next';
import { useState } from 'react';
import Button from '../components/Button';
import DropdownField from '../components/DropdownField';
import Header from '../components/Header';
import TextField from '../components/TextField';
import styles from '../styles/pages/FindShop.module.css';
import formStyles from '../styles/pages/Form.module.css';

const FindShopPage: NextPage = () => {
  const [zipCode, setZipCode] = useState('');
  const [shopName, setShopName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const valid = zipCode.length > 0;
  const serviceTypes: string[] = []; // TODO: service types should be retrieved from database

  const handleSubmit = () => {
    // TODO: Redirect to shop results screen
    console.log('TODO: Redirect to shop results screen');
  };

  return (
    <div className={formStyles['page-container']}>
      <Header title="Find Shop" withoutBackBtn />

      <div className={formStyles.content}>
        <div className={formStyles['field-container']}>
          <TextField name="Your Location" placeholder="Enter your postal code" required />
        </div>
        <div className={formStyles['field-container']}>
          <TextField name="Shop Name" placeholder="Search for a specific shop" />
        </div>
        {/*<div className={formStyles['field-container']}>
          <DropdownField name='Service Type'  /> TODO: Use the single dropdown field component. Must wait until that PR is merged to continue.
        </div> */}
        <div className={formStyles['submit-container']}>
          <Button title="Create" disabled={!valid} width="80%" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default FindShopPage;
