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
import { BsChevronDown } from 'react-icons/bs';
import DropdownField from './DropdownField';

type TextInputProps = {
  placeholder?: string;
  width?: string | number;
  value?: string;
  onChange?: (newVal: string) => void;
  type?: string;

  /**
   * If this prop is provided, a cancel button will be rendered within the input
   * on the right side. When user clicks it, the given callback will be called.
   */
  onRemove?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  style?: {
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    paddingBottom?: string;
  };
  error?: boolean;
  disabled?: boolean;

  /**
   * Renders a dropdown on right side of input. If this prop is provided,
   * onRemove will be ignored and no cancel button will be rendered.
   */
  rightItems?: string[];
  onRightItemChange?: (newItem: string) => void;
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
      paddingRight: props.rightItems
        ? 'calc(1em + 35%)'
        : props.onRemove
        ? '3em'
        : props.style?.paddingRight ?? '1em',
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
    <div className={styles.container} onClick={props.onClick}>
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
        disabled={props.disabled}
      />
      {props.onRemove && !props.rightItems ? (
        <div className={styles['cancel-button']} onClick={handleCancel}>
          <ImCancelCircle size={cancelSize} />
        </div>
      ) : (
        <></>
      )}
      {props.rightItems ? (
        <div className={styles['right-input-container']}>
          <DropdownField
            name=""
            items={props.rightItems}
            selectedItems={[props.rightItems[0]]}
            onSelect={props.onRightItemChange}
            textCentered
            disabled
          />
          <div className={styles.divider}></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export type { TextInputRef, TextInputProps };
export default TextInput;
