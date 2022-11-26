import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
import FieldLabel from '../components/FieldLabel';
import Link from '../components/Link';
import DatePicker from '../components/DatePicker';
import {
  DatePicker as MantineDatePicker,
  TimeRangeInput as MantineTimeRangeInput,
} from '@mantine/dates';
import DatePickerField from '../components/DatePickerField';
import TimeRangeField from '../components/TimeRangeField';

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
  const [preferredContact, setPreferredContact] = useState('None');
  const [notes, setNotes] = useState('');
  const [partCondition, setPartCondition] = useState('No Preference');
  const [partType, setPartType] = useState('No Preference');
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
  const addImageInputRef = useRef<HTMLInputElement>(null);
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [timeRange, setTimeRange] = useState<[Date | null, Date | null]>([null, null]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setImgFiles((prev) => {
      return [...prev, ...Array.from(e.target.files ?? [])];
    });
  };

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

  useEffect(() => {
    setModel('');
  }, [make]);

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
                selectedItems={model.length > 0 ? [model] : []}
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
              items={['None', 'Email', 'Phone']}
              selectedItems={[preferredContact]}
              onSelect={setPreferredContact}
            />
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Availability</span>
          <div className={styles['field-container']}>
            <DatePickerField name="Dates" value={dates} onChange={setDates} />
          </div>
          {dates.length > 0 ? (
            <div className={styles['field-container']}>
              <TimeRangeField name="Time Range" value={timeRange} onChange={setTimeRange} />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className={styles.section}>
          <span className={styles['section-header']}>Additional Information</span>
          <div className={styles['field-container']}>
            <DropdownField
              name="Part Condition"
              items={['No Preference', 'New Parts Only', 'Used Parts Only']}
              selectedItems={[partCondition]}
              onSelect={setPartCondition}
            />
          </div>
          <div className={styles['field-container']}>
            <DropdownField
              name="Part Type"
              items={['No Preference', 'OEM Parts Only', 'Aftermarket Parts Only']}
              selectedItems={[partType]}
              onSelect={setPartType}
            />
          </div>
          <div className={styles['field-container']}>
            <TextArea name="Notes" placeholder="Enter any additional notes" onChange={setNotes} />
          </div>
          <div className={styles['field-container']}>
            <div className={styles['images-field-container']}>
              <FieldLabel label="Images" />
              <div className={styles['images-container']}>
                {imgFiles.length > 0 ? (
                  imgFiles.map((file) => {
                    return (
                      <img
                        src={URL.createObjectURL(file)}
                        className={styles.image}
                        key={file.name + file.size.toString()}
                      />
                    );
                  })
                ) : (
                  <span className={styles['no-images-text']}>no images uploaded</span>
                )}
              </div>
              <input type="file" ref={addImageInputRef} onChange={handleFileUpload} hidden />
              <div className={styles['link-container']}>
                <Link text="+ Add Image" onClick={() => addImageInputRef.current?.click()} />
              </div>
            </div>
          </div>
        </div>
        <Button title="Create" disabled={!valid} width="80%" />
      </div>
    </div>
  );
};

export default QuoteRequestPage;
