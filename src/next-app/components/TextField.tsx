import TextMultiField, { TextMultiFieldProps } from "./TextMultiField";

type TextFieldProps = Omit<TextMultiFieldProps, 'multi' | 'onChange'> & {
  onChange?: (newVal: string) => void;
};

const TextField = (props: TextFieldProps) => {
  const handleChange = (newVals: string[]) => {
    props.onChange && props.onChange(newVals[0]);
  };

  return (
    <TextMultiField {...props} onChange={handleChange} />
  );
};

export default TextField;
