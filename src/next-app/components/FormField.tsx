import { useState } from "react";
import styles from "../styles/FormField.module.css";
import TextInput from "./TextInput";

type FormFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  onChange?: (newValue: string) => void;
  inputType?: string;
};

const FormField = (props: FormFieldProps) => {
  const [value, setValue] = useState("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
    props.onChange && props.onChange(newValue);
  };

  return (
    <div className={styles.container}>
      <span className={styles.name}>{props.name}</span>
      <TextInput
        placeholder={props.placeholder}
        width={props.width}
        onChange={handleChange}
        type={props.inputType}
      />
    </div>
  );
};

export default FormField;
