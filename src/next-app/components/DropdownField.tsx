import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../styles/components/DropdownField.module.css';
import TextInput, { TextInputRef } from './TextInput';
import { BsChevronDown } from 'react-icons/bs';
import Chip from './Chip';
import FieldLabel from './FieldLabel';
import { useClickOutside } from '@mantine/hooks';

type Type = 'single-select' | 'multi-select';
type DropdownFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  required?: boolean;
  items: string[];
  selectedItems?: string[];
  onSelect?: (item: string, selectedItems: string[]) => void;
  type?: Type;
  style?: CSSProperties;
  textCentered?: boolean;

  /**
   * If disabled, the behaviour will be as follows:
   * - User will not be able to focus the input
   * - User will not be able to type in the input or filter dropdown items
   */
  disabled?: boolean;
};

let collapseTimout: NodeJS.Timeout;

const DropdownField = (props: DropdownFieldProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(props.selectedItems ?? []);
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState('');
  const items = useMemo(() => Array.from(new Set(props.items)), [props.items]);
  const inputRef = useRef<TextInputRef>(null);
  const inputContainerRef = useClickOutside<HTMLDivElement>(() => setExpanded(false));
  const type: Type = props.type === 'multi-select' ? 'multi-select' : 'single-select';

  useEffect(() => {
    setSelectedItems(props.selectedItems ?? []);
    if (type === 'single-select') {
      setValue(props.selectedItems?.[0] ?? '');
    }
  }, [props.selectedItems]);

  const handleSelect = (item: string) => {
    props.onSelect && props.onSelect(item, selectedItems);
  };

  const handleInputBlur = () => {
    collapseTimout = setTimeout(() => {
      setExpanded(false);
      if (type === 'single-select' && selectedItems[0] !== undefined) {
        setValue(selectedItems[0]);
      } else {
        setValue('');
      }
    }, 10);
  };

  const handleInputFocus = () => {
    setValue('');
    setExpanded(true);
  };

  const handleBtnFocus = () => {
    clearTimeout(collapseTimout);
  };

  const handleItemClick = (item: string) => {
    setSelectedItems((prevSelectedItems) => {
      if (type === 'single-select') {
        setValue(item);
        setExpanded(false);
        return [item];
      } else {
        inputRef.current?.focus();
        return [...prevSelectedItems, item];
      }
    });
    handleSelect(item);
  };

  const handleChipMouseDown = () => {
    setTimeout(() => {
      clearTimeout(collapseTimout);
    }, 10);
  };

  const handleRemove = (item: string) => {
    inputRef.current?.focus();
    setSelectedItems((prevSelectedItems) => {
      return prevSelectedItems.filter((si) => {
        return si !== item;
      });
    });
  };

  const handleInputClick = () => {
    if (props.disabled) {
      if (!expanded) {
        if (type === 'multi-select') {
          setValue('');
        }
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    }
  };

  useEffect(() => {
    if (props.disabled && !expanded) {
      if (!expanded && value === '' && type === 'single-select') {
        setValue(selectedItems[0]);
      }
    }
  }, [expanded]);

  return (
    <div className={styles.container} style={props.style}>
      {props.name.length > 0 ? (
        <div className={styles['name-container']}>
          <FieldLabel label={props.name} required={props.required} />
        </div>
      ) : (
        <></>
      )}
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
      <div className={styles['input-container']} ref={inputContainerRef}>
        <TextInput
          placeholder={props.placeholder ?? ''}
          width={props.width}
          style={{ paddingRight: '14%' }}
          value={value}
          onChange={setValue}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onClick={handleInputClick}
          ref={inputRef}
          disabled={props.disabled}
        />
        <div className={styles['chevron-container']}>
          <BsChevronDown />
        </div>
        {expanded ? (
          <div className={styles['dropdown']}>
            {items
              .filter((item) => {
                return type === 'multi-select' ? !selectedItems.includes(item) : true;
              })
              .filter((item) => {
                if (props.disabled && type === 'single-select') {
                  return item !== value;
                }
                return value.length === 0 || item.startsWith(value);
              })
              .map((item) => (
                <button
                  className={styles.item}
                  key={item}
                  onFocus={handleBtnFocus}
                  onClick={() => handleItemClick(item)}
                  style={props.textCentered ? { textAlign: 'center', paddingLeft: 0 } : {}}
                >
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
