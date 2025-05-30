import {
  Create,
  Datagrid,
  Edit,
  EditButton,
  Filter,
  FunctionField,
  NumberInput,
  Pagination,
  ReferenceField,
  ReferenceInput,
  ResourceContextProvider,
  SearchInput,
  SelectInput,
  ShowButton,
  useRedirect,
  TextField,
  TextInput,
  useResourceContext,
  useTranslate,
  RadioButtonGroupInput 
} from "react-admin";
import React, { Fragment } from "react";
import { CustomResetViewsButton, List, SimpleForm } from "@/components";
import useStyles from "@/styles";
import { Val } from "@/Utils";
import API, { BASE_URL } from "@/functions/API";
import { Chip } from "@mui/material";
import { RichTextInput } from "ra-input-rich-text";

const Form = ({ children, ...rest }) => {
  const cls = useStyles();
  const translate = useTranslate();
  const redirect = useRedirect();
  const choices = [
    { id: 'increase', name: translate("resources.category.increase") },
    { id: 'decrease', name: translate("resources.category.decrease") }
];
  function saveForm(values) {
    if (values.parent == "") {
      values.parent=null;
    }
    console.log("save", values, values._id);
    API.put("/forumTopic/"+values._id, JSON.stringify({ ...values }))
      .then(({ data = {} }) => {
        // showNotification(translate('product.created'));
        // console.clear()
        console.log("data", data);
        if (data?._id) {
          redirect('/forumTopic'+data?._id);
          // window.location.href = "/#/productCategory/" + data._id;
          // window.location.reload();
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  }

  return (
    <SimpleForm {...rest}
                onSubmit={v => saveForm(v)}
    >
      {children}
      <TextInput source={"_id"} label={translate("_id")}
                 className={"width100 mb-20"} fullWidth disabled/>
      <TextInput
        source={"name." + translate("lan")}
        label={translate("resources.category.name")}
        validate={Val.req}
        formClassName={cls.f2}
        fullWidth
      />
      <TextInput
        source="slug"
        label={translate("resources.category.slug")}
        validate={Val.req}
        formClassName={cls.f2}
        fullWidth
      />

    </SimpleForm>
  );
};



const edit = (props) => (
  <Edit {...props}>
    <Form/>
  </Edit>
);



export default edit;
