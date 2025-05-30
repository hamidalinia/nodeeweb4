import { useEffect, useState } from 'react';

import {
  BooleanField,
  ChipField,
  Datagrid,
  downloadCSV,
  EditButton,
  EmailField,
  ExportButton,
    SimpleList,
  FilterList,
    ReferenceInput,
  Filter,
  FunctionField,
  ReferenceArrayField,
  ShowButton,
  SingleFieldList,
  TextField,
  FilterListItem,
    useTranslate,
  TextInput,
  TopToolbar,
    SelectInput,
  useRefresh,
    Create,
    FileField,
    FileInput
} from 'react-admin';
import { Card, CardContent,Button } from '@mui/material';
import {Chip, useMediaQuery} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import MailIcon from '@mui/icons-material/MailOutline';
import { ImportButton } from 'react-admin-import-csv';
import * as jsonExport from 'jsonexport/dist';
import dayjs from 'dayjs';
import Modal from '@/components/global/Modal';

import { dateFormat } from '@/functions';
import { List, ReactAdminJalaliDateInput,SimpleForm } from '@/components';

import API from '@/functions/API';

const PostFilter = (props) => {
  return (
    <Filter context="form">
      <TextInput
        label="resources.customers.companyName"
        source="companyName"
        alwaysOn
      />
      <TextInput
        label="resources.customers.firstName"
        source="firstName"
        alwaysOn
      />
      <TextInput
        label="resources.customers.lastName"
        source="lastName"
        alwaysOn
      />
      <TextInput
        label="resources.customers.phoneNumber"
        source="phoneNumber"
        alwaysOn
      />
      <TextInput
        label="resources.customers.companyTelNumber"
        source="companyTelNumber"
        alwaysOn
      />
        <ReferenceInput source="campaign" reference="campaign" alwaysOn  >
            <SelectInput optionText={"title.fa"} optionValue={"_id"} />
        </ReferenceInput>
      {/* <ReactAdminJalaliDateInput
        label='resources.customers.createdAt'
        source="createdAt"
        alwaysOn
        isRequired={false}
        defaultValue=""
      /> */}
    </Filter>
  );
};

const exporter = (customers) => {
  const data = customers.map((i) => {
    const { backlinks, author, ...customerForExport } = i; // omit backlinks and author

    if (customerForExport) return customerForExport;

    return {
      _id: i._id,
      firstName: i.firstName,
      lastName: i.lastName,
      phoneNumber: i.phoneNumber,
      email: i.email,
      source: i.source,
      credit: i.credit,
      orderCount: i.orderCount,
      customerGroup: i.customerGroup ? i.customerGroup.join('+') : '',
      active: i.active,
      createdAt: dayjs(i.createdAt).format('YYYY-MM-DD_HH:mm'),
      updatedAt: dayjs(i.updatedAt).format('YYYY-MM-DD_HH:mm'),
    };
  });

  jsonExport(
    data,
    {
      headers: [
        '_id',
        'firstName',
        'lastName',
        // 'companyName', // added company name
        // 'companyTelNumber', // and telNumber to json export and in search field
        'phoneNumber',
        'email',
        'source',
        'credit',
        'orderCount',
        'customerGroup',
        'active',
        'createdAt',
        'updatedAt',
      ], // order fields in the export
    },
    (err, csv) => {
      if (err) {
        console.error('some thing went wrong on export');
        return;
      }

      const fileName = 'customer_' + dayjs().format('YYYY-MM-DD_HH-mm');
      downloadCSV(csv, fileName);
    }
  );
};

const ListActions = (props) => {
  const refresh = useRefresh();
    let {basePath, data, resource, toggleImportModal, importModal} = props;
    const t = useTranslate();

    // All configuration options are optional
  const config = {
    // Enable logging
    logging: true,
    // Disable "import new" button
    // disableImportNew: false,
    // Disable "import overwrite" button
    // disableImportOverwrite: false,
    // // A function to translate the CSV rows on import
    // preCommitCallback?: (action: "create" | "overwrite", values: any[]) => Promise<any[]>;
    // // A function to handle row errors after import
    // postCommitCallback?: (error: any) => void;
    // Transform rows before anything is sent to dataprovider
    transformRows: (csvRows) => {
      console.log('csvRows', csvRows);
      // let update = [], create = [];
      let array = [];
      let postsForExport = [];
      if (csvRows)
        postsForExport = csvRows.map((row) => {
          // console.log("row", row);

          row._id = row[' _id'];
          if (row._id)
            array.push({
              _id: row._id,
            });
          if (!row.phoneNumber) row.phoneNumber = row.phoneNumber2;

          if (row.phoneNumber && row.phoneNumber.toString().length < 12) {
            if (row.phoneNumber.toString().length === 10) {
              row.phoneNumber = '98' + row.phoneNumber.toString();
            }
          }
          // else
          // delete row.photos;
          delete row[' _id'];
          delete row['id'];
          // row.title = {
          //   en: row.title_en,
          //   fa: row.title_fa,
          //   ru: row.title_ru,
          //   uz: row.title_uz
          // };
          delete row.title_en;
          delete row.title_ru;
          delete row.title_uz;
          delete row.createdAt;
          delete row.updatedAt;
          // if (row._id) {
          //     update.push(row);
          // } else {
          //     create.push(row);
          // }
          // if()

          return row;
        });
      // console.log("ForImport", postsForExport);
      API.post('/customer/import', JSON.stringify(postsForExport))
        .then(({ data = {} }) => {
          refresh();
          alert('it is ok');
          // window.location.reload();
          // if (data.success) {
          //   values = [];
          //   valuess = [];
          // }
        })
        .catch((err) => {
          console.log('error', err);
        });
    },
    validateRow: async (row) => {
      console.log('row', row);
      if (row.id) {
        // throw new Error("AAAA");
      }
    },
    postCommitCallback: (reportItems) => {
      console.log('reportItems', { reportItems });
    },
    // Async function to Validate a row, reject the promise if it's not valid
    parseConfig: {
      dynamicTyping: true,
      // complete: function(results, file) {
      //     console.log("Parsing complete:", results, file);
      // },
      // preview:1
    },
  };
  return (
    <TopToolbar>
      <ExportButton maxResults={10000000} />
        <Button
            onClick={() => {
                // alert('Your custom action');
                toggleImportModal(!importModal)
            }}
            label={t("resources.customers.import")}
            size={"small"}
        >
            <FileUploadIcon/><span>{t("resources.customers.import")}</span>
        </Button>
    </TopToolbar>
  );
};
const PostFilterSidebar = ({ childs }) => {
  return (
    <Card sx={{ order: -1, mt: 9, ml: 1, minWidth: 200 }}>
      <CardContent sx={{ p: 1 }}>
        <FilterList
          sx={{
            '& > div > div': {
              mr: 0,
              ml: 1,
              display: 'flex',
              alignItems: 'center',
            },
          }}
          label="status"
          icon={<MailIcon />}>
          {childs
            ?.reverse()
            .map((i, idx) => (
              <FilterListItem
                key={idx}
                label={i.title}
                value={{ status: i.slug }}
              />
            ))}
        </FilterList>
      </CardContent>
    </Card>
  );
};
export default function CustomerList(props) {
  const translate = useTranslate();
  const [DATA, setData] = useState([]);
  const [loading, setLoading] = useState(true);
    const [importModal, toggleImportModal] = useState(false);
    const handleUpload = (files) => {
        console.log("handleUpload files", files)
        let file = files[0];

        if (!file) return;
        // setLoading(true);
        let formData = new FormData();
        formData.append('file', file);
        formData.append('type', file.type);
        API.post('/customer/importFromExcel', formData, {
            onUploadProgress: (e) => {
                let p = Math.floor((e.loaded * 100) / e.total);
                console.log("p", p)
                // setProgress(p);
            },
        }).then((p) => {
            // setLoading(false);

            // window.location.reload();

            // handleNotif('resources.settings.logoUploadedSuccessfully');
        });
    };

  useEffect(() => {
    API.get('/settings/customerStatus')
      .then(({ data = {} }) => setData(data))
      .catch((e) => console.error('err=>', e))
      .finally(() => setLoading(false));
  }, []);

  const returnStatus = (st) => {
    let rd = DATA.filter((x) => x.slug == st);
    if (rd && rd[0] && rd[0].title) return rd[0].title;
    else return JSON.stringify(st);
  };
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const t = useTranslate();

  return (
    <List
      exporter={exporter}
      {...props}
      aside={isSmall ? false :(<PostFilterSidebar childs={DATA} />)}
      filters={<PostFilter />}
      actions={<ListActions  toggleImportModal={toggleImportModal} importModal={importModal}/>}>
        {isSmall ? (
            <SimpleList
                primaryText={record => <div>
                    <div className={"d-dfgfd"}>
                        <div className="ph">
                            {record?.phoneNumber && <div className={'wh'}><span>{translate('resources.customers.phoneNumber')}: </span><TextField
                                source="phoneNumber"
                                label="resources.customers.phoneNumber"
                            /></div>}
                            {record?.companyTelNumber && <div className={'wh'}>
                                <span>{translate('resources.customers.companyTelNumber')}: </span>
                                <TextField
                                    source="companyTelNumber"
                                    label="resources.customers.companyTelNumber"
                                /></div>}
                            {record?.email && <div className={'wh'}>
                                <span>{translate('resources.customers.email')}: </span>
                                <EmailField source="email" label="resources.customers.email" />

                            </div>}
                            {record?.activationCode && <div className={'wh'}>
                                <span>{translate('resources.customers.activationCode')}: </span>
                                <TextField
                                    source="activationCode"
                                    label="resources.customers.activationCode"
                                />
                            </div>}
                        </div>


                    </div>
                    {/*<div>{record?.customer?.firstName + ' ' + record?.customer?.lastName}</div>*/}
                    <div>{record?.customer?.phoneNumber}</div>
                    {(record?.firstName || record?.lastName) && <div className={'wh'}>
                        <div>{record?.firstName + ' ' + record?.lastName}</div>

                    </div>}

                    {(record?.companyName) && <div className={'wh'}>
                        <span>{translate('resources.customers.companyName')}: </span>
                        <TextField
                            source="companyName"
                            label="resources.customers.companyName"
                        /></div>}
                </div>}
                secondaryText={record => <div className="ph">
                    <div className={'m-2'}>
                    <Chip
                        className={record.source}
                        label={record.source}
                    />
                    </div>


                    {record?.customerGroup && <>
                    {JSON.str}
                    </>}

                    <ReferenceArrayField
                        label="resources.customers.customerGroup"
                        reference="customerGroup"
                        source="customerGroup">
                        <SingleFieldList>
                            <ChipField source="slug" />
                        </SingleFieldList>
                    </ReferenceArrayField>
                    <div>
                        {translate('resources.customers.createdAt')}:
                        <span dir="ltr"> {dateFormat(record.createdAt)}</span>
                    </div>
                    <div>
                        {translate('resources.customers.updatedAt')}:
                        <span dir="ltr"> {dateFormat(record.updatedAt)}</span>
                    </div>
                </div>
                }
                // tertiaryText={record => <>
                //     <div>
                //         {translate('resources.customers.createdAt')}:
                //         <span dir="ltr"> {dateFormat(record.createdAt)}</span>
                //     </div>
                //     <div>
                //         {translate('resources.customers.updatedAt')}:
                //         <span dir="ltr"> {dateFormat(record.updatedAt)}</span>
                //     </div>
                //
                //
                //     </>}
                linkType={"edit"}
            />
        ) : (
      <Datagrid>
          <FunctionField
              label="resources.customers.contactData"
              render={(record) => {

                  return (
                      <div className="ph">
                          <div className={'wh'}><span>{translate('resources.customers.phoneNumber')}: </span><TextField
                              source="phoneNumber"
                              label="resources.customers.phoneNumber"
                          /></div>
                          <div className={'wh'}>
                              <span>{translate('resources.customers.companyTelNumber')}: </span>
                              <TextField
                              source="companyTelNumber"
                              label="resources.customers.companyTelNumber"
                          /></div>
                          <div className={'wh'}>
                              <span>{translate('resources.customers.email')}: </span>
                              <EmailField source="email" label="resources.customers.email" />

                          </div>
                          <div className={'wh'}>
                              <span>{translate('resources.customers.activationCode')}: </span>
                              <TextField
                                  source="activationCode"
                                  label="resources.customers.activationCode"
                              />
                          </div>
                      </div>
                  );
              }}
          />


          <FunctionField
              label="resources.customers.customerData"
              render={(record) => {

                  return (
                      <div className="ph">
                          <div className={'wh'}>
                              <span>{translate('resources.customers.firstName')}: </span><TextField
                              source="firstName"
                              label="resources.customers.firstName"
                          /></div>
                          <div className={'wh'}>
                              <span>{translate('resources.customers.lastName')}: </span><TextField
                              source="lastName"
                              label="resources.customers.lastName"
                          /></div>
                          <div className={'wh'}>
                              <span>{translate('resources.customers.companyName')}: </span>
                              <TextField
                                  source="companyName"
                                  label="resources.customers.companyName"
                              /></div>
                      </div>
                  );
              }}
          />
          <FunctionField
              label="resources.customers.source"
              render={(record) => {

                  return (
                      <Chip
                          className={record.source}
                          label={record.source}
                      />
                  );
              }}
          />

        {/*<TextField source="source" label="resources.customers.source" />*/}

        <ReferenceArrayField
          label="resources.customers.customerGroup"
          reference="customerGroup"
          source="customerGroup">
          <SingleFieldList>
            <ChipField source="slug" />
          </SingleFieldList>
        </ReferenceArrayField>
        {/*<FunctionField label="resources.customer.customerGroup")}*/}
        {/*render={record => {*/}

        {/*return (*/}
        {/*<div className={"categories"}>*/}
        {/*{record.customerGroup && record.customerGroup.map((item, it) => <div>*/}
        {/*<ChipField source={"customerGroup[" + it + "].slug"} label={item.slug}*/}
        {/*sortable={false}/>*/}
        {/*</div>)}*/}

        {/*</div>*/}
        {/*);*/}
        {/*}}/>*/}
        <FunctionField
          label="resources.customers.status"
          render={(record) => {
            const arr = record.status || [];
            const len = arr.length || 0;
            const item = arr[len - 1] || {};
            return (
              <div className="theDate">
                {item.status && returnStatus(item.status)}
              </div>
            );
          }}
        />
        <FunctionField
          label="resources.customers.date"
          render={(record) => {
            return (
              <div className="theDate">
                <div>
                  {translate('resources.customers.createdAt')}:
                  <span dir="ltr"> {dateFormat(record.createdAt)}</span>
                </div>
                <div>
                  {translate('resources.customers.updatedAt')}:
                  <span dir="ltr"> {dateFormat(record.updatedAt)}</span>
                </div>

                {Boolean(record.orderCount) && (
                  <div>
                    {translate('resources.customers.orderCount') +
                      ': ' +
                      `${record.orderCount}`}
                  </div>
                )}
              </div>
            );
          }}
        />

        <BooleanField source="active" label="resources.customers.active" />
        <FunctionField
          label="resources.product.edit"
          render={(record) => (
            <>
              <EditButton />
              <ShowButton />
            </>
          )}
        />
      </Datagrid>)}
        <Modal
            open={importModal}
            onClose={(e,r)=>{
                console.log("e",e,"r",r)
                toggleImportModal(!importModal)
            }}
            className={'width50vw sdfghyjuikol kiuytgfhjuyt modal'}>
            <Card>
                <Create>
                    <SimpleForm>
                        <div className={'rtl-font-family'} style={
                            {
                                direction:'rtl',
                                textAlign:'right',
                                width:'100%',
                                marginBottom:'30px',
                            }
                        }>

                            {translate('resources.customers.excelColumns')}:<span>phoneNumber</span>,<span>firstName</span>,<span>lastName</span>
                        </div>
                        <FileInput
                            name={'file'}
                            onChange={(e) => {
                                console.log("e", e)
                            }}
                            source={'file'}
                            type={'file'}
                            // accept={'*'}
                            onBlur={()=>{
                                console.log("hi")
                            }}

                            options={{
                                onDrop: (e) => handleUpload(e)
                            }}>
                            <FileField
                                source="src"
                                title="title"
                            />
                        </FileInput>
                    </SimpleForm>
                </Create>
            </Card>
        </Modal>

    </List>
  );
}
