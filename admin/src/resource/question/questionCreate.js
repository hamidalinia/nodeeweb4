import {
  Create,
  DeleteButton,
  SaveButton,
  SelectInput,
  TextInput,
  Toolbar,
  useQuestion,
  useRecordContext,
  useTranslate
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
import { makeStyles } from "@mui/styles";
import { Val } from "@/Utils";
import Question from "./questionForm";

import React from "react";


const create = (props) => (
  <Create {...props}>
    <Question>


    </Question>
  </Create>
);

export default create;
