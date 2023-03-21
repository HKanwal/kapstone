import { useRef, useState, ChangeEvent } from 'react';
import styles from '../styles/components/TextArea.module.css';
import { TextInputRef } from './TextInput';

type TextAreaProps = {
  name: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (newVal: string) => void;
  disabled?: boolean;
};

const TextArea = (props: TextAreaProps) => {
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
        <textarea
          className={styles['input']}
          id={props.name}
          placeholder={props.placeholder}
          value={value}
          onChange={handleChange}
          disabled={props.disabled}
        ></textarea>
      </div>
    </div>
  );
};

export default TextArea;
