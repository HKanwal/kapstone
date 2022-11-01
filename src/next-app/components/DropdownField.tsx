import { useState } from "react";
import styles from "../styles/components/DropdownField.module.css";
import TextInput from "./TextInput";
import { BsChevronDown } from "react-icons/bs";

type DropdownFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  required?: boolean;
  items: string[];
};

const DropdownField = (props: DropdownFieldProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(props.items);

  return (
    <div className={styles.container}>
      <span className={styles.name}>
        {props.name}
        {props.required ? <span className={styles.asterisk}>*</span> : <></>}
      </span>
      <div className={styles['input-container']}>
        <TextInput placeholder={props.placeholder ?? ''} width={props.width} />
        <div className={styles['chevron-container']}>
          <BsChevronDown />
        </div>
      </div>
    </div>
  );
};

export default DropdownField;
