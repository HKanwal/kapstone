import type { NextPage } from "next";
import Button from "../components/Button";
import FormField from "../components/FormField";
import styles from "../styles/LoginPage.module.css";

const LoginPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles["username-container"]}>
        <FormField name="Username" placeholder="Enter your username" />
      </div>
      <div className={styles["password-container"]}>
        <FormField name="Password" placeholder="Enter your password" />
      </div>
      <span className={styles["forgot-password"]}>Forgot Password?</span>
      <Button title="Login" width="80%" />
    </div>
  );
};

export default LoginPage;
