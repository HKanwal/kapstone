import { DateRangePickerValue } from '@mantine/dates';
import styles from '../styles/components/DateRangePickerField.module.css';
import DateRangePicker from './DateRangePicker';
import FieldLabel from './FieldLabel';

type DateRangePickerFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  required?: boolean;
  value: DateRangePickerValue;
  onChange: (newDates: DateRangePickerValue) => void;
};

const DateRangePickerField = (props: DateRangePickerFieldProps) => {
  return (
    <div className={styles.container}>
      {props.name.length > 0 ? <FieldLabel label={props.name} required={props.required} /> : <></>}
      <div className={styles['date-picker-container']}>
        <DateRangePicker name={props.name} value={props.value} onChange={props.onChange} />
      </div>
    </div>
  );
};

export default DateRangePickerField;
