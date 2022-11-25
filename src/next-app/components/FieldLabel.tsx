import styles from '../styles/components/FieldLabel.module.css';

type FieldLabelProps = {
  label: string;
  /**
   * Adds a red asterisk.
   */
  required?: boolean;
};

const FieldLabel = (props: FieldLabelProps) => {
  return (
    <span className={styles.label}>
      {props.label}
      {props.required ? <span className={styles.asterisk}>*</span> : <></>}
    </span>
  );
};

export default FieldLabel;
