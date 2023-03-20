import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../styles/components/Dropdown.module.css';

type DropdownProps = {
  name?: string;
  placeholder?: string;
  width?: string | number;
  items: string[];
  selectedItem?: string;
  onSelect?: (item: string) => void;
};

const Dropdown = (props: DropdownProps) => {
  const handleSelect = (item: string) => {
    props.onSelect && props.onSelect(item);
  };

  return (
    <div className={styles.container}>
      {props.name ? <div className={styles['label-container']}>{props.name}:</div> : <></>}
      <div className={styles['dropdown-container']}>
        <select
          className={styles['custom-select']}
          id={props.name ? props.name : ''}
          onChange={(item) => handleSelect(item.target.value)}
        >
          {props.items.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Dropdown;
