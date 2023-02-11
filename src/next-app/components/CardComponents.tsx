import { ChangeEventHandler } from 'react';
import { Field } from 'formik';
import FieldLabel from './FieldLabel';

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
  options: ReadonlyArray<string> | undefined;
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
