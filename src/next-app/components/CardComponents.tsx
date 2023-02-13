import { ChangeEventHandler } from 'react';
import { Field } from 'formik';
import FieldLabel from './FieldLabel';
import { MultiSelect } from '@mantine/core';
import { NativeSelect } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import moment from 'moment';

type CardTextFieldProps = {
  fieldValue: string | ReadonlyArray<string> | number | undefined;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  fieldRequired?: boolean | undefined;
  fieldDisabled?: boolean | undefined;
  error?: any;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
};

type CardMultiSelectProps = {
  fieldLabel: string;
  fieldData: any[];
  fieldValues: string[] | undefined;
  fieldPlaceholder?: string | undefined;
  fieldRequired?: boolean | undefined;
  fieldDisabled?: boolean | undefined;
  fieldSearchable?: boolean | undefined;
  error?: any;
  onChange: ((value: string[]) => void) | undefined;
  className?: string | undefined;
};

type CardTextAreaProps = {
  fieldValue: string | ReadonlyArray<string> | number | undefined;
  fieldName: string;
  fieldLabel: string;
  fieldRows?: number | undefined;
  fieldRequired?: boolean | undefined;
  fieldDisabled?: boolean | undefined;
  error?: any;
  onChange: ChangeEventHandler<HTMLTextAreaElement> | undefined;
};

type CardSelectProps = {
  fieldName: string;
  fieldLabel: string;
  fieldRequired?: boolean | undefined;
  fieldDisabled?: boolean | undefined;
  options: any;
  error?: any;
};

export const CardTextField = (props: CardTextFieldProps) => {
  return (
    <div className={`card-field flex flex-col row-gap-small`}>
      <FieldLabel label={props.fieldLabel} required={props.fieldRequired} />
      <input
        className="input"
        name={props.fieldName}
        value={props.fieldValue}
        type={props.fieldType}
        onChange={props.onChange}
        disabled={props.fieldDisabled}
      />
      <div className="flex flex-col">
        <span className="error">{props.error}</span>
      </div>
    </div>
  );
};

export const CardTextArea = (props: CardTextAreaProps) => {
  return (
    <div className={`card-field flex flex-col row-gap-small`}>
      <FieldLabel label={props.fieldLabel} required={props.fieldRequired} />
      <textarea
        className="input textarea"
        name={props.fieldName}
        value={props.fieldValue}
        onChange={props.onChange}
        disabled={props.fieldDisabled}
        rows={props.fieldRows}
      />
      <div className="flex flex-col">
        <span className="error">{props.error}</span>
      </div>
    </div>
  );
};

export const CardSelect = (props: CardSelectProps) => {
  return (
    <div className={`card-field flex flex-col row-gap-small`}>
      <FieldLabel label={props.fieldLabel} required={props.fieldRequired} />
      <Field
        name={props.fieldName}
        as="select"
        className="input select"
        disabled={props.fieldDisabled}
      >
        {props.options}
      </Field>
      <div className="flex flex-col">
        <span className="error">{props.error}</span>
      </div>
    </div>
  );
};

export const CardMultiSelect = (props: CardMultiSelectProps) => {
  return (
    <div className={`card-field flex flex-col row-gap-small`}>
      <FieldLabel label={props.fieldLabel} required={props.fieldRequired} />
      <MultiSelect
        data={props.fieldData}
        value={props.fieldValues}
        onChange={props.onChange}
        placeholder={props.fieldPlaceholder}
        searchable={props.fieldSearchable}
        disabled={props.fieldDisabled}
        className={props.className}
      />
      <div className="flex flex-col">
        <span className="error">{props.error}</span>
      </div>
    </div>
  );
};

export const CardHoursField = (props: any) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return (
    <div className={`card-field flex flex-col row-gap-small`}>
      <FieldLabel label={props.fieldLabel} required={props.fieldRequired} />
      <div className="hours-wrapper">
        {props.hours.map((shop_hour: any, index: any) => {
          const from_date = moment('2023-02-20 ' + shop_hour.from_time),
            to_date = moment('2023-02-20 ' + shop_hour.to_time);
          return (
            <div className="hour-field flex flex-row row-gap-small" key={shop_hour.day}>
              <NativeSelect
                data={days.filter(
                  (day: string) =>
                    day.toLowerCase() === shop_hour.day ||
                    !props.hours.some((h: any) => h.day === day.toLowerCase())
                )}
                value={shop_hour.day.charAt(0).toUpperCase() + shop_hour.day.slice(1)}
                disabled={props.fieldDisabled}
                onChange={(event) => props.onChange(event, index)}
              />

              {props.fieldDisabled ? (
                <div className="flex flex-col">
                  <span>{from_date.format('h:mm A')}</span>
                  <span>to</span>
                  <span>{to_date.format('h:mm A')}</span>
                </div>
              ) : (
                <span className="flex flex-row">
                  <div>
                    <TimeInput
                      value={from_date.toDate()}
                      onChange={(date) =>
                        props.onTimeChange(moment(date).format('HH:mm:ss'), 'from_time', index)
                      }
                    />
                  </div>
                  <div>
                    <TimeInput
                      label="to"
                      className=""
                      value={to_date.toDate()}
                      onChange={(date) =>
                        props.onTimeChange(moment(date).format('HH:mm:ss'), 'to_time', index)
                      }
                    />
                  </div>
                </span>
              )}

              {!props.fieldDisabled && (
                <button
                  className="delete-button cursor-pointer hover-scale-up active-scale-down"
                  onClick={() => props.onDelete(index)}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
        {!props.fieldDisabled && props.hours.length < 7 && (
          <div
            className="hour-field flex flex-row row-gap-small cursor-pointer hover-scale-up active-scale-down justify-content-center align-items-center"
            onClick={() =>
              props.onCreate({
                day: days
                  .filter(
                    (day: string) => !props.hours.some((h: any) => h.day === day.toLowerCase())
                  )[0]
                  .toLowerCase(),
                from_time: '10:00:00',
                to_time: '17:00:00',
              })
            }
          >
            +
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="error">{props.error}</span>
      </div>
    </div>
  );
};
