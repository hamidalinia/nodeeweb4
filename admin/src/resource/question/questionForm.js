import {
    DeleteButton,
    SaveButton,
    SelectInput,
    showNotification,
    ReferenceArrayInput,
    SimpleFormIterator,
    TextInput,
    Toolbar,
    SelectArrayInput,
    NumberInput,
    useQuestion,
    useNotify,
    ArrayInput,
    BooleanInput,
    useRedirect,
    useTranslate
} from "react-admin";
import API from "@/functions/API";
import {dateFormat} from "@/functions";
import {
    CatRefField,
    Combinations,
    EditOptions,
    FileChips,
    QuestionTabs,
    List,
    PageBuilder,
    ProductType,
    ShowDescription,
    showFiles,
    ShowLink,
    ShowOptions,
    ShowPictures,
    SimpleForm,
    SimpleImageField,
    UploaderField,
} from "@/components";
import {Val} from "@/Utils";
import React from "react";
import {RichTextInput} from "ra-input-rich-text";

// import { RichTextInput } from 'ra-input-rich-text';
// import {ImportButton} from "react-admin-import-csv";
let combs = [];
let _The_ID = null;

function cartesian(args) {
    let r = [], max = args.length - 1;

    function helper(arr, i) {
        for (let j = 0, l = args[i].length; j < l; j++) {
            let a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i === max)
                r.push(a);
            else
                helper(a, i + 1);
        }
    }

    helper([], 0);
    return r;
}



const Question = ({children, ...props}) => {
    // console.log("vprops", props);
    const {record} = props;
    console.log("props", props)

    // if (!record) return null;

    const translate = useTranslate();
    const notify = useNotify();
    if (record && record._id) {
        console.log("_id set")
        _The_ID = record._id;
    }
    // const {reset} = useQuestionContext();
    const redirect = useRedirect();
    const transquestion = (data, {previousData}) => {
        console.log("transquestion={transquestion}", data, {previousData})

        return ({
            ...data,
            // firstCategory: "61d58e37d931414fd78c7fb7"
        });
    }
    // console.log("record", record);
    // valuess['photos'] = props.record.photos || [];
    // if(valuess['options']!=record.options){
    //   record.options=valuess['options'];
    // }
    // console.log('productQuestion...',record);
    const totals = 0;


    return (
        <SimpleForm {...props}
                    // toolbar={<CustomToolbar record={props.record}/>}
                    // onSubmit={v => save(v)}
        >
            {/*<TabbedDatagrid/>*/}
            <ReferenceArrayInput source="questionCategory" reference="questionCategory" label={translate("resources.question.questionCategory")} fullWidth>
                <SelectArrayInput optionText={'name.fa'} optionValue={'_id'} fullWidth label={translate("resources.question.questionCategory")} />

            </ReferenceArrayInput>
            <TextInput source={"title."+translate("lan")} fullWidth label={translate("resources.question.title")}
                       className={"width100 mb-20"}
                       validate={Val.req}/>
            <ArrayInput source="options" label={translate("resources.question.options")} fullWidth>
                <SimpleFormIterator inline>
                    <TextInput source="answer" label={translate("resources.question.answer")} helperText={false} fullWidth/>
                    <BooleanInput source="isAnswer" label={translate("resources.question.isAnswer")}  helperText={false} fullWidth/>
                </SimpleFormIterator>
            </ArrayInput>
            <NumberInput source={"score"} fullWidth label={translate("resources.question.score")}
                       className={"width100 mb-20"}/>
            <SelectInput
                label={translate("resources.question.status")}
                defaultValue={"processing"}
                source="status"
                choices={[
                    {id: "published", name: translate("resources.question.published")},
                    {id: "processing", name: translate("resources.question.processing")},
                    {id: "deleted", name: translate("resources.question.deleted")}
                ]}
            />

            {children}
        </SimpleForm>);
};


export default Question;
