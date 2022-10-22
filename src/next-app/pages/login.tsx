import type { NextPage } from "next";
import { useState } from "react";
import BackButton from "../components/BackButton";
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

  const goBack = () => {
    window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BackButton onClick={goBack} />
      </div>
      <div className={styles.content}>
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
          <div className={styles["modal-content"]}>
            <div className={styles["modal-title-container"]}>
              <span className={styles["modal-title"]}>Reset Password</span>
            </div>
            <FormField name="Email" placeholder="Enter your email" />
            <div className={styles["modal-submit"]}>
              <Button title="Continue" width="100%" />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;