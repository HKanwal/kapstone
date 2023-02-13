import { useRef, useState, ChangeEvent } from 'react';
import styles from '../styles/components/TextArea.module.css';
import { TextInputRef } from './TextInput';

type DropdownFieldProps = {
  name: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (newVal: string) => void;
};

const TextArea = (props: DropdownFieldProps) => {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<TextInputRef>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    props.onChange && props.onChange(newVal);
    setValue(newVal);
  };

  return (
    <div className={styles.container}>
      <span className={styles.name}>
        {props.name}
        {props.required ? <span className={styles.asterisk}>*</span> : <></>}
      </span>
      <div className={styles['input-container']}>
        <textarea className={styles['input']} placeholder={props.placeholder} value={value} onChange={handleChange}>
        </textarea>
      </div>
    </div >
  );
};

export default TextArea;
