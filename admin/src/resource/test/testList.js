import {
    Datagrid,
    DeleteButton,
    EditButton,
    Filter,
    FunctionField,
    Pagination,
    ReferenceInput,
    SearchInput,
    SelectInput,
    TextField,
    useTranslate
} from "react-admin";

import API, {BASE_URL} from "@/functions/API";
import {dateFormat} from "@/functions";
import {
    CatRefField,
    EditOptions,
    FileChips,
    List,
    ReactAdminJalaliDateInput,
    ShowDescription,
    showFiles,
    ShowLink,
    ShowOptions,
    ShowPictures,
    SimpleForm,
    SimpleImageField,
    UploaderField
} from "@/components";
import {Button} from "@mui/material";
import React from "react";

const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />;


const postRowStyle = (record, index) => {

    return ({
        backgroundColor: "#ee811d"
    });
};

const TestFilter = (props) => {
    const translate = useTranslate();
    return (
        <Filter {...props}>
            <SearchInput source="Search" placeholder={translate("resources.test.search")} alwaysOn/>

            <ReferenceInput
                label={translate("resources.test.category")}
                source="category"
                reference="testCategory" // Replace with the actual name of your TestCategory resource
                alwaysOn
            >
                <SelectInput label={translate("resources.test.category")} optionText={"name." + translate("lan")}
                             optionValue="_id"/>
            </ReferenceInput>
        </Filter>
    );
};


const list = (props) => {
    // console.log("prooooooooo",props);
    const translate = useTranslate();
    // rowStyle={postRowStyle}
    return (

        <List  {...props} filters={<TestFilter/>} pagination={<PostPagination/>}>
            <Datagrid optimized>

                <TextField source={"title." + translate('lan')} label={translate("resources.test.title")}/>
                {/*<TextField source={"title"} label={translate("resources.test.title")}/>*/}
                <TextField source="sort" label={translate("resources.test.sort")}/>
                <TextField source="slug" label={translate("resources.test.slug")}/>

                <FunctionField label={translate("resources.test.dependency")}
                               render={record => (
                                   <div className='theDate'>
                                       <a href={'/#/test/' + record?.dependency?._id}>{record?.dependency?.title?.fa}</a>
                                   </div>
                               )}/>
                <FunctionField label={translate("resources.test.category")}
                               render={record => (
                                   <div className='theDate'>
                                       <a href={'/#/testCategory/' + record?.category?._id}>{record?.category?.name?.fa}</a>
                                   </div>
                               )}/>

                <FunctionField label={translate("resources.test.date")}
                               render={record => (
                                   <div className='theDate'>
                                       <div>
                                           {translate("resources.test.createdAt") + ": " + `${dateFormat(record.createdAt)}`}
                                       </div>
                                       <div>
                                           {translate("resources.test.updatedAt") + ": " + `${dateFormat(record.updatedAt)}`}
                                       </div>

                                       {record.view && <div>
                                           {translate("resources.test.viewsCount") + ": " + `${(record.view)}`}
                                       </div>}
                                   </div>
                               )}/>
                <FunctionField label={translate("resources.test.actions")}
                               render={record => (<div>
                                   {/*<div>*/}
                                       {/*/!*+"?token="+localStorage.getItem('token')*!/*/}
                                       {/*<a target={"_blank"}*/}
                                          {/*href={"/admin/#/builder" + "/test/" + record._id}>{translate("resources.test.pagebuilder")}</a>*/}
                                   {/*</div>*/}
                                   <div>
                                       <EditButton/>
                                   </div>
                                   <div>
                                       <Button
                                           color="primary"
                                           size="small"
                                           onClick={() => {
                                               // console.log('data', record._id);
                                               API.post("/test/copy/" + record._id, null)
                                                   .then(({data = {}}) => {
                                                       // console.log('data', data._id);
                                                       // props.history.push("/post/" + data._id);
                                                       alert('done');
                                                   })
                                                   .catch((err) => {
                                                       console.log("error", err);
                                                   });
                                           }}>
                                           {translate("resources.test.copy")}
                                       </Button>
                                   </div>
                                   <div>
                                       <DeleteButton/>
                                   </div>
                               </div>)}/>
            </Datagrid>
        </List>
    );
};

export default list;
