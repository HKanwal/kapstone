import type { NextPage } from "next";
import { useState } from "react";
import Button from "../components/Button";
import FormField from "../components/FormField";
import Header from "../components/Header";
import Modal from "../components/Modal";
import styles from "../styles/LoginPage.module.css";

const LoginPage: NextPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisisble] = useState<boolean>(false);

  const showModal = () => {
    setModalVisisble(true);
  };

  const hideModal = () => {
    setModalVisisble(false);
  };

  return (
    <div className={styles.container}>
      <Header goBackToHref="/" />

      <div className={styles.content}>
        <div className={styles["username-container"]}>
          <FormField
            name="Username"
            placeholder="Enter your username"
            onChange={setUsername}
          />
        </div>
        <div className={styles["password-container"]}>
          <FormField
            name="Password"
            placeholder="Enter your password"
            inputType="password"
            onChange={setPassword}
          />
        </div>
        <div className={styles["forgot-password-container"]}>
          <span className={styles["forgot-password"]} onClick={showModal}>
            Forgot Password?
          </span>
        </div>
        <Button
          title="Login"
          width="80%"
          disabled={username.length < 1 || password.length < 1}
        />

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
