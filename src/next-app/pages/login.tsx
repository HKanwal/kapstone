import type { NextPage } from "next";
import { useState } from "react";
import Button from "../components/Button";
import FormField from "../components/FormField";
import Modal from "../components/Modal";
import styles from "../styles/LoginPage.module.css";

const LoginPage: NextPage = () => {
  const [modalVisible, setModalVisisble] = useState<boolean>(false);

  const showModal = () => {
    setModalVisisble(true);
  };

  const hideModal = () => {
    setModalVisisble(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles["username-container"]}>
        <FormField name="Username" placeholder="Enter your username" />
      </div>
      <div className={styles["password-container"]}>
        <FormField name="Password" placeholder="Enter your password" />
      </div>
      <div className={styles["forgot-password-container"]}>
        <span className={styles["forgot-password"]} onClick={showModal}>
          Forgot Password?
        </span>
      </div>
      <Button title="Login" width="80%" />

      <Modal visible={modalVisible} onClose={hideModal}>
        <span className={styles["reset-password-title"]}>
          Reset Password
        </span>
        <FormField name="Email" placeholder="Enter your email" />
      </Modal>
    </div>
  );
};

export default LoginPage;
