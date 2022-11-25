import type { NextPage } from 'next';
import { useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import TextMultiField from '../components/TextMultiField';
import Header from '../components/Header';
import styles from '../styles/pages/CreateShop.module.css';
import DropdownField from '../components/DropdownField';
import validateEmail from '../utils/validateEmail';
import { useRouter } from 'next/router';

const CreateShopPage: NextPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [email, setEmail] = useState('');
  const [emailErrors, setEmailErrors] = useState<Set<string> | undefined>(undefined);
  const [employees, setEmployees] = useState('');
  const [serviceBays, setServiceBays] = useState('');
  const valid = name.length > 0 && address.length > 0 && emailErrors === undefined;

  const handleSubmit = () => {
    router.push('/invite');
  };

  const handleEmailBlur = () => {
    if (email.length > 0 && !validateEmail(email)) {
      setEmailErrors(new Set(['Invalid email format']));
    } else {
      setEmailErrors(undefined);
    }
  };

  return (
    <div className={styles.container}>
      <Header title="Create New Shop" />

      <div className={styles.content}>
        <div className={styles['field-container']}>
          <TextField
            name="Shop Name"
            placeholder="Enter your shop's name"
            onChange={setName}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Shop Address"
            placeholder="Enter your shop's address"
            onChange={setAddress}
            required
          />
        </div>
        <div className={styles['field-container']}>
          <TextMultiField
            name="Shop Phone Number(s)"
            placeholder="Enter your shop's phone number"
            onChange={setPhoneNumbers}
            multi="Add phone number"
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Shop Email"
            placeholder="Enter your shop's email"
            onChange={setEmail}
            onBlur={handleEmailBlur}
            errors={emailErrors}
          />
        </div>
        <div className={styles['field-container']}>
          <DropdownField
            type="multi-select"
            name="Services Offered"
            placeholder="Enter services..."
            items={['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']}
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Number of Employees"
            placeholder="Enter number of employees"
            inputType="number"
            onChange={setEmployees}
          />
        </div>
        <div className={styles['field-container']}>
          <TextField
            name="Number of Service Bays"
            placeholder="Enter number of service bays"
            inputType="number"
            onChange={setServiceBays}
          />
        </div>
        <div className={styles['submit-container']}>
          <Button title="Create" disabled={!valid} width="80%" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateShopPage;
