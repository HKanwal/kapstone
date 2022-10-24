import { useState } from "react";
import styles from "../styles/FormField.module.css";
import Link from "./Link";
import TextInput from "./TextInput";

type FormFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  onChange?: (newValues: string[]) => void;
  inputType?: string;

  /** Adds a red asterisk */
  required?: boolean;

  /** Allows user to create additional inputs */
  multi?: string;
};

const FormField = (props: FormFieldProps) => {
  const [values, setValues] = useState<string[]>([""]);

  const handleChange = (i: number, newValue: string) => {
    const newValues = [...values.slice(0, i), newValue, ...values.slice(i + 1)];
    setValues(newValues);
    props.onChange && props.onChange(newValues);
  };

  const addTextInput = () => {
    // todo
  };

  return (
    <div className={styles.container}>
      <span className={styles.name}>
        {props.name}
        {props.required ? <span className={styles.asterisk}>*</span> : <></>}
      </span>
      {
        values.map((value, i) => {
          <TextInput
            placeholder={props.placeholder}
            width={props.width}
            onChange={handleChange} />
        })
      }
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
