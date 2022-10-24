import { useState } from "react";
import styles from "../styles/FormField.module.css";
import Link from "./Link";
import TextInput from "./TextInput";

type FormFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  onChange?: (newValue: string) => void;
  inputType?: string;

  /** Adds a red asterisk */
  required?: boolean;

  /** Allows user to create additional inputs */
  multi?: string;
};

const FormField = (props: FormFieldProps) => {
  const [value, setValue] = useState("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
    props.onChange && props.onChange(newValue);
  };

  const addTextInput = () => {
    console.log('TODO: this should add a text input');
  };

  return (
    <div className={styles.container}>
      <span className={styles.name}>
        {props.name}
        {props.required ? <span className={styles.asterisk}>*</span> : <></>}
      </span>
      <TextInput
        placeholder={props.placeholder}
        width={props.width}
        onChange={handleChange}
        type={props.inputType}
      />
      {
        (!!props.multi) ? <Link text={`+ ${props.multi}`} onClick={addTextInput} /> : <></>
      }
    </div>
  );
};

export default FormField;
