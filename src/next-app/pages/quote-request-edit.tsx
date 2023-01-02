import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Header from '../components/Header';
import styles from '../styles/pages/QuoteRequest.module.css';
import carData from '../data/data.json';
import validateEmail from '../utils/validateEmail';
import TextArea from '../components/TextArea';
import DropdownField from '../components/DropdownField';
import FieldLabel from '../components/FieldLabel';
import Link from '../components/Link';
import DatePickerField from '../components/DatePickerField';
import TimeRangeField from '../components/TimeRangeField';

interface carModels {
  [make: string]: string[];
}

const QuoteRequestEditPage: NextPage = () => {
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
  const [makesList, setMakesList] = useState([] as string[]);
  const [modelsList, setModelsList] = useState({} as carModels);
  const addImageInputRef = useRef<HTMLInputElement>(null);
  const [imgFiles, setImgFiles] = useState<File[]>([]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setImgFiles((prev) => {
      return [...prev, ...Array.from(e.target.files ?? [])];
    });
  };

  let valid = false;
  if (
    make.length > 0 &&
    model.length > 0 &&
    modelYear.length > 0 &&
    firstName.length > 0 &&
    lastName.length > 0 &&
    phoneNumber.length > 0 &&
    email.length > 0 &&
    emailErrors === undefined
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

  return (
    <div className={styles.container}>
      <Header title="Edit Quote Request" />

      <div className={styles.content}>
        <div className={styles.section}>
          <span className={styles['section-header']}>Vehicle Information</span>
          <div
            className={styles['field-container']}
            style={make === 'Other' ? { paddingBottom: 0 } : {}}
          >
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
        <Button
          title="Create"
          disabled={!valid}
          width="80%"
          onClick={() => {
            console.log(
              'TODO: handle submit by verifying form, sending API request, and redirecting to find-shop'
            );
          }}
        />
      </div>
    </div>
  );
};

export default QuoteRequestEditPage;
