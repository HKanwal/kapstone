import { DateRangePickerValue, RangeCalendar } from '@mantine/dates';
import { useDisclosure, useClickOutside } from '@mantine/hooks';
import TextInput from './TextInput';
import styles from '../styles/components/DateRangePicker.module.css';

type DateRangePickerProps = {
  value: DateRangePickerValue;
  onChange: (newDates: DateRangePickerValue) => void;
};

const months = [
  'Janurary',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatDate(date: Date) {
  return months[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
}

const DateRangePicker = (props: DateRangePickerProps) => {
  const [opened, handlers] = useDisclosure(false);
  const containerRef = useClickOutside<HTMLDivElement>(() => handlers.close());
  const start = props.value[0];
  const end = props.value[1];

  const handleClick = () => {
    handlers.toggle();
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <TextInput
        onClick={handleClick}
        placeholder="Pick date range..."
        value={start && end ? formatDate(start) + ' - ' + formatDate(end) : ''}
        onChange={() => {}}
        disabled
      />
      {opened ? (
        <div className={styles['calendar-container']}>
          <RangeCalendar value={props.value} onChange={props.onChange} fullWidth />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DateRangePicker;
