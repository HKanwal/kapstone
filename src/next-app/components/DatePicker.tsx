import { Calendar } from '@mantine/dates';
import { useDisclosure, useClickOutside } from '@mantine/hooks';
import TextInput from './TextInput';
import styles from '../styles/components/DatePicker.module.css';

type DatePickerProps = {
  value: Date[];
  onChange: (newDates: Date[]) => void;
  single?: boolean;
};

const DatePicker = (props: DatePickerProps) => {
  const [opened, handlers] = useDisclosure(false);
  const containerRef = useClickOutside<HTMLDivElement>(() => handlers.close());

  const handleClick = () => {
    handlers.toggle();
  };

  const handleCalendarChange = (newValue: Date | Date[] | null) => {
    if (newValue !== null) {
      if (newValue instanceof Date) {
        props.onChange([newValue]);
      } else {
        props.onChange(newValue);
      }

      if (props.single) {
        handlers.close();
      }
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <TextInput
        onClick={handleClick}
        placeholder="Pick dates..."
        value={props.value
          .map((date) => {
            return (
              [
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
              ][date.getMonth()] +
              ' ' +
              date.getDate() +
              ', ' +
              date.getFullYear()
            );
          })
          .join('; ')}
        onChange={() => {}}
        disabled
      />
      {opened ? (
        <div className={styles['calendar-container']}>
          <Calendar
            value={props.value}
            onChange={handleCalendarChange}
            fullWidth
            multiple={!props.single}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DatePicker;
