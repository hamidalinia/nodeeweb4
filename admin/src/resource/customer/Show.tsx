import {
  ArrayField,
  Datagrid,
  FunctionField,
  Show,
  SimpleShowLayout,
  TextField,
  useTranslate,
} from 'react-admin';
import { styled } from '@mui/material/styles';
import { Box, Paper, Grid } from '@mui/material';

import { dateFormat } from '@/functions';
import {
  Notifications,
    Campaigns,
  Orders,
  Tasks,
  Transactions,
  Notes,
  Documents,
  CustomerStatus,
} from '@/components';
import {useState} from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function CustomerShow(props) {
  const translate = useTranslate();
    const [role, setRole] = useState(localStorage.getItem('role')); // Default mode is 'advanced'

  return (
    <Show {...props} className={"the-container-grid"} >
      <SimpleShowLayout>
        <Grid container spacing={2}>
          <Grid className={"the-main-grid"} item lg={9} md={8} xs={12}>
            <Box sx={{ flexGrow: 1 }} style={{ marginBottom: '20px' }}>
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.updatedAt') + ': '}{' '}
                    <FunctionField
                      label="resources.customers.updatedAt"
                      render={(record) => (
                        <span>{dateFormat(record.updatedAt)}</span>
                      )}
                    />
                  </Item>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.createdAt') + ': '}{' '}
                    <FunctionField
                      label="resources.customers.createdAt"
                      render={(record) => (
                        <span>{dateFormat(record.createdAt)}</span>
                      )}
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    <TextField
                      source="firstName"
                      label="resources.customers.firstName"
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    <TextField
                      source="lastName"
                      label="resources.customers.lastName"
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.email') + ': '}
                    <TextField
                      source="email"
                      label="resources.customers.email"
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    <TextField
                      source="phoneNumber"
                      label="resources.customers.phoneNumber"
                    />
                  </Item>
                </Grid>
                  {role!='agent' && <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.countryCode') + ': '}
                    <TextField
                      source="countryCode"
                      label="resources.customers.countryCode"
                    />
                  </Item>
                </Grid>}

                  {role!='agent' && <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.activationCode') + ': '}
                    <TextField
                      source="activationCode"
                      label="resources.customers.activationCode"
                    />
                  </Item>
                </Grid>}

                  {role!='agent' && <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.sex') + ': '}
                    <TextField source="sex" label="resources.customers.sex" />
                  </Item>
                </Grid>}
                  {role!='agent' && <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.internationalCode') + ': '}
                    <TextField
                      source="internationalCode"
                      label="resources.customers.internationalCode"
                    />
                  </Item>
                </Grid>}
                  {role!='agent' && <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.birthday') + ': '}
                    <TextField
                      source="birthday"
                      label="resources.customers.birthday"
                    />
                  </Item>
                </Grid>}
                  {role!='agent' && <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.companyName') + ': '}
                    <TextField
                      source="companyName"
                      label="resources.customers.companyName"
                    />
                  </Item>
                </Grid>}
                  {role!='agent' &&  <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.companyTelNumber') + ': '}
                    <TextField
                      source="companyTelNumber"
                      label="resources.customers.companyTelNumber"
                    />
                  </Item>
                </Grid>}
              </Grid>
            </Box>
              {role!='agent' && <ArrayField source="address" label="resources.customers.address">
              <Datagrid>
                <TextField source="Title" label="resources.customers.title" />
                <TextField source="State" label="resources.customers.state" />
                <TextField source="City" label="resources.customers.city" />
                <TextField
                  source="PhoneNumber"
                  label="resources.customers.phoneNumber"
                />
                <TextField
                  source="PostalCode"
                  label="resources.customers.postalCode"
                />
                <TextField
                  source="StreetAddress"
                  label="resources.customers.streetAddress"
                />
              </Datagrid>
            </ArrayField>}

            <div style={{ height: '50px' }}></div>
            <Orders />
              { role!='agent' && <><div style={{ height: '50px' }}></div>
            <Notifications />
            <div style={{ height: '50px' }}></div>
              <Campaigns />
            <div style={{ height: '50px' }}></div>
            <Transactions isEdit={false} /></>}
          </Grid>
            { role!='agent' && <Grid item lg={3} md={4} xs={12}>
            <CustomerStatus />
            <Tasks />
            <Notes />
            <Documents />
          </Grid>}
        </Grid>
      </SimpleShowLayout>
    </Show>
  );
}
