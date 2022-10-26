import { ChangeEvent, useEffect, useState } from "react";
import styles from "../styles/components/TextInput.module.css";
import { ImCancelCircle } from 'react-icons/im';

type TextInputProps = {
  placeholder?: string;
  width?: string | number;
  value?: string;
  onChange?: (newVal: string) => void;
  type?: string;
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
    const newVal = e.target.value;
    props.onChange && props.onChange(newVal);
    setValue(newVal);
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
        (props.onRemove) ?
          <div className={styles['cancel-button']} onClick={handleCancel}>
            <ImCancelCircle size={cancelSize} />
          </div>
          : <></>
      }
    </div>
  );
};

export default TextInput;
