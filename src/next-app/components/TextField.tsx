import TextMultiField, { TextMultiFieldProps } from "./TextMultiField";
import styles from "../styles/components/TextField.module.css";

type TextFieldProps = Omit<
  TextMultiFieldProps,
  "multi" | "onChange" | "error"
> & {
  onChange?: (newVal: string) => void;
  errors?: Set<string>;
};

const TextField = (props: TextFieldProps) => {
  const handleChange = (newVals: string[]) => {
    props.onChange && props.onChange(newVals[0]);
  };

  return (
    <div>
      <TextMultiField
        {...props}
        onChange={handleChange}
        error={props.errors !== undefined}
      />
      {props.errors ? (
        <div className={styles["errors-container"]}>
          {Array.from(props.errors).map((error) => {
            return (
              <span className={styles.error} key={error}>
                {error}
              </span>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TextField;
