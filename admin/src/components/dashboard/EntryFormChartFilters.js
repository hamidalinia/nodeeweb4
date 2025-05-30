import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useGetList } from 'react-admin';

import FilterWithDate from '@/components/dashboard/base/FilterWithDate';

export default function EntryFormChartFilters(props) {
  const { handleChangeForm, handlerStart, handlerEnd, model } = props;
  const [form, setForm] = useState('');
  const { isLoading, data: forms } = useGetList(model);

  const startHandler = (dateValue) => {
    handlerStart(dateValue);
  };
  const endHandler = (dateValue) => {
    handlerEnd(dateValue);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">انتخاب فرم</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={form}
          label="form"
          onChange={(e) => {
            setForm(e.target.value);
            handleChangeForm(e.target.value);
          }}>
          <MenuItem disabled value="">
            <em>Please Select</em>
          </MenuItem>
          {/*<MenuItem  value="all">*/}
          {/*  <em>نمایش همه</em>*/}
          {/*</MenuItem>*/}
          {forms &&
            forms.map((form, index) => (
              <MenuItem key={index} value={form._id}>
                {form.title.fa}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FilterWithDate
        type="startDate"
        handlerChangeFilter={startHandler}
        disableFuture
      />
      <FilterWithDate
        type="endDate"
        handlerChangeFilter={endHandler}
        disableFuture
      />
    </Box>
  );
}
