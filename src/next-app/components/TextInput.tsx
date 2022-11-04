import {
  ChangeEvent,
  CSSProperties,
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../styles/components/TextInput.module.css';
import { ImCancelCircle } from 'react-icons/im';

type TextInputProps = {
  placeholder?: string;
  width?: string | number;
  value?: string;
  onChange?: (newVal: string) => void;
  type?: string;
  onRemove?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: {
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    paddingBottom?: string;
  };
  error?: boolean;
};

type TextInputRef = {
  focus: () => void;
};

const calcSize = (winHeight: number, winWidth: number) => {
  return Math.floor(Math.min(winHeight, winWidth) / 20);
};

const TextInput = forwardRef((props: TextInputProps, ref: Ref<TextInputRef>) => {
  const [value, setValue] = useState(props.value ?? '');
  const [cancelSize, setCancelSize] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const style: CSSProperties = useMemo(() => {
    return {
      width: props.width ?? '100%',
      ...props.style,
      paddingRight: props.onRemove ? '3em' : props.style?.paddingRight ?? '1em',
    };
  }, [props.width, props.style, props.onRemove]);

  useImperativeHandle(ref, () => {
    return {
      focus: () => {
        inputRef.current?.focus();
      },
    };
  });

  useEffect(() => {
    const handleResize = () => {
      setCancelSize(calcSize(window.innerHeight, window.innerWidth));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
        className={`${styles.input} ${props.error ? styles.error : ''}`}
        type={props.type ?? 'text'}
        placeholder={props.placeholder ?? ''}
        value={value}
        onChange={handleChange}
        style={style}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        ref={inputRef}
      />
      {props.onRemove ? (
        <div className={styles['cancel-button']} onClick={handleCancel}>
          <ImCancelCircle size={cancelSize} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export type { TextInputRef };
export default TextInput;
