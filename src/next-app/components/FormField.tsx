import { useState } from "react";
import styles from "../styles/FormField.module.css";
import TextInput from "./TextInput";

type FormFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  onChange?: (newValue: string) => void;
};

const FormField = (props: FormFieldProps) => {
  const [value, setValue] = useState("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={styles.container}>
      <span className={styles.name}>{props.name}:</span>
      <TextInput
        placeholder={props.placeholder}
        width={props.width}
        onChange={handleChange}
      />
    </div>
  );
};

export default FormField;
