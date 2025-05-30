import { TextInput, NumberInput, DateInput } from 'react-admin';

const accPaymentsForm = ({ record }) => (
    <>
        <TextInput source="slug" label="Slug" fullWidth />
        <NumberInput source="amount" label="Amount" fullWidth />
        <DateInput source="date" label="Date" fullWidth />
    </>
);

export default accPaymentsForm;
