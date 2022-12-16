import { useState } from 'react';
import styles from '../styles/components/SingleTextField.module.css';
import TextInput from './TextInput';

type TextFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  onChange?: (newVal: string) => void;
  errors?: Set<string>;
  inputType?: string;
  onBlur?: () => void;

  /** Adds a red asterisk */
  required?: boolean;

  /**
   * Renders a dropdown on right side of input. If this prop is provided,
   * onRemove will be ignored and no cancel button will be rendered.
   */
  rightItems?: string[];
  onRightItemChange?: (newItem: string) => void;
};

const SingleTextField = (props: TextFieldProps) => {
  const [val, setVal] = useState('');

  const handleChange = (newVal: string) => {
    setVal(newVal);
    props.onChange && props.onChange(newVal);
  };

  return (
    <div className={styles.container}>
      <span className={styles.name}>
        {props.name}
        {props.required ? <span className={styles.asterisk}>*</span> : <></>}
      </span>
      <div className={styles['text-input-container']}>
        <TextInput
          placeholder={props.placeholder}
          width={props.width}
          value={val}
          onChange={(newVal) => handleChange(newVal)}
          type={props.inputType}
          error={!!props.errors?.size}
          onBlur={props.onBlur}
          rightItems={props.rightItems}
          onRightItemChange={props.onRightItemChange}
        />
      </div>
      {props.errors ? (
        <div className={styles['errors-container']}>
          {Array.from(props.errors).map((error) => {
            return (
              <span className={styles.error} key={error}>
                {error}
              </span>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SingleTextField;
