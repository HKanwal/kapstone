import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import Modal from '../components/Modal';
import styles from '../styles/pages/QuoteRequest.module.css';
import SingleDropdownField from '../components/SingleDropdownField';
import carData from '../data/data.json';
import validateEmail from '../utils/validateEmail';
import TextArea from '../components/TextArea';
import ShopCard from '../components/ShopCard';

interface carModels {
  [make: string]: string[],
}

interface checkedShops {
  [shop: string]: boolean
}

const QuoteRequestPage: NextPage = () => {
  const [name, setName] = useState('');
  const [make, setMake] = useState('');
  const [customMake, setCustomMake] = useState('');
  const [model, setModel] = useState('');
  const [modelYear, setModelYear] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [emailErrors, setEmailErrors] = useState<Set<string> | undefined>(undefined);
  const [preferredContact, setPreferredContact] = useState('');
  const [notes, setNotes] = useState('');
  const [partPreferenceSeller, setPartPreferenceSeller] = useState('');
  const [partPreferenceType, setPartPreferenceType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [open, setOpen] = useState(false);
  const [checkedShops, setCheckedShops] = useState({} as checkedShops);
  const [disableSubmitShops, setDisableSubmitShops] = useState(true);
  const [checkedShopsDisplay, setCheckedShopsDisplay] = useState([] as JSX.Element[]);
  const [formValid, setFormValid] = useState(false);
  const [makesList, setMakesList] = useState([] as string[]);
  const [modelsList, setModelsList] = useState({} as carModels);

  const today = new Date();
  const minDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  console.log(formValid);
  if (name.length > 0 &&
    (make.length > 0 || customMake.length > 0) &&
    (model.length > 0 || customModel.length > 0) &&
    modelYear.length > 0 &&
    firstName.length > 0 &&
    lastName.length > 0 &&
    phoneNumber.length > 0 &&
    email.length > 0 &&
    (emailErrors && emailErrors.size === 0) &&
    checkedShopsDisplay.length > 0) {
    setFormValid(true);
  }

  useEffect(() => {
    let makes: string[] = [];
    let models: carModels = {};
    carData.carData.forEach((entry) => {
      makes.push(entry.make);
      models[entry.make] = [];
      models[entry.make] = entry.models.sort((a, b) => {
        if (a == 'Other') {
          return 1;
        }
        if (b == 'Other') {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1
        }
        return 0
      });
    });
    makes.sort();
    makes.push('Other');
    setMakesList(makes);
    setModelsList(models);
  }, []);

  const handleEmailBlur = () => {
    if (email.length > 0 && !validateEmail(email)) {
      setEmailErrors(new Set(['Invalid email format']));
    } else {
      setEmailErrors(undefined);
    }
  };

  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = e => {
      // this.extractWordRawText(e.target.result);
    };

    // this.setState({ title: file.name });
  };

  const handleSelectShops = () => {
    setOpen(true);
  }

  const handleChecks = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckedShops({ ...checkedShops, [e.target.name]: e.target.checked });
    if (e.target.checked) {
      setDisableSubmitShops(false);
    } else {
      for (const shop in checkedShops) {
        console.log(checkedShops[shop]);
        if (e.target.name != shop && checkedShops[shop]) {
          setDisableSubmitShops(false);
          return;
        }
      }
      setDisableSubmitShops(true);
    }
  }

  const handleRemoveShop = (shop: string, checkedShops: checkedShops) => {
    console.log(shop);
    console.log(checkedShops);
    const newCheckedShops = { ...checkedShops, [shop]: false };
    setCheckedShops(newCheckedShops);
    handleShopsRefresh(shop, newCheckedShops);
  }

  const handleShopsSubmit = () => {
    setOpen(false);
    const checkedShopsDisplay = [];
    for (const shop in checkedShops) {
      if (checkedShops[shop]) {
        checkedShopsDisplay.push(
          <div className={styles['shop-card']} key={shop}>
            <div className={styles['shop-title-container']}>
              <label key={shop}>
                {shop}
              </label>
            </div>
            <div className={styles['remove-button-container']}>
              <button className={styles['remove-button']} onClick={() => { handleRemoveShop(shop, checkedShops) }}>Remove</button>
            </div>
          </div>
        )
      }
    }
    console.log(checkedShopsDisplay)
    setCheckedShopsDisplay(checkedShopsDisplay);
  }

  const handleShopsRefresh = (removedShop: string, newCheckedShops: checkedShops) => {
    const checkedShopsDisplay = [];
    console.log(newCheckedShops);

    for (const shop in newCheckedShops) {
      if (newCheckedShops[shop] && removedShop !== shop) {
        checkedShopsDisplay.push(
          <div className={styles['shop-card']} key={shop}>
            <div className={styles['shop-title-container']}>
              <label key={shop}>
                {shop}
              </label>
            </div>
            <div className={styles['remove-button-container']}>
              <button className={styles['remove-button']} onClick={() => { handleRemoveShop(shop, checkedShops) }}>Remove</button>
            </div>
          </div>
        )
        console.log(checkedShopsDisplay);
      }
    }
    console.log(checkedShopsDisplay);
    setCheckedShopsDisplay(checkedShopsDisplay);
  }

  return (
    <div>
      <Header title="Create Quote Request" />
      <div className={styles.subtitle}>
        <label>
          Vehicle Information
        </label>
      </div>
      <div className={styles.content}>
        <div className={styles['text-container']}>
          <TextField name="Quote Request Name" placeholder="Enter a quote request name" onChange={setName} required />
        </div>
        <div className={styles['text-container']}>
          <SingleDropdownField name="Select Vehicle Make" placeholder='Select your vehicle make' items={makesList} onChange={setMake} required />
        </div>
        {make === 'Other' ?
          <div className={styles['text-container']}>
            <div>
              <TextField name='Enter Vehicle Make' placeholder="Enter your vehicle make" onChange={setCustomMake} required />
            </div>
            <div>
              <TextField name='Enter Vehicle Model' placeholder="Enter your vehicle model" onChange={setCustomModel} required />
            </div>
          </div>
          : null
        }
        {make && make !== 'Other' ?
          <div className={styles['text-container']}>
            <SingleDropdownField name="Select Vehicle Model" placeholder='Select your vehicle model' items={modelsList[make]} onChange={setModel} required />
          </div>
          : null
        }
        {model || customModel ?
          <div className={styles['text-container']}>
            <TextField name="Vehicle Model Year" placeholder="Enter vehicle model year" onChange={setModelYear} required inputType='number' width={'50%'} />
          </div> : null
        }
      </div>
      <div className={styles.subtitle}>
        <label>
          Contact Information
        </label>
      </div>
      <div className={styles.content}>
        <div className={styles['text-container']}>
          <TextField name="First Name" placeholder="Enter your first name" onChange={setFirstName} required />
        </div>
        <div className={styles['text-container']}>
          <TextField name="Last Name" placeholder="Enter your last name" onChange={setLastName} required />
        </div >
        <div className={styles['text-container']}>
          <TextField name="Phone Number" placeholder="Enter your phone number" onChange={setPhoneNumber} required />
        </div>
        <div className={styles['text-container']}>
          <TextField name="Email" placeholder="Enter your email" onChange={setEmail} onBlur={handleEmailBlur} errors={emailErrors} required />
        </div>
        <div className={styles['text-container']}>
          <SingleDropdownField name="Preferred Contact Method" placeholder="None" items={['Email', 'Phone']} onChange={setPreferredContact} />
        </div>
      </div>
      <div className={styles.subtitle}>
        <label>
          Quote Request Information
        </label>
      </div>
      <div className={styles.content}>
        <div className={styles['text-container']}>
          <SingleDropdownField name="New or Used Part Preference" placeholder="No Preference" items={['New Parts Only', 'Used Parts Only', 'No Preference']} onChange={setPartPreferenceSeller} />
        </div>
        <div className={styles['text-container']}>
          <SingleDropdownField name="OEM or Aftermarket Part Preference" placeholder="No Preference" items={['OEM Parts Only', 'Aftermarket Parts Only', 'No Preference']} onChange={setPartPreferenceType} />
        </div>
        <div className={styles['text-container']}>
          <TextArea name='Additional Notes' placeholder='Enter any additional notes here.' onChange={setNotes} />
        </div>
      </div>
      <div className={styles.subtitle}>
        {/* <ImagePicker
                    extensions={["docx"]} // Notice that I removed the "."
                    onChange={handleFileChange}
                // onError={errMsg => console.log(errMsg)} // Please handle error
                > */}
        <Button title="Add Image" />
        {/* </ImagePicker> */}
        <br />
        <div className={styles.images}>
          <label>
            Images:
          </label>
          <br />
          <div className={styles['image-list']}>
          </div>
        </div>
        <br />
      </div>
      <div className={styles.content}>
        <div className={styles['date-container']}>
          <div className={styles['start-date']}>
            <TextField name="Preferred Availability" onChange={setStartDate} min={minDate} inputType='date' />
          </div>
          {startDate ?
            <div className={styles['end-date']}>
              <TextField name="Latest Preferred Availability" onChange={setEndDate} min={startDate} inputType='date' />
            </div> : null
          }
        </div>
      </div>
      <div className={styles['select-shop-button-container']}>
        <Button title="Select Shops" width="50%" onClick={handleSelectShops} />
      </div>
      {open ?
        <Modal visible={open} onClose={() => { setOpen(false) }}>
          <div className={styles['select-shops-modal']}>
            <div className={styles['modal-title']}>
              <label>Select shops to send quote request to:</label>
            </div>
            <div className={styles['card-container']}>
              <input className='checkbox' name='Shop1' checked={checkedShops['Shop1']} onChange={handleChecks} type="checkbox"></input>
              <ShopCard name='Shop1' />
            </div>
            <br />
            <div className={styles['card-container']}>
              <input className='checkbox' name='Shop2' checked={checkedShops['Shop2']} onChange={handleChecks} type="checkbox"></input>
              <ShopCard name='Shop2' />
            </div>
            <br />
            <div className={styles['card-container']}>
              <input className='checkbox' name='Shop3' checked={checkedShops['Shop3']} onChange={handleChecks} type="checkbox"></input>
              <ShopCard name='Shop3' />
            </div>
            <br />
            {/* <Button title="Submit" width="100%" disabled={disableSubmitShops} onClick={handleShopsSubmit} /> */}
            <Button title="Submit" width="100%" onClick={handleShopsSubmit} />
          </div></Modal> : null
      }
      <div className={styles.content}>
        {checkedShopsDisplay}
        <Button title="Login" width="80%" disabled={!formValid} />
      </div >
    </div >
  );
};

export default QuoteRequestPage;
