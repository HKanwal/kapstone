import type { NextPage, GetServerSideProps } from 'next';
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
import axios from 'axios';
import { CardMultiSelect, CardTextField } from '../components/CardComponents';
import { useRouter } from 'next/router';
import Modal from '../components/Modal';
import { FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import Skeleton from 'react-loading-skeleton';
// import { Link as NextLink } from 'next/link';

const SKELETON_LIST_LENGTH = 10;

interface carModels {
  [make: string]: string[];
}

const QuoteRequestPage: NextPage = (props: any) => {
  const [authData, setAuthData] = useState(useContext(AuthContext));
  const [make, setMake] = useState('');
  const [customMake, setCustomMake] = useState('');
  const [model, setModel] = useState('');
  const [modelYear, setModelYear] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [shopSelectionModal, setShopSelectionModal] = useState(false);
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
  const [shops, setShops] = useState<any>([]);
  const [shopsList, setShopsList] = useState<any>(props.shops ?? []);
  const [shopsLoading, setShopsLoading] = useState<boolean>(false);
  const [searchButtonClicked, setSearchButtonClicked] = useState<boolean>(false);
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  if (authData.access !== '') {
  } else if (Cookies.get('access') && Cookies.get('access') !== '') {
    setAuthData({
      access: Cookies.get('access') as string,
      refresh: Cookies.get('refresh') as string,
      user_type: Cookies.get('user_type') as accountTypes,
    });
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setImgFiles((prev) => {
      return [...prev, ...Array.from(e.target.files ?? [])];
    });
  };

  let valid = false;

  if (
    (make === 'Other' ? customMake.length > 0 : make.length > 0) &&
    (make === 'Other' ? customModel.length > 0 : make.length > 0) &&
    modelYear.length > 0 &&
    // firstName.length > 0 &&
    // lastName.length > 0 &&
    // phoneNumber.length > 0 &&
    notes.length > 0 &&
    VIN.length > 0
    // email.length > 0 &&
    // emailErrors === undefined
  ) {
    valid = true;
  }

  useEffect(() => {
    if (
      (make === 'Other' ? customMake.length > 0 : make.length > 0) &&
      (make === 'Other' ? customModel.length > 0 : make.length > 0) &&
      modelYear.length > 0 &&
      // firstName.length > 0 &&
      // lastName.length > 0 &&
      // phoneNumber.length > 0 &&
      notes.length > 0 &&
      VIN.length > 0
      // email.length > 0 &&
      // emailErrors === undefined
    ) {
      valid = true;
    }
    ``;
  }, [make, model, customMake, customModel]);

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

  const shopList = shopsList.map((shop: any) => {
    return (
      <div
        key={shop.id}
        onClick={() => {
          if (shops.includes(shop?.id)) {
            setShops(shops.filter((s: any) => s !== shop.id));
          } else {
            setShops([...shops, shop.id]);
          }
        }}
      >
        <div
          className={`card hover-scale-up ${
            shops.includes(shop?.id) ? 'selected-card' : 'unselected-card'
          }`}
        >
          <div className="flex flex-col row-gap-small">
            <span>
              <b>{shop.name}</b>
            </span>
            {shop.distance_from_user && <span>{shop.distance_from_user}</span>}
          </div>
        </div>
      </div>
    );
  });

  const skeletonShopList = Array(SKELETON_LIST_LENGTH)
    .fill(0)
    .map((shop: any, index: number) => {
      return (
        <Skeleton
          baseColor="#f3f6fe"
          highlightColor="#dbdde5"
          height={'60px'}
          borderRadius={'12px'}
          className="card"
          key={'skeleton_' + index}
        />
      );
    });

  const shopSchema = yup.object().shape({
    postal_code: yup.string().required('Postal code is required'),
  });
  const shopForm = useFormik({
    initialValues: {
      postal_code: '',
    },
    validationSchema: shopSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      setShopsLoading(true);
      setSearchButtonClicked(true);
      try {
        const shops = await axios.get(
          `${apiUrl}/shops/shops/distance/?postal_code=${values.postal_code}`
        );
        setShopsList(shops.data);
        setShopsLoading(false);
      } catch (error) {
        setShopsList([]);
        setShopsLoading(false);
        console.log(error);
      }
    },
  });

  return (
    <div className={styles.container}>
      <Header title="Create Quote Request" />

      <div className={styles.content}>
        {errors?.length > 0 && (
          <div className="flex flex-col row-gap-small">
            {errors.map((error: any, index) => {
              return (
                <span className="error" key={`error_${index}`}>
                  {error.detail}
                </span>
              );
            })}
          </div>
        )}
        <Modal
          visible={shopSelectionModal}
          onClose={() => setShopSelectionModal(false)}
          title="Select a shop"
        >
          <div className="modal-content">
            <div className="wrapper">
              <FormikProvider value={shopForm}>
                <form onSubmit={shopForm.handleSubmit}>
                  <FieldLabel label="Search by Postal Code:" />
                  <div
                    className="flex flex-row align-items-center"
                    style={{ gap: '10px', marginTop: '10px' }}
                  >
                    {/* <CardTextField
                      fieldValue={`${shopForm.values.postal_code}`}
                      fieldName="postal_code"
                      fieldLabel="Postal Code:"
                      fieldType="string"
                      fieldDisabled={false}
                      onChange={shopForm.handleChange}
                      error={shopForm.errors.postal_code}
                    /> */}
                    <input
                      id={'postal_code'}
                      className="input card-field"
                      style={{ height: '20px' }}
                      name={'postal_code'}
                      value={`${shopForm.values.postal_code}`}
                      type="string"
                      onChange={shopForm.handleChange}
                      disabled={props.fieldDisabled}
                    />
                    <button className="small-button hover-scale-up active-scale-down" type="submit">
                      Search
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <span className="error">{shopForm.errors.postal_code}</span>
                  </div>
                </form>
              </FormikProvider>
              <div className="grid-list" id="shop-list" style={{ marginTop: '10px' }}>
                {shopForm.values.postal_code && searchButtonClicked ? (
                  shopsLoading ? (
                    skeletonShopList
                  ) : shopList.length > 0 ? (
                    shopList
                  ) : (
                    <p>No shops found.</p>
                  )
                ) : undefined}
              </div>
            </div>
          </div>
        </Modal>
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
          <span className={styles['section-header']}>Shops</span>
          <div className={styles['field-container']}>
            <Button onClick={() => setShopSelectionModal(true)} title="Select Shop"></Button>
            <div style={{ marginTop: '10px' }}>
              <b>Selected Shops: </b>
              {shops.length > 0
                ? shopsList
                    .filter((shop: any) => {
                      return shops.includes(shop.id);
                    })
                    .map((shop: any) => shop.name)
                    .join(', ')
                : 'None.'}
            </div>
          </div>
        </div>
        {/* <div className={styles.section}>
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
        </div> */}
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
            <TextArea
              name="Notes"
              placeholder="Enter any additional notes"
              onChange={setNotes}
              required
            />
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
          onClick={async () => {
            try {
              const data = {
                shops: shops.map((shop: any) => shop.id.toString()),
                description: notes,
                vehicle_vin: VIN,
                vehicle_make: make === 'Other' ? customMake : make,
                vehicle_model: model,
                vehicle_year: modelYear,
                preferred_part_condition:
                  partCondition === 'New Parts Only'
                    ? 'new'
                    : partCondition === 'Used Parts Only'
                    ? 'used'
                    : '',
                preferred_part_type:
                  partType === 'OEM Parts Only'
                    ? 'oem'
                    : partType === 'Aftermarket Parts Only'
                    ? 'aftermarket'
                    : '',
              };

              const formData = new FormData();

              for (const [key, value] of Object.entries(data)) {
                formData.append(key, JSON.stringify(value));
              }

              for (let i = 0; i < imgFiles.length; i++) {
                formData.append('uploaded_images', imgFiles[i], imgFiles[i].name);
              }

              const res = await axios.post(
                `${apiUrl}/quotes/quote-requests/bulk_create/`,
                formData,
                {
                  headers: {
                    Authorization: `JWT ${authData.access}`,
                  },
                  maxBodyLength: Infinity,
                }
              );
              if (res.status === 201) {
                router.push('/quote-request-list');
              }
            } catch (error: any) {
              setErrors(error.response);
              scrollTo(0, 0);
            }
          }}
        />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  try {
    const shops = await axios.get(`${apiUrl}/shops/shops/`);
    return {
      props: {
        shops: shops.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default QuoteRequestPage;
