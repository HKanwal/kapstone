import type { NextPage } from "next";
import { useState } from "react";
import Button from "../components/Button";
import TextField from "../components/TextField";
import Header from "../components/Header";
import styles from "../styles/pages/CreateAccountPage.module.css";

const CreateAccountPage: NextPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const valid =
    firstName.length > 0 &&
    lastName.length > 0 &&
    phoneNumber.length > 0 &&
    email.length > 0 &&
    username.length > 0 &&
    password.length > 0;

  return (
    <div className={styles.container}>
      <Header goBackToHref="/create-shop" title="Create New Account" />

      <div className={styles.content}>
        <div className={styles["field-container"]}>
          <TextField
            name="First Name"
            placeholder="Enter your first name"
            onChange={setFirstName}
            required
          />
        </div>
        <div className={styles["field-container"]}>
          <TextField
            name="Last Name"
            placeholder="Enter your last name"
            onChange={setLastName}
            required
          />
        </div>
        <div className={styles["field-container"]}>
          <TextField
            name="Phone Number"
            placeholder="Enter your phone number"
            onChange={setPhoneNumber}
            required
          />
        </div>
        <div className={styles["field-container"]}>
          <TextField
            name="Email"
            placeholder="Enter your email"
            onChange={setEmail}
            required
          />
        </div>
        <div className={styles["field-container"]}>
          <TextField
            name="Username"
            placeholder="Enter your username"
            onChange={setUsername}
            required
          />
        </div>
        <div className={styles["field-container"]}>
          <TextField
            name="Password"
            inputType="password"
            placeholder="Enter your password"
            onChange={setPassword}
            required
          />
        </div>
        <Button title="Create" disabled={!valid} width="80%" />
      </div>
    </div>
  );
};

export default CreateAccountPage;
