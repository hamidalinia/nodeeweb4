import {Edit, useGame, useTranslate} from "react-admin";
import {BASE_URL} from "@/functions/API";
import {dateFormat} from "@/functions";
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
import {Val} from "@/Utils";
import React from "react";
import Game from "./gameForm";
import {useEditController,TextInput} from "react-admin";

export const gameEdit = (props) => {
    console.log('props', props);
    const translate = useTranslate();
    const {id} = props;
    const {record, save, isLoading} = useEditController({resource: 'game', id});
    
    return (
        <Edit {...props} redirect={false} mutationMode={'pessimistic'}>
            <Game record={record} redirect={false}>
                <TextInput source={"_id"} label={translate("_id")}
                           className={"width100 mb-20"} fullWidth disabled/>
            </Game>
        </Edit>
    );
}

export default gameEdit;
