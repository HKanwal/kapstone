import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import Modal from '../components/Modal';
import styles from '../styles/pages/QuoteRequest.module.css';
import carData from '../data/data.json';
import validateEmail from '../utils/validateEmail';
import TextArea from '../components/TextArea';
import ShopCard from '../components/ShopCard';
import DropdownField from '../components/DropdownField';

interface carModels {
  [make: string]: string[];
}

interface shopObject {
  name: string;
  id: string;
}

interface previousSubmittedShops {
  [id: string]: { checked: boolean; name: string };
}

const QuoteRequestPage: NextPage = () => {
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
  const [checkedShops, setCheckedShops] = useState([] as shopObject[]);
  const [submittedShops, setSubmittedShops] = useState([] as shopObject[]);
  const [submittedShopsDisplay, setSubmittedShopsDisplay] = useState([] as JSX.Element[]);
  const [previousSubmittedShops, setPreviousSubmittedShops] = useState(
    {} as previousSubmittedShops
  );
  const [disableSubmitShops, setDisableSubmitShops] = useState(true);
  const [makesList, setMakesList] = useState([] as string[]);
  const [modelsList, setModelsList] = useState({} as carModels);

  const today = new Date();
  const minDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let valid = false;
  if (
    make.length < 1 ||
    customMake.length < 1 ||
    model.length < 1 ||
    customModel.length < 1 ||
    modelYear.length < 1 ||
    firstName.length < 1 ||
    lastName.length < 1 ||
    phoneNumber.length < 1 ||
    email.length < 1 ||
    (emailErrors && emailErrors.size > 0) ||
    submittedShops.length === 0
  ) {
    valid = true;
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
          return -1;
        }
        return 0;
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

  const handleSelectShops = () => {
    const tempPreviousSubmittedShops: previousSubmittedShops = {};
    // Sets initial check marks for previously checked shops
    submittedShops.forEach((shop) => {
      tempPreviousSubmittedShops[shop.id] = { checked: true, name: shop.name };
    });
    setPreviousSubmittedShops(tempPreviousSubmittedShops);
    setOpen(true);
  };

  const handleChecks = (e: ChangeEvent<HTMLInputElement>, checkedShop: shopObject) => {
    if (e.target.checked) {
      // If checked, add checked shop to the previous submitted shops and checked shops
      setPreviousSubmittedShops({
        ...previousSubmittedShops,
        [checkedShop.id]: { checked: true, name: checkedShop.name },
      });
      setCheckedShops([...checkedShops, { name: checkedShop.name, id: checkedShop.id }]);
      setDisableSubmitShops(false);
    } else {
      // If unchecked remove shop from previous submitted shops and checked shops
      setPreviousSubmittedShops({
        ...previousSubmittedShops,
        [checkedShop.id]: { checked: false, name: checkedShop.name },
      });
      checkedShops.forEach((shop) => {
        if (shop.id === checkedShop.id) {
          const index = checkedShops.indexOf(shop);
          if (index !== -1) {
            checkedShops.splice(index, 1);
            setSubmittedShops([...checkedShops]);
          }
        }
      });
    }
  };

  // Remove shop from previous submitted shops and submitted shops
  const handleRemoveShop = (removedShop: shopObject) => {
    setPreviousSubmittedShops({
      ...previousSubmittedShops,
      [removedShop.id]: { checked: false, name: removedShop.name },
    });
    const index = submittedShops.indexOf(removedShop);
    if (index !== -1) {
      submittedShops.splice(index, 1);
      setSubmittedShops([...submittedShops]);
    }
  };

  // Each time submitted shops are changed run refresh to update the list of shop UI elements to display
  useEffect(() => {
    handleShopsRefresh();
  }, [submittedShops]);

  // Update list of shop UI elements to display
  const handleShopsRefresh = () => {
    const submittedShopsDisplay: JSX.Element[] = [];
    submittedShops.forEach((shop: shopObject) => {
      submittedShopsDisplay.push(
        <div className={styles['shop-card']} key={shop.id}>
          <div className={styles['shop-title-container']}>
            <label>{shop.name}</label>
          </div>
          <div className={styles['remove-button-container']}>
            <button
              className={styles['remove-button']}
              onClick={() => {
                handleRemoveShop(shop);
              }}>
              Remove
            </button>
          </div>
        </div>
      );
    });
    setSubmittedShopsDisplay(submittedShopsDisplay);
  };

  // Add checked shops and previously submitted shops (shops that are initially selected) to submitted shops
  const handleShopsSubmit = () => {
    setOpen(false);
    const allCheckedShops = [...checkedShops];
    checkedShops.forEach((checkedShop) => {
      setPreviousSubmittedShops({
        ...previousSubmittedShops,
        [checkedShop.id]: { checked: true, name: checkedShop.name },
      });
    });
    for (const shop in previousSubmittedShops) {
      if (previousSubmittedShops[shop].checked) {
        const tempItem = { name: previousSubmittedShops[shop].name, id: shop };
        if (allCheckedShops.filter((checkedShop) => checkedShop.id === shop).length === 0) {
          allCheckedShops.push(tempItem);
        }
      }
    }
    allCheckedShops.sort((shop1, shop2) => {
      return parseInt(shop1.id) - parseInt(shop2.id);
    });
    setSubmittedShops(allCheckedShops);
    setCheckedShops([]);
    handleShopsRefresh();
  };

  return (
    <div className={styles.container}>
      <Header title="Create Quote Request" />

      <div className={styles.content}>
        <div className={styles.section}>
          <span className={styles['section-header']}>Vehicle Information</span>
          <div
            className={styles['field-container']}
            style={make === 'Other' ? { paddingBottom: 0 } : {}}>
            <DropdownField
              name="Manufacturer"
              placeholder="Enter manufacturer..."
              items={makesList}
              onSelect={setMake}
              required
            />
          </div>
          {make === 'Other' ? (
            <>
              <div className={styles['field-container']}>
                <TextField
                  name=""
                  placeholder="Enter vehicle manufacturer"
                  onChange={setCustomMake}
                  required
                />
              </div>
              <div className={styles['field-container']}>
                <TextField
                  name="Model"
                  placeholder="Enter vehicle model"
                  onChange={setCustomModel}
                  required
                />
              </div>
            </>
          ) : null}
          {make && make !== 'Other' ? (
            <div className={styles['field-container']}>
              <DropdownField
                name="Model"
                placeholder="Enter model..."
                items={modelsList[make]}
                onSelect={setModel}
                required
              />
            </div>
          ) : null}
          {model || customModel ? (
            <div className={styles['field-container']}>
              <TextField
                name="Model Year"
                placeholder="Enter vehicle model year"
                onChange={setModelYear}
                required
                inputType="number"
              />
            </div>
          ) : null}
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Contact Information</span>
          <div className={styles['field-container']}>
            <TextField
              name="First Name"
              placeholder="Enter your first name"
              onChange={setFirstName}
              required
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Last Name"
              placeholder="Enter your last name"
              onChange={setLastName}
              required
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Phone Number"
              placeholder="Enter your phone number"
              onChange={setPhoneNumber}
              required
            />
          </div>
          <div className={styles['field-container']}>
            <TextField
              name="Email"
              placeholder="Enter your email"
              onChange={setEmail}
              onBlur={handleEmailBlur}
              errors={emailErrors}
              required
            />
          </div>
          <div className={styles['field-container']}>
            <DropdownField
              name="Preferred Contact Method"
              placeholder="None"
              items={['Email', 'Phone']}
              onSelect={setPreferredContact}
            />
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Additional Information</span>
          <div className={styles['field-container']}>
            <DropdownField
              name="New or Used Part Preference"
              placeholder="No Preference"
              items={['New Parts Only', 'Used Parts Only', 'No Preference']}
              onSelect={setPartPreferenceSeller}
            />
          </div>
          <div className={styles['field-container']}>
            <DropdownField
              name="OEM or Aftermarket Part Preference"
              placeholder="No Preference"
              items={['OEM Parts Only', 'Aftermarket Parts Only', 'No Preference']}
              onSelect={setPartPreferenceType}
            />
          </div>
          <div className={styles['field-container']}>
            <TextArea
              name="Additional Notes"
              placeholder="Enter any additional notes here."
              onChange={setNotes}
            />
          </div>
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
          <label>Images:</label>
          <br />
          <div className={styles['image-list']}></div>
        </div>
        <br />
      </div>
      <div className={styles.content}>
        <div className={styles['date-container']}>
          <div className={styles['start-date']}>
            <TextField
              name="Preferred Availability"
              onChange={setStartDate}
              min={minDate}
              inputType="date"
            />
          </div>
          {startDate ? (
            <div className={styles['end-date']}>
              <TextField
                name="Latest Preferred Availability"
                onChange={setEndDate}
                min={startDate}
                inputType="date"
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className={styles['select-shop-button-container']}>
        <Button title="Select Shops" width="50%" onClick={handleSelectShops} />
      </div>
      {open ? (
        <Modal
          visible={open}
          onClose={() => {
            setCheckedShops([]);
            setPreviousSubmittedShops({});
            setOpen(false);
          }}>
          <div className={styles['select-shops-modal']}>
            <div className={styles['modal-title']}>
              <label>Select shops to send quote request to:</label>
            </div>
            <div className={styles['card-container']}>
              <input
                className="checkbox"
                name="Shop1"
                checked={
                  previousSubmittedShops['1'] ? previousSubmittedShops['1'].checked : undefined
                }
                onChange={(e) => handleChecks(e, { name: 'Shop1', id: '1' })}
                type="checkbox"></input>
              <ShopCard name="Shop1" />
            </div>
            <br />
            <div className={styles['card-container']}>
              <input
                className="checkbox"
                name="Shop2"
                checked={
                  previousSubmittedShops['2'] ? previousSubmittedShops['2'].checked : undefined
                }
                onChange={(e) => handleChecks(e, { name: 'Shop2', id: '2' })}
                type="checkbox"></input>
              <ShopCard name="Shop2" />
            </div>
            <br />
            <div className={styles['card-container']}>
              <input
                className="checkbox"
                name="Shop3"
                checked={
                  previousSubmittedShops['3'] ? previousSubmittedShops['3'].checked : undefined
                }
                onChange={(e) => handleChecks(e, { name: 'Shop3', id: '3' })}
                type="checkbox"></input>
              <ShopCard name="Shop3" />
            </div>
            <br />
            <Button title="Submit" width="100%" onClick={handleShopsSubmit} />
          </div>
        </Modal>
      ) : null}
      <div className={styles.content}>
        {submittedShopsDisplay}
        <Button title="Submit" width="80%" disabled={valid} />
      </div>
    </div>
  );
};

export default QuoteRequestPage;
