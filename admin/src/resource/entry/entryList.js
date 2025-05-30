import {
  Datagrid,
  DeleteButton,
  EditButton,
    SimpleList,
    Link,
  ShowButton,
  Filter,
  FunctionField,
  Pagination,
  TextField,
  TextInput,
  SearchInput,
  DateInput ,
  useTranslate,
  SelectInput,
  ReferenceInput,
  ReferenceArrayField,
  SelectArrayInput,
  useListContext
} from "react-admin";

import API, { BASE_URL } from "@/functions/API";
import { dateFormat } from "@/functions";
import {
  CatRefField,
  EditOptions,
  FileChips,
  List,
  ShowDescription,
  showFiles,
  ShowLink,
  ShowOptions,
  ShowPictures,
  SimpleForm,
  SimpleImageField,
  UploaderField
} from "@/components";
import { Button,useMediaQuery,Chip } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';

import React from "react";

import { useGetList, useList } from 'react-admin';



const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />;


const postRowStyle = (record, index) => {
  
  return ({
    backgroundColor: "#ee811d"
  });
};


const PostFilter = (props) => {
  const translate = useTranslate();
  const [status,setStatus] = React.useState(null);
const { data, total, isLoading, error } = useGetList(
  'form',
  { pagination: { page: 1, perPage: 100 } },
);
React.useEffect(()=>{
  API.get("/settings/formStatus").then(( response = {} ) => {
    const {data} = response;
    setStatus(data);
  })
},[])


  return (
    <Filter {...props}>
      {
        data && data.length > 0 && (
          <SelectInput
          label="انتخاب فرم"
          source="form"
          choices={data}
          optionText="title.fa"
          optionValue="_id"
          alwaysOn 
  />
        )
      }
        

        {
          status ? (
            <SelectInput
                label="انتخاب وضعیت"
                source="status"
                choices={status}
                optionText="title"
                optionValue="slug"
                alwaysOn 
        />
          ):(
              <span>Loadding...</span>
          )
        }
      {/* <SearchInput source="title" reference="form.title" placeholder={translate("resources.post.category")} alwaysOn/> */}
      {/* <SelectArrayInput source="entry" choices={foorm} alwaysOn/> */}
      {/* <SearchInput  reference="trackingCode" source="trackingCode" placeholder={'کد رهگیری'}  alwaysOn/> */}
      {/* <DateInput   source={"Search"} reference={"form.title." + translate("lan")} placeholder={'عنوان'}  alwaysOn/> */}
      {/* <ReferenceArrayField tags="form" source="form.title" alwaysOn /> */}
    {/* <ReferenceInput  choices={foorm} alwaysOn>
      <SelectInput/>
    </ReferenceInput> */}

    </Filter>
  );
};


const list = (props) => {
  const t = useTranslate();
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));


    return (

    <>
    <List  {...props} filters={<PostFilter/>} pagination={<PostPagination/>}>
        {isSmall ? (<SimpleList
            primaryText={record => <div>
                <div className={"d-dfgf"}>
                    {/*{JSON.stringify(record)}*/}
                    {record?.trackingCode && <TextField source="trackingCode" label={t("resources.entry.trackingCode")}/>}
                    <div>
                    <Chip
                        className={record.status}
                        label={record?.form?.title.fa}
                    />
                        <div className='theDate'>
                            <div>
                                {t("resources.post.createdAt") + ": " + `${dateFormat(record.createdAt)}`}
                            </div>
                            <div>
                                {t("resources.post.updatedAt") + ": " + `${dateFormat(record.updatedAt)}`}
                            </div>

                            {record.views && <div>
                                {t("resources.post.viewsCount") + ": " + `${(record.views.length)}`}
                            </div>}
                        </div>
                    </div>
                    {/*{record?.form?.title?.fa && */}
                    {/*<TextField source={"form.title." + t("lan")} label={t("resources.form.title")}/>*/}

                  {/*<span className={'gap-10'}><Chip*/}
                          {/*className={record.status}*/}
                          {/*label={t('pos.OrderStatus.' + record.status)}*/}
                      {/*/>*/}
                      {/*<Chip*/}
                          {/*className={record.paymentStatus}*/}
                          {/*label={t('pos.OrderPaymentStatus.' + record.paymentStatus)}*/}
                      {/*/></span>*/}
                    {/*<span>#{record?.orderNumber}</span>*/}
                </div>

            </div>}
            // tertiaryText={record =>   <div className='theDate'>
            //     <div>
            //         {t("resources.post.createdAt") + ": " + `${dateFormat(record.createdAt)}`}
            //     </div>
            //     <div>
            //         {t("resources.post.updatedAt") + ": " + `${dateFormat(record.updatedAt)}`}
            //     </div>
            //
            //     {record.views && <div>
            //         {t("resources.post.viewsCount") + ": " + `${(record.views.length)}`}
            //     </div>}
            // </div>}
            secondaryText={record => <div className="ph">
                <div className={'d-flex'}>

                    <div  className={'d-flex-child'}>
                        <Link
                            className={"link-with-icon"}
                            rel="noopener noreferrer"
                            to={'/entry/' + record._id+'/show'}>
                            <VisibilityIcon/>
                            <span className={'ml-2 mr-2'}>
                                        {t('resources.entry.show')}
                                    </span>
                        </Link>
                    </div>


                    {/*<div>*/}
                    {/*<DeleteButton/>*/}
                    {/*</div>*/}
                </div>

            </div>}

            linkType={false}
        />) : (<Datagrid optimized>
        <TextField source="trackingCode" label={t("resources.entry.trackingCode")}/>

        <TextField source={"form.title." + t("lan")} label={t("resources.form.title")}/>


        <FunctionField label={t("resources.post.date")}
                       render={record => (
                         <div className='theDate'>
                           <div>
                             {t("resources.post.createdAt") + ": " + `${dateFormat(record.createdAt)}`}
                           </div>
                           <div>
                             {t("resources.post.updatedAt") + ": " + `${dateFormat(record.updatedAt)}`}
                           </div>

                           {record.views && <div>
                             {t("resources.post.viewsCount") + ": " + `${(record.views.length)}`}
                           </div>}
                         </div>
                       )}/>
        <FunctionField label={t("resources.post.actions")}
                       render={record => (<div>
                         <div>
                           <ShowButton/>
                         </div>
                         <div>
                           <EditButton/>
                         </div>
                         <div>
                           <DeleteButton/>
                         </div>
                       </div>)}/>
      </Datagrid>)}
    </List>
    </>
  );
};

export default React.memo(list);