import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios';
import Header from '../../components/Header';
import apiUrl from '../../constants/api-url';
import { useFormik, Field, FormikProvider } from 'formik';
import FieldLabel from '../../components/FieldLabel';
import { ChangeEventHandler, useState } from 'react';
import Button from '../../components/Button';
import { GrFormEdit, GrFormClose } from 'react-icons/gr';
import { useRouter } from 'next/router';
import * as yup from 'yup';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc2MjQ0OTgzLCJqdGkiOiIxZDg4MTJhYTg5ZmI0N2JjYjFlODU3ODU4NWZjMDNjMyIsInVzZXJfaWQiOjE0OH0.vZ8GjUqu9NUbGX4um7MSoCWI6OQVZrFDZQmJ6I57tlI';

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
      <div className="flex flex-col">
        <span className="error">{props.error}</span>
      </div>
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
      <div className="flex flex-col">
        <span className="error">{props.error}</span>
      </div>
    </div>
  );
};

const CardSelect = (props: CardSelectProps) => {
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

const WorkOrdersDetail: NextPage = ({ workOrder, employees }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [inEdit, setInEdit] = useState(false);
  const [errors, setErrors] = useState([]);
  const schema = yup.object().shape({
    odometer_reading_before: yup.number().optional().positive().integer(),
    odometer_reading_after: yup.number().optional().positive().integer(),
    discount: yup.number().optional().positive(),
    grand_total: yup.number().required().positive(),
    notes: yup.string(),
    appointment: yup.object().shape({
      customer: yup.object().shape({
        username: yup.string().required(),
      }),
    }),
    employee: yup.object().shape({
      id: yup.number().required().positive().integer(),
    }),
  });
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
    validationSchema: schema,
    onSubmit: async (values) => {
      const valuesToSend = {
        odometer_reading_before: values.odometer_reading_before,
        odometer_reading_after: values.odometer_reading_after,
        discount: values.discount,
        grand_total: values.grand_total,
        notes: values.notes,
        employee: values.employee.id,
      };

      try {
        const res = await axios.patch(`${apiUrl}/shops/work-orders/${id}/`, valuesToSend, {
          headers: { Authorization: `JWT ${token}` },
        });
        if (res.status === 200) {
          router.reload();
        }
      } catch (error: any) {
        setErrors(error.response.data.errors);
        scrollTo(0, 0);
      }
    },
  });

  return (
    <div className="container">
      <Header
        title={`Work Order: #${workOrder.id}`}
        rightIcon={inEdit ? GrFormClose : GrFormEdit}
        onRightIconClick={() => setInEdit(!inEdit)}
      />
      <div className="wrapper">
        <div className="flex flex-row row-gap-large">
          {errors.length > 0 && (
            <div className="flex flex-col row-gap-small">
              {errors.map((error: any, index) => {
                return (
                  <span className="error" key={`error_${index}`}>
                    {error.detail}
                  </span>
                );
              })}
            </div>
          )}
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
                  error={form.errors.appointment?.customer?.username}
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
                  error={form.errors.employee?.id}
                />
                <CardTextField
                  fieldValue={form.values.grand_total}
                  fieldName="grand_total"
                  fieldLabel="Grand Total ($)"
                  fieldType="number"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.grand_total}
                  fieldRequired
                />
                <CardTextField
                  fieldValue={form.values.discount}
                  fieldName="discount"
                  fieldLabel="Discount ($)"
                  fieldType="number"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.discount}
                />
                <CardTextField
                  fieldValue={form.values.odometer_reading_before}
                  fieldName="odometer_reading_before"
                  fieldLabel="Odometer Reading (Before Service)"
                  fieldType="number"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.odometer_reading_before}
                />
                <CardTextField
                  fieldValue={form.values.odometer_reading_after}
                  fieldName="odometer_reading_after"
                  fieldLabel="Odometer Reading (After Service)"
                  fieldType="number"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.odometer_reading_after}
                />
                <CardTextArea
                  fieldValue={form.values.notes}
                  fieldName="notes"
                  fieldLabel="Notes"
                  fieldDisabled={!inEdit}
                  onChange={form.handleChange}
                  error={form.errors.notes}
                />
                {inEdit && <Button type="submit" title="Save" width={'100%'}></Button>}
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

export default WorkOrdersDetail;
