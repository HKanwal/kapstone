import { useState } from 'react';
import styles from '../styles/components/EmailsField.module.css';
import Chip from './Chip';
import TextInput from './TextInput';

type EmailsFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  onChange?: (newVals: string) => void;
  inputType?: string;

  /** When any of the inputs lost focus */
  onBlur?: () => void;

  /** Makes the first input highlighted red */
  error?: boolean;

  /** Adds a red asterisk */
  required?: boolean;
};

const EmailsField = (props: EmailsFieldProps) => {
  const [val, setVal] = useState<string>('');
  const [chips, setChips] = useState<string[]>([]);

  const handleChange = (newVal: string) => {
    const l = newVal.length;
    if (l > 2 && newVal[l - 1] === ' ' && newVal[l - 2] !== ' ') {
      setChips((prevChips) => {
        return [...prevChips, newVal.trim()];
      });
      setVal('');
      props.onChange && props.onChange('');
    } else {
      setVal(newVal);
      props.onChange && props.onChange(newVal);
    }
  };

  const handleBlur = () => {
    props.onBlur && props.onBlur();
  };

  const handleRemove = (item: string) => {
    setChips((prevChips) => {
      return prevChips.filter((si) => {
        return si !== item;
      });
    });
  };

  return (
    <div className={styles.container}>
      <span className={styles.name}>
        {props.name}
        {props.required ? <span className={styles.asterisk}>*</span> : <></>}
      </span>
      <div className={styles['chips-container']}>
        {chips.map((item) => {
          return (
            <div className={styles['chip-container']} key={item}>
              <Chip text={item} onRemove={() => handleRemove(item)} />
            </div>
          );
        })}
      </div>
      <div className={styles['text-input-container']}>
        <TextInput
          placeholder={props.placeholder}
          width={props.width}
          value={val}
          onChange={(newVal) => handleChange(newVal)}
          type={props.inputType}
          error={props.error}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

export type { EmailsFieldProps };
export default EmailsField;
