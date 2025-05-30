import { TextField } from '@mui/material';
import AdapterJalali from '@date-io/date-fns-jalali';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useInput } from 'react-admin';

export default function ReactAdminJalaliDateInput(props) {
  const { onChange, onBlur, isRequired, ...rest } = props;

  const { field } = useInput({
    // Pass the event handlers to the hook but not the component as the field property already has them.
    // useInput will call the provided onChange and onBlur in addition to the default needed by react-hook-form.
    isRequired,
    ...props,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterJalali}>
      <DatePicker
        mask="____/__/__"
        onChange={(newValue) => {
          field.onChange(newValue);
        }}
        value={field.value}
        renderInput={(params) => (
          <TextField disabled {...field} {...params} {...rest} />
        )}
      />
    </LocalizationProvider>
  );
}
