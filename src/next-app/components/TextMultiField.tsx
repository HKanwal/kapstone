import { useState } from 'react';
import styles from '../styles/components/TextMultiField.module.css';
import FieldLabel from './FieldLabel';
import Link from './Link';
import TextInput from './TextInput';

type TextMultiFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  onChange?: (newVals: string[]) => void;
  inputType?: string;
  min?: string;

  /** When any of the inputs lost focus */
  onBlur?: () => void;

  /** Makes the first input highlighted red */
  error?: boolean;

  /** Adds a red asterisk */
  required?: boolean;

  /** Allows user to create additional inputs */
  multi?: string;
};

const TextMultiField = (props: TextMultiFieldProps) => {
  const [vals, setVals] = useState<string[]>(['']);

  const handleChange = (i: number, newVal: string) => {
    const newVals = [...vals.slice(0, i), newVal, ...vals.slice(i + 1)];
    setVals(newVals);
    props.onChange && props.onChange(newVals);
  };

  const addTextInput = () => {
    setVals((oldVals) => {
      return [...oldVals, ''];
    });
  };

  const removeTextInput = (i: number) => {
    setVals((oldVals) => {
      return [...oldVals.slice(0, i), ...oldVals.slice(i + 1)];
    });
  };

  const handleBlur = () => {
    props.onBlur && props.onBlur();
  };

  return (
    <div className={styles.container}>
      <>
        {props.name.length > 0 ? (
          <FieldLabel label={props.name} required={props.required} />
        ) : (
          <></>
        )}
        {vals.map((val, i) => {
          return (
            <div className={styles['text-input-container']} key={i}>
              <TextInput
                placeholder={props.placeholder}
                width={props.width}
                value={val}
                onChange={(newVal) => handleChange(i, newVal)}
                type={props.inputType}
                min={props.min}
                onRemove={i > 0 ? () => removeTextInput(i) : undefined}
                error={i === 0 && props.error}
                onBlur={handleBlur}
              />
            </div>
          );
        })}
        {!!props.multi ? (
          <div className={styles['link-container']}>
            <Link text={`+ ${props.multi}`} onClick={addTextInput} />
          </div>
        ) : (
          <></>
        )}
      </>
    </div>
  );
};

export type { TextMultiFieldProps };
export default TextMultiField;
