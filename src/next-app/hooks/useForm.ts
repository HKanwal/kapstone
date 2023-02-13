import { FormEvent, useEffect, useState } from 'react';
import validateEmail from '../utils/validateEmail';
import validatePhoneNumber from '../utils/validatePhone';

type FieldValue = string;
type Fields<F> = {
  [field in keyof F]: { value: FieldValue; errors: string[] };
};
type ValidationFunctions = 'required' | 'email' | 'phoneNumber';

function copyFields<F>(fields: Fields<F>) {
  return Object.entries<Fields<F>[keyof F]>(fields).reduce((a, [key, { value, errors }]) => {
    return { ...a, [key]: { value: value, errors: [...errors] } };
  }, {}) as Fields<F>;
}

function fieldsToValues<F extends { [field: string]: FieldValue }>(fields: Fields<F>): F {
  return Object.entries(fields).reduce((a, [key, { value }]) => {
    return { ...a, [key]: value };
  }, {}) as F;
}

function toTitle(str: string) {
  if (str.length === 0) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
}

function validateField(field: string, value: FieldValue, schema: ValidationFunctions[]): string[] {
  let errors: string[] = [];
  if (schema.includes('required') && value === '') {
    errors.push(`${toTitle(field)} is required.`);
  } else if (schema.includes('email') && value.length > 0 && !validateEmail(value)) {
    errors.push('Please enter a valid email.');
  } else if (schema.includes('phoneNumber') && value.length > 0 && !validatePhoneNumber(value)) {
    errors.push('Please enter a valid 10 digit phone number. Ex: 123456789');
  }
  return errors;
}

/**
 * Inspired by Formik, a hook/library for managing form state, handling form events,
 * and managing errors.
 */
export function useForm<F extends { [field: string]: FieldValue }>({
  initialValues,
  validationSchema,
  onSubmit,
}: {
  initialValues: F;
  validationSchema: { [field in keyof F]?: ValidationFunctions[] };
  onSubmit?: (
    values: { [field in keyof F]: FieldValue },
    setErrors: (errors: Partial<{ [field in keyof F]: string[] }>) => void
  ) => void;
}) {
  const [fields, setFields] = useState<Fields<F>>(() => {
    return Object.entries(initialValues).reduce((a, [key, value]) => {
      return { ...a, [key]: { value: value, errors: [] } };
    }, {}) as Fields<F>;
  });

  return {
    isValid: Object.keys(fields).every((key) => {
      if (validationSchema[key]?.includes('required') && fields[key].value.length === 0) {
        return false;
      }
      return fields[key].errors.length === 0;
    }),
    values: fieldsToValues(fields),
    errors: Object.entries(fields).reduce((a, [key, { errors }]) => {
      return { ...a, [key]: errors };
    }, {}) as { [field in keyof F]: string[] },
    handleChange: (field: keyof F) => {
      return (newValue: FieldValue) => {
        setFields((prev) => {
          return {
            ...copyFields(prev),
            [field]: { value: newValue, errors: [...prev[field].errors] },
          };
        });
      };
    },
    handleBlur: (field: keyof F) => {
      return () => {
        const errors = validateField(
          field.toString(),
          fields[field].value,
          validationSchema[field] || []
        );
        setFields((prev) => {
          return {
            ...copyFields(prev),
            [field]: { value: prev[field].value, errors },
          };
        });
      };
    },
    handleSubmit: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      let fieldsCopy = copyFields(fields);
      let errorsFound = false;
      for (let field in fieldsCopy) {
        if (field in validationSchema) {
          fieldsCopy[field].errors = validateField(
            field,
            fieldsCopy[field].value,
            validationSchema[field] || []
          );
          if (fieldsCopy[field].errors.length > 0) {
            errorsFound = true;
          }
        } else {
          fieldsCopy[field].errors = [];
        }
      }
      setFields(fieldsCopy);
      if (!errorsFound) {
        onSubmit &&
          onSubmit(fieldsToValues(fieldsCopy), (errors) => {
            let fieldsCopyCopy = copyFields(fieldsCopy);
            for (let field in fieldsCopyCopy) {
              if (field in errors) {
                fieldsCopyCopy[field].errors = errors[field] ?? [];
              } else {
                fieldsCopyCopy[field].errors = [];
              }
            }
            setFields(fieldsCopyCopy);
          });
      }
    },
  };
}
