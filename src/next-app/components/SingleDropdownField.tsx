import { useMemo, useRef, useState } from 'react';
import styles from '../styles/components/DropdownField.module.css';
import TextInput, { TextInputRef } from './TextInput';
import { BsChevronDown, BsKeyFill } from 'react-icons/bs';

type DropdownFieldProps = {
    name: string;
    placeholder?: string;
    width?: string | number;
    required?: boolean;
    items: string[];
    onChange?: (newVal: string) => void;
};

let collapseTimout: NodeJS.Timeout;

const SingleDropdownField = (props: DropdownFieldProps) => {
    let selectedItemString = '';
    if (props.placeholder) {
        selectedItemString = props.placeholder;
    }
    const [selectedItem, setSelectedItem] = useState<string>(selectedItemString);
    const [expanded, setExpanded] = useState(false);
    const [value, setValue] = useState('');
    const items = useMemo(() => Array.from(props.items), [props.items]);
    const inputRef = useRef<TextInputRef>(null);

    const handleChange = (newVals: string) => {
        props.onChange && props.onChange(newVals);
    };

    const handleBlur = () => {
        collapseTimout = setTimeout(() => {
            setExpanded(false);
        }, 10);
    };

    const handleFocus = () => {
        setValue('');
        handleChange('');
        setSelectedItem('');
        clearTimeout(collapseTimout);
        setExpanded(true);
        inputRef.current?.focus();
    };

    const handleItemClick = (item: string) => {
        if (document.activeElement) {
            (document.activeElement as HTMLElement).blur();
        }
        setSelectedItem(item);
        setValue(item);
        handleChange(item);
    };

    return (
        <div className={styles.container}>
            <span className={styles.name}>
                {props.name}
                {props.required ? <span className={styles.asterisk}>*</span> : <></>}
            </span>
            <div className={styles['chips-container']}>
            </div>
            <div className={styles['input-container']}>
                <TextInput
                    placeholder={selectedItem ?? ''}
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
                                return !selectedItem.includes(item);
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

export default SingleDropdownField;
