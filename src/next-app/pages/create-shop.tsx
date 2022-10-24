import type { NextPage } from "next";
import FormField from "../components/FormField";
import Header from "../components/Header";
import styles from "../styles/CreateShopPage.module.css";

const CreateShopPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Header goBackToHref="/login" title="Create New Shop" />

      <div className={styles.content}>
        <div className={styles['shop-name-container']}>
          <FormField name="Shop Name" placeholder="Enter your shop's name" required />
        </div>
        <div className={styles['shop-address-container']}>
          <FormField name="Shop Address" placeholder="Enter your shop's address" required />
        </div>
        <div className={styles['shop-phones-container']}>
          <FormField name="Shop Phone Number(s)" placeholder="Enter your shop's phone number" multi="Add phone number" />
        </div>
        <div className={styles['shop-email-container']}>
          <FormField name="Shop Email" placeholder="Enter your shop's email" />
        </div>
      </div>
    </div>
  );
};

export default CreateShopPage;
