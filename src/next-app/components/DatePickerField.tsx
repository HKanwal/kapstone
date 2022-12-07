import styles from '../styles/components/DatePickerField.module.css';
import DatePicker from './DatePicker';
import FieldLabel from './FieldLabel';

type DatePickerFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  required?: boolean;
  value: Date[];
  onChange: (newDates: Date[]) => void;
};

const DatePickerField = (props: DatePickerFieldProps) => {
  return (
    <div className={styles.container}>
      {props.name.length > 0 ? <FieldLabel label={props.name} required={props.required} /> : <></>}
      <div className={styles['date-picker-container']}>
        <DatePicker value={props.value} onChange={props.onChange} />
      </div>
    </div>
  );
};

export default DatePickerField;
