import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios';
import Header from '../../components/Header';
import apiUrl from '../../constants/api-url';
import { useFormik, Field, FormikProvider } from 'formik';
import FieldLabel from '../../components/FieldLabel';
import { ChangeEventHandler, useState } from 'react';
import Button from '../../components/Button';

type CardTextFieldProps = {
  fieldValue: string | ReadonlyArray<string> | number | undefined;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  fieldRequired?: boolean | undefined;
  fieldDisabled?: boolean | undefined;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
};

type CardTextAreaProps = {
  fieldValue: string | ReadonlyArray<string> | number | undefined;
  fieldName: string;
  fieldLabel: string;
  fieldRows?: number | undefined;
  fieldRequired?: boolean | undefined;
  fieldDisabled?: boolean | undefined;
  onChange: ChangeEventHandler<HTMLTextAreaElement> | undefined;
};

type CardSelectProps = {
  fieldName: string;
  fieldLabel: string;
  fieldRequired?: boolean | undefined;
  fieldDisabled?: boolean | undefined;
  options: ReadonlyArray<string> | undefined;
};

const CardTextField = (props: CardTextFieldProps) => {
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
    </div>
  );
};

const CardTextArea = (props: CardTextAreaProps) => {
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
    </div>
  );
};

const CardSelect = (props: CardSelectProps) => {
  return (
    <div className={`card-field flex flex-col row-gap-small`}>
      <FieldLabel label={props.fieldLabel} required={props.fieldRequired} />
      <Field name={props.fieldName} as="select" className="input select" disabled={props.fieldDisabled}>
        {props.options}
      </Field>
    </div>
  );
};

const WorkOrdersList: NextPage = ({ workOrder, employees }: any) => {
  const [inEdit, setInEdit] = useState(false);
  const form = useFormik({
    initialValues: {
      odometer_reading_before: workOrder.odometer_reading_before,
      odometer_reading_after: workOrder.odometer_reading_after,
      discount: workOrder.discount,
      grand_total: workOrder.grand_total,
      notes: workOrder.notes,
      appointment: {
        customer: {
          username: workOrder.appointment.customer.username,
        },
      },
      employee: {
        id: workOrder.employee.id,
      },
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="container">
      <Header title={`Work Order: #${workOrder.id}`} />
      <div className="wrapper">
        <div className="flex flex-row row-gap-large">
          <FormikProvider value={form}>
            <form onSubmit={form.handleSubmit}>
              <h2 className="form-header">Work Order Information</h2>
              <div className={`card${inEdit ? 'edit' : ''}`} style={{ marginBottom: '12px' }}>
                <CardTextField
                  fieldValue={form.values.appointment.customer.username}
                  fieldName="appointment.customer.username"
                  fieldLabel="Customer"
                  fieldType="string"
                  fieldRequired
                  fieldDisabled={true}
                  onChange={form.handleChange}
                />
                <CardSelect
                  fieldName="employee.id"
                  fieldLabel="Employee"
                  options={employees.map((employee: any) => {
                    return (
                      <option key={employee.user.id} value={employee.user.id}>
                        @{employee.user.username}
                      </option>
                    );
                  })}
                  fieldRequired
                  fieldDisabled={!inEdit}
                />
                <CardTextField
                  fieldValue={form.values.odometer_reading_before}
                  fieldName="odometer_reading_before"
                  fieldLabel="Odometer Reading (Before Service)"
                  fieldType="number"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                />
                <CardTextField
                  fieldValue={form.values.odometer_reading_after}
                  fieldName="odometer_reading_after"
                  fieldLabel="Odometer Reading (After Service)"
                  fieldType="number"
                  fieldRequired
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                />
                <CardTextField
                  fieldValue={form.values.discount}
                  fieldName="discount"
                  fieldLabel="Discount ($)"
                  fieldType="number"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                />
                <CardTextField
                  fieldValue={form.values.grand_total}
                  fieldName="grand_total"
                  fieldLabel="Grand Total ($)"
                  fieldType="number"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                />
                <CardTextArea
                  fieldValue={form.values.notes}
                  fieldName="notes"
                  fieldLabel="Notes"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                />
                <Button type="submit" title="Submit" width={'100%'}></Button>
              </div>
            </form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { id } = context.query;
  try {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc2MjQ0OTgzLCJqdGkiOiIxZDg4MTJhYTg5ZmI0N2JjYjFlODU3ODU4NWZjMDNjMyIsInVzZXJfaWQiOjE0OH0.vZ8GjUqu9NUbGX4um7MSoCWI6OQVZrFDZQmJ6I57tlI';
    const workOrder = await axios.get(`${apiUrl}/shops/work-orders/${id}`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const employees = await axios.get(`${apiUrl}/shops/shops/3/employees`, {
      headers: { Authorization: `JWT ${token}` },
    });
    return {
      props: {
        workOrder: workOrder.data,
        employees: employees.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        workOrder: {},
        employees: [],
      },
    };
  }
};

export default WorkOrdersList;
