import type { NextPage } from "next";
import { useState } from "react";
import Button from "../components/Button";
import TextField from "../components/TextField";
import Header from "../components/Header";
import Link from "../components/Link";
import Modal from "../components/Modal";
import styles from "../styles/pages/LoginPage.module.css";

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

  const goToCreateShop = () => {
    window.location.href = '/create-shop';
  }

  return (
    <div className={styles.container}>
      <Header goBackToHref="/" />

      <div className={styles.content}>
        <div className={styles["username-container"]}>
          <TextField
            name="Username"
            placeholder="Enter your username"
            onChange={setUsername}
          />
        </div>
        <div className={styles["password-container"]}>
          <TextField
            name="Password"
            placeholder="Enter your password"
            inputType="password"
            onChange={setPassword}
          />
        </div>
        <div className={styles["forgot-password-container"]}>
          <Link text="Forgot Password?" onClick={showModal} />
        </div>
        <Button
          title="Login"
          width="80%"
          disabled={username.length < 1 || password.length < 1}
        />
        <span className={styles.or}>OR</span>
        <Button title="Register" width="80%" onClick={goToCreateShop} />

        <Modal visible={modalVisible} onClose={hideModal}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-title-container"]}>
              <span className={styles["modal-title"]}>Reset Password</span>
            </div>
            <TextField name="Email" placeholder="Enter your email" />
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
