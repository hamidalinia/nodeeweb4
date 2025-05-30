import {
  BooleanInput,
  Edit,
  ArrayInput,
  SimpleFormIterator,
    useLocaleState,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
    NumberInput,
  TextInput,
  useTranslate,
} from 'react-admin';
import _get from 'lodash/get';


import dayjs from 'dayjs';
import jalaliPlugin from '@zoomit/dayjs-jalali-plugin';
import {Box, CircularProgress} from '@material-ui/core';

import { ReactAdminJalaliDateInput, SimpleForm } from '@/components';
import {useEffect, useState} from "react";
import API from "@/functions/API";

dayjs.extend(jalaliPlugin);
const fDate = (d) =>
  dayjs(d, { jalali: true }).calendar('gregory').toISOString();
const required = () => (value: any) =>
    value
        ? undefined
        : 'required';
const TransformData = (data, options) => {
  const expireDate = _get(data, 'data.expireDate');
  return {
    ...data,
    birthdate: fDate(data.birthdate),
    data: {
      ...data.data,
      expireDate: fDate(expireDate),
    },
  };
};

export default function CustomerEdit(props) {
  const translate = useTranslate();
    const [role, setRole] = useState(localStorage.getItem('role')); // Default mode is 'advanced'

    const [childs, setChilds] = useState([]);
    const [isCompanyNameUnique, setIsCompanyNameUnique] = useState(false);
    const [isCompanyTelNumberUnique, setIsCompanyTelNumberUnique] =
        useState(false);
    const [loading, setLoading] = useState(true);
    const [theData, setTheData] = useState(false);

    const locale = useLocaleState();

    useEffect(() => {
    }, [locale]);

    console.log('locale', locale);

    const alertMessage = () => {
        return locale[0] === 'fa'
            ? 'مقدار یکتا باید باشد.'
            : 'Value must be unique!';
    };

    const successMessage = () => {
        return locale[0] === 'fa' ? 'مقدار یکتا است.' : 'Value is unique!';
    };

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        API.get('/settings/customerStatus')
            .then(({data = {}}) => {
                setChilds(data);
                setTheData(true);
            })
            .catch((e) => {
                setTheData(true);
            })
            .finally(() => setLoading(false));
    };

    const checkCompanyName = (value) => {
        //send a request to check if the value is unique
        API.get(`/customers/companyName/${value}`)
            .then(({data = {}}) => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => setLoading(false));

        // setIsCompanyNameUnique(true);
    };
    const checkCompanyTelNumber = (value) => {
        //send a request to check if the value is unique
        // setIsCompanyTelNumberUnique(true);
    };

  return (
    <Edit transform={TransformData}>
      <SimpleForm>
        <TextInput
          fullWidth
          disabled
          source="id"
          label="resources.customers._id"
        />
          <div className={'box'}>
              <label>{translate('resources.customers.personalData')}</label>
              <NumberInput
                  fullWidth
                  className={'ltr'}
                  source="phoneNumber"
                  // validate={required()}
                  // helperText={translate('required')}
                  label={translate('resources.customers.phoneNumber')}
              />
              <TextInput
                  fullWidth
                  source="firstName"
                  label={translate('resources.customers.firstName')}
              />
              <TextInput
                  fullWidth
                  source="lastName"
                  label={translate('resources.customers.lastName')}
              />
          </div>
          {role!='agent' &&
              <>
          <div className={'box'}>
              <label>{translate('resources.customers.companyData')}</label>
              <NumberInput
                  onChange={(e) => {
                      checkCompanyTelNumber(e.target.value);
                  }}
                  className={'ltr'}
                  fullWidth
                  source="companyTelNumber"
                  type="text"
                  label={translate('resources.customers.companyTelNumber')}
              />
              {loading ? (
                  <CircularProgress size={25}/>
              ) : (
                  theData && (
                      <>
                          <div>
                              {isCompanyTelNumberUnique ? (
                                  <p>{successMessage()}</p>
                              ) : (
                                  <p>{alertMessage()}</p>
                              )}
                          </div>
                      </>
                  )
              )}
              <TextInput
                  onChange={(e) => {
                      checkCompanyName(e.target.value);
                  }}
                  fullWidth
                  source="companyName"
                  type="text"
                  label={translate('resources.customers.companyName')}
              />
              {loading ? (
                  <CircularProgress size={25}/>
              ) : (
                  theData && (
                      <>
                          <div>
                              {isCompanyNameUnique ? (
                                  <p>{successMessage()}</p>
                              ) : (
                                  <p>{alertMessage()}</p>
                              )}
                          </div>
                      </>
                  )
              )}

          </div>


          <div className={'box'}>
              <label>{translate('resources.customers.extraData')}</label>

              <TextInput
                  fullWidth
                  source="internationalCode"
                  label={translate('resources.customers.internationalCode')}
              />
              <TextInput
                  fullWidth
                  source="email"
                  type="email"
                  label={translate('resources.customers.email')}
              />

              <TextInput
                  fullWidth
                  source="countryCode"
                  label={translate('resources.customers.countryCode')}
              />
              <TextInput
                  fullWidth
                  source="activationCode"
                  label={translate('resources.customers.activationCode')}
              />
              <TextInput
                  defaultValue="{}"
                  multiline
                  fullWidth
                  source="data"
                  label={translate('resources.customers.data')}
              />
              <ReactAdminJalaliDateInput
                  fullWidth
                  source="birthdate"
                  label={translate('resources.customers.birthdate')}
              />
              <SelectInput
                  fullWidth
                  label={translate('resources.customers.sex')}
                  defaultValue=""
                  source="sex"
                  choices={[
                      {id: '', name: ''},
                      {id: 'male', name: translate('resources.customers.male')},
                      {id: 'female', name: translate('resources.customers.female')},
                  ]}
              />
          </div>

          <div className={'box'}>
              <label>{translate('resources.customers.grouping')}</label>

              <SelectInput
                  label={translate('resources.customers.source')}
                  defaultValue="CRM"
                  fullWidth
                  source="source"
                  choices={[
                      {id: 'WEBSITE', name: translate('resources.customers.WEBSITE')},
                      {id: 'CRM', name: translate('resources.customers.CRM')},
                  ]}
              />


              <ReferenceArrayInput source="customerGroup" reference="customerGroup">
                  <SelectArrayInput
                      fullWidth
                      label={translate('resources.customers.customerGroup')}
                      optionText="name.fa"
                  />
              </ReferenceArrayInput>
          </div>

          <ReactAdminJalaliDateInput
          isRequired
          fullWidth
          source="data.expireDate"
          label={translate('resources.customers.expireDate')}
        />
         <ArrayInput source="address">
          <SimpleFormIterator>
            <TextInput fullWidth source="City" label="City" />
            <TextInput fullWidth source="PostalCode" label="PostalCode" />
            <TextInput fullWidth source="State" label="State" />
            <TextInput fullWidth source="StreetAddress" label="StreetAddress" />
          </SimpleFormIterator>
        </ArrayInput>



          <BooleanInput
          fullWidth
          source="active"
          label="resources.customers.active"
        /></>}
      </SimpleForm>
    </Edit>
  );
}
