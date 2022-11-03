import type { NextPage } from "next";
import { useState } from "react";
import Button from "../components/Button";
import TextField from "../components/TextField";
import TextMultiField from "../components/TextMultiField";
import Header from "../components/Header";
import styles from "../styles/pages/CreateShop.module.css";
import DropdownField from "../components/DropdownField";

const CreateShopPage: NextPage = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);
  const [email, setEmail] = useState("");
  const [employees, setEmployees] = useState("");
  const [serviceBays, setServiceBays] = useState("");

  const handleSubmit = () => {
    window.location.href = "/create-account";
  };

  return (
    <div className={styles.container}>
      <Header goBackToHref="/login" title="Create New Shop" />

      <div className={styles.content}>
        <div className={styles["field-container"]}>
          <TextField
            name="Shop Name"
            placeholder="Enter your shop's name"
            onChange={setName}
            required
          />
        </div>
        <div className={styles["field-container"]}>
          <TextField
            name="Shop Address"
            placeholder="Enter your shop's address"
            onChange={setAddress}
            required
          />
        </div>
        <div className={styles["field-container"]}>
          <TextMultiField
            name="Shop Phone Number(s)"
            placeholder="Enter your shop's phone number"
            onChange={setPhoneNumbers}
            multi="Add phone number"
          />
        </div>
        <div className={styles["field-container"]}>
          <TextField
            name="Shop Email"
            placeholder="Enter your shop's email"
            onChange={setEmail}
          />
        </div>
        <div className={styles["field-container"]}>
          <DropdownField
            name="Services Offered"
            placeholder="Enter services..."
            items={new Set(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])}
          />
        </div>
        <div className={styles["field-container"]}>
          <TextField
            name="Number of Employees"
            placeholder="Enter number of employees"
            inputType="number"
            onChange={setEmployees}
          />
        </div>
        <div className={styles["field-container"]}>
          <TextField
            name="Number of Service Bays"
            placeholder="Enter number of service bays"
            inputType="number"
            onChange={setServiceBays}
          />
        </div>
        <div className={styles["submit-container"]}>
          <Button
            title="Create"
            disabled={name.length < 1 || address.length < 1}
            width="80%"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateShopPage;
