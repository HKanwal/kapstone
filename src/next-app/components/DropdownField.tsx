import { useMemo, useRef, useState } from 'react';
import styles from '../styles/components/DropdownField.module.css';
import TextInput, { TextInputRef } from './TextInput';
import { BsChevronDown } from 'react-icons/bs';
import Chip from './Chip';

type Type = 'single-select' | 'multi-select';
type DropdownFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  required?: boolean;
  items: string[];
  onSelect?: (item: string, selectedItems: string[]) => void;
  type?: Type;
};

let collapseTimout: NodeJS.Timeout;

const DropdownField = (props: DropdownFieldProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState('');
  const items = useMemo(() => Array.from(new Set(props.items)), [props.items]);
  const inputRef = useRef<TextInputRef>(null);
  const type: Type = props.type === 'multi-select' ? 'multi-select' : 'single-select';

  const handleSelect = (item: string) => {
    props.onSelect && props.onSelect(item, selectedItems);
  };

  const handleBlur = () => {
    collapseTimout = setTimeout(() => {
      setExpanded(false);
    }, 10);
  };

  const handleFocus = () => {
    clearTimeout(collapseTimout);
    setValue('');
    setExpanded(true);
    inputRef.current?.focus();
  };

  const handleItemClick = (item: string) => {
    setSelectedItems((prevSelectedItems) => {
      if (type === 'single-select') {
        setValue(item);
        inputRef.current?.blur();
        return [item];
      } else {
        return [...prevSelectedItems, item];
      }
    });
    handleSelect(item);
  };

  const handleChipMouseDown = () => {
    setTimeout(() => {
      clearTimeout(collapseTimout);
      inputRef.current?.focus();
    }, 10);
  };

  const handleRemove = (item: string) => {
    setSelectedItems((prevSelectedItems) => {
      return prevSelectedItems.filter((si) => {
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
      {type === 'multi-select' ? (
        <div className={styles['chips-container']}>
          {selectedItems.map((item) => {
            return (
              <div className={styles['chip-container']} key={item}>
                <Chip
                  text={item}
                  onRemove={() => handleRemove(item)}
                  onMouseDown={handleChipMouseDown}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
      <div className={styles['input-container']}>
        <TextInput
          placeholder={props.placeholder ?? ''}
          width={props.width}
          style={{ paddingRight: '14%' }}
          value={value}
          onChange={setValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={inputRef}
        />
        <div className={styles['chevron-container']}>
          <BsChevronDown />
        </div>
        {expanded ? (
          <div className={styles['dropdown']}>
            {items
              .filter((item) => {
                return !selectedItems.includes(item);
              })
              .filter((item) => {
                return value.length === 0 || item.startsWith(value);
              })
              .map((item) => (
                <button
                  className={styles.item}
                  key={item}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onClick={() => handleItemClick(item)}>
                  {item}
                </button>
              ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default DropdownField;
