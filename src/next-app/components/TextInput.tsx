import { ChangeEvent, useEffect, useState } from "react";
import styles from "../styles/components/TextInput.module.css";
import { ImCancelCircle } from 'react-icons/im';

type TextInputProps = {
  placeholder?: string;
  width?: string | number;
  value?: string;
  onChange?: (newValue: string) => void;
  type?: string;
  removable?: boolean;

  /** Only called if removable = true */
  onRemove?: () => void;
};

const calcSize = (winHeight: number, winWidth: number) => {
  return Math.floor(Math.min(winHeight, winWidth) / 20);
};

const TextInput = (props: TextInputProps) => {
  const [value, setValue] = useState(props.value ?? '');
  const [cancelSize, setCancelSize] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setCancelSize(calcSize(window.innerHeight, window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setValue(props.value ?? '');
  }, [props.value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    props.onChange && props.onChange(newValue);
    setValue(newValue);
  };

  const handleCancel = () => {
    props.onRemove && props.onRemove();
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type={props.type ?? "text"}
        placeholder={props.placeholder ?? ""}
        value={value}
        onChange={handleChange}
        style={{ width: props.width ?? "100%" }}
      />
      {
        (props.removable) ?
          <div className={styles['cancel-button']} onClick={handleCancel}>
            <ImCancelCircle size={cancelSize} />
          </div>
          : <></>
      }
    </div>
  );
};

export default TextInput;
