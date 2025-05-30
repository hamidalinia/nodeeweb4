import { forwardRef } from 'react';
import { useField } from 'formik';
import { TextField, FormHelperText, FormControl, styled } from '@mui/material';

import { StandardTextFieldProps, FormControlProps } from '@mui/material';

const StyledFormControl = styled(FormControl)(() => ({
  width: '100%',
  position: 'relative',
  // helper text
  '& > p': {
    position: 'absolute',
    bottom: -20,
    margin: 0,
  },
}));

const Label = styled('label')(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey[700],
  marginBottom: theme.spacing(0.5),
  position: 'relative',
  fontSize: '1rem',
}));
const ReqStar = styled('span')(({ theme }) => ({
  marginInlineStart: theme.spacing(0.5),
  color: theme.palette.error.main,
}));

export interface TextInputProps extends StandardTextFieldProps {
  name: string;
  value?: string;
  containerProps?: FormControlProps;
}

const TextInput = forwardRef<HTMLDivElement, TextInputProps>(
  (
    {
      label,
      name,
      placeholder,
      value,
      containerProps,
      required = false,
      ...rest
    }: TextInputProps,
    ref
  ) => {
    const [field, meta] = useField({ name, value });
    let error = meta.touched && meta.error ? meta.error : false;

    return (
      <StyledFormControl ref={ref} error={Boolean(error)} {...containerProps}>
        {label ? (
          <Label htmlFor={name}>
            {label}
            {required ? <ReqStar>*</ReqStar> : null}
          </Label>
        ) : null}
        <TextField
          placeholder={placeholder}
          name={name}
          required={required}
          variant="outlined"
          // InputLabelProps={{ shrink: true }}
          {...field}
          {...rest}
        />
        {error ? <FormHelperText>{error}</FormHelperText> : null}
      </StyledFormControl>
    );
  }
);

TextInput.displayName = 'TextInput';
export default TextInput;
