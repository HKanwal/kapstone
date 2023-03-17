import React, { useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import { useFormik } from 'formik';

export default function EditableTextArea(props: any) {
  const [inEdit, setInEdit] = useState(props.new ? true : false);
  const [errors, setErrors] = useState<string[]>([]);
  const form = useFormik({
    initialValues: {
      [props.name]: props.value,
    },
    validationSchema: props.schema,
    onSubmit: async (values) => {
      const success = await props.onSubmit(values, props.id);
      if (success) {
        setErrors([]);
        setInEdit(false);
      } else {
        setErrors(['Unable to save changes.']);
      }
    },
  });
  return (
    <div className={`shadow-card ${inEdit ? 'active' : ''}`}>
      {props.title && (
        <div className={`shadow-card-header`}>
          <div className="shadow-card-header-wrapper">
            <div className="shadow-card-header-title">{props.title}</div>
            {props.subtitle && <div className="shadow-card-header-subtitle">{props.subtitle}</div>}
          </div>
          {props.hasEditPermission && !props.new && (
            <button className="shadow-card-header-button" onClick={() => setInEdit(!inEdit)}>
              <TbEdit className="shadow-card-header-icon" />
            </button>
          )}
        </div>
      )}
      <form onSubmit={form.handleSubmit}>
        <div className={`shadow-card-body ${inEdit ? '' : 'disabled'}`}>
          {errors.length > 0 && (
            <div className="flex flex-col">
              {errors.map((error: any, index: number) => (
                <span key={'error_' + index} className="error">
                  {errors}
                </span>
              ))}
            </div>
          )}
          <textarea
            className=""
            name={props.name}
            value={form.values[props.name]}
            onChange={form.handleChange}
            disabled={!inEdit}
            //   rows={3}
            autoFocus={inEdit}
          />
        </div>
        {inEdit && (
          <div className="shadow-card-footer">
            <button
              className="shadow-card-footer-item border-right"
              type="submit"
              disabled={form.errors[props.name] !== undefined}
            >
              {props.new ? 'Post' : 'Save'}
            </button>
            <button
              className="shadow-card-footer-item border-right"
              onClick={() => {
                setInEdit(false);
                props.onCancel && props.onCancel();
              }}
            >
              Cancel
            </button>
            {props.onDelete && (
              <button
                className="shadow-card-footer-item"
                onClick={async () => {
                  setInEdit(false);
                  const status = await props.onDelete();
                  if (!status) {
                    setInEdit(true);
                    setErrors(['Unable to delete.']);
                  } else {
                    setErrors([]);
                  }
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
