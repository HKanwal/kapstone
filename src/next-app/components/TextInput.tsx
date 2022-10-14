import { ChangeEvent, useState } from "react";
import styles from "../styles/TextInput.module.css";

type TextInputProps = {
  placeholder?: string;
  width?: string | number;
  onChange?: (newValue: string) => void;
};

const TextInput = (props: TextInputProps) => {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    props.onChange && props.onChange(newValue);
    setValue(newValue);
  };

  return (
    <input
      className={styles.input}
      type="text"
      placeholder={props.placeholder ?? ""}
      value={value}
      onChange={handleChange}
      style={{ width: props.width }}
    />
  );
};

export default TextInput;
