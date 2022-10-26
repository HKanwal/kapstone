import type { NextPage } from "next";
import { useState } from "react";
import Button from "../components/Button";
import FormField from "../components/FormField";
import Header from "../components/Header";
import styles from "../styles/pages/CreateShopPage.module.css";

const CreateShopPage: NextPage = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);
  const [email, setEmail] = useState("");
  const [employees, setEmployees] = useState("");
  const [serviceBays, setServiceBays] = useState("");

  return (
    <div className={styles.container}>
      <Header goBackToHref="/login" title="Create New Shop" />

      <div className={styles.content}>
        <div className={styles['field-container']}>
          <FormField
            name="Shop Name"
            placeholder="Enter your shop's name"
            onChange={(newVals) => setName(newVals[0])}
            required />
        </div>
        <div className={styles['field-container']}>
          <FormField
            name="Shop Address"
            placeholder="Enter your shop's address"
            onChange={(newVals) => setAddress(newVals[0])}
            required />
        </div>
        <div className={styles['field-container']}>
          <FormField
            name="Shop Phone Number(s)"
            placeholder="Enter your shop's phone number"
            onChange={setPhoneNumbers}
            multi="Add phone number" />
        </div>
        <div className={styles['field-container']}>
          <FormField
            name="Shop Email"
            placeholder="Enter your shop's email"
            onChange={(newVals) => setEmail(newVals[0])} />
        </div>
        <div className={styles['field-container']}>
          <FormField
            name="Number of Employees"
            placeholder="Enter number of employees"
            onChange={(newVals) => setEmployees(newVals[0])} />
        </div>
        <div className={styles['field-container']}>
          <FormField
            name="Number of Service Bays"
            placeholder="Enter number of service bays"
            onChange={(newVals) => setServiceBays(newVals[0])} />
        </div>
        <Button
          title="Create"
          disabled={name.length < 1 || address.length < 1}
          width="80%" />
      </div>
    </div>
  );
};

export default CreateShopPage;
