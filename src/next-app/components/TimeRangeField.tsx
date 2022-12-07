import { TimeRangeInput } from '@mantine/dates';
import styles from '../styles/components/TimeRangeField.module.css';
import FieldLabel from './FieldLabel';

type TimeRangeFieldProps = {
  name: string;
  placeholder?: string;
  width?: string | number;
  required?: boolean;
  value: [Date | null, Date | null];
  onChange: (newDates: [Date | null, Date | null]) => void;
};

const TimeRangeField = (props: TimeRangeFieldProps) => {
  return (
    <div className={styles.container}>
      {props.name.length > 0 ? <FieldLabel label={props.name} required={props.required} /> : <></>}
      <div className={styles['time-range-container']}>
        <TimeRangeInput value={props.value} onChange={props.onChange} />
      </div>
    </div>
  );
};

export default TimeRangeField;
