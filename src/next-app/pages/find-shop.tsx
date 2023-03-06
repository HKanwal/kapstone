import type { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import Button from '../components/Button';
import DropdownField from '../components/DropdownField';
import Header from '../components/Header';
import TextField from '../components/TextField';
import { serviceTypes } from '../constants/service-types';
import styles from '../styles/pages/FindShop.module.css';
import formStyles from '../styles/pages/Form.module.css';

const FindShopPage: NextPage = () => {
  const [zipCode, setZipCode] = useState('');
  const [shopName, setShopName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [checked, setChecked] = useState(false);
  const valid = zipCode.length > 0;

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const handleSubmit = () => {
    // TODO: Redirect to shop results screen, send api req
    console.log('TODO: Redirect to shop results screen');
  };

  return (
    <div className={formStyles['page-container']}>
      <Header title="Find Shop" />

      <div className={formStyles.content}>
        <div className={formStyles['field-container']}>
          <TextField
            name="Your Location"
            placeholder="Enter your postal code"
            onChange={setZipCode}
            required
          />
        </div>
        <div className={formStyles['field-container']}>
          <TextField name="Shop Name" placeholder="Search for a specific shop" />
        </div>
        <div className={formStyles['field-container']}>
          <DropdownField name="Service Type" items={serviceTypes} onSelect={setServiceType} />
        </div>
        <div className={formStyles['field-container']}>
          <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
          <label style={{ marginLeft: '1vw' }}>Show direct booking shops only</label>
        </div>
        <div className={formStyles['submit-container']}>
          <Button title="Create" disabled={!valid} width="80%" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default FindShopPage;
