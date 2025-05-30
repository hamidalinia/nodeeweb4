import { useState } from 'react';
import AdapterJalali from '@date-io/date-fns-jalali';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslate } from 'react-admin';
import dayjs from 'dayjs';

export default function FilterWithDate({
  type,
  handlerChangeFilter,
  disableFuture = false,
}) {
  const [value, setValue] = useState(null);
  const translate = useTranslate();

  return (
    <LocalizationProvider dateAdapter={AdapterJalali}>
      <DatePicker
        mask="____/__/__"
        className={type}
        label={translate('pos.filter.' + type)}
        disableFuture={disableFuture}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          // check validity
          if (dayjs(newValue).isValid()) handlerChangeFilter(newValue, type);
        }}
        renderInput={(params) => (
          <TextField sx={{ mt: '8px' }} {...params} size="small" />
        )}
      />
    </LocalizationProvider>
  );
}
