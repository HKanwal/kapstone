import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useRef, useState, useContext } from 'react';
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
import apiUrl from '../constants/api-url';
import { AuthContext } from '../utils/api';
import Cookies from 'js-cookie';
import { accountTypes } from '../utils/api';

interface carModels {
  [make: string]: string[];
}

const QuoteRequestPage: NextPage = () => {
  const [authData, setAuthData] = useState(useContext(AuthContext));
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
  const [VIN, setVIN] = useState('');

  if (authData.access !== '') {
  } else if (Cookies.get('access') && Cookies.get('access') !== '') {
    setAuthData(
      {
        'access': Cookies.get('access') as string,
        'refresh': Cookies.get('refresh') as string,
        'user_type': Cookies.get('user_type') as accountTypes,
      }
    )
  }

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
    notes.length > 0 &&
    VIN.length > 0 &&
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
      <Header title="Create Quote Request" />

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
            <TextArea name="Notes" placeholder="Enter any additional notes" onChange={setNotes} required />
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
          <div className={styles['field-container']}>
            <TextField
              name="Vehicle ID Number"
              placeholder="Enter your VIN"
              onChange={setVIN}
              required
            />
          </div>
        </div>
        <Button
          title="Create"
          disabled={!valid}
          width="80%"
          onClick={() => {
            fetch(`${apiUrl}/quotes/quote-requests/bulk_create/`, {
              method: 'POST',
              body: JSON.stringify({
                'shops': [1, 4],
                'description': notes,
                'vehicle_vin': VIN,
                'vehicle_make': make,
                'vehicle_model': model,
                'vehicle_year': modelYear,
              }),
              headers: {
                'Authorization': `JWT ${authData.access}`,
                'Content-Type': 'application/json; charset=UTF-8',
              },
            }).then((response) => {
              console.log(response);
              response.json().then((response) => {
                console.log(response);
              })
            });
            console.log(
              'TODO: handle submit by verifying form, sending API request, and redirecting to find-shop'
            );
          }}
        />
      </div>
    </div>
  );
};

export default QuoteRequestPage;
