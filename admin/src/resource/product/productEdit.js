import {
    Edit,
    FunctionField,
    RefreshButton,
    SimpleForm,
    TextInput,
    Toolbar,
    useEditController,
    useNotify,
    useTranslate
} from "react-admin";
import API, {ShopURL} from "@/functions/API";

import CardActions from "@mui/material/CardActions";
import {Button} from '@mui/material';
import React, {useState,useEffect} from "react";
import ReactJson from 'react-json-view';

import Form from "./productForm";


const JsonEditorInput = ({value, onChange, ...props}) => {
    const handleChange = (newValue) => {
        // This will be triggered when the JSON is edited in the editor
        onChange(newValue);
    };

    return (

        <ReactJson
            style={{width: '100%'}}
            fullWidth
            src={value || {}}
            onAdd={(add) => handleChange(add.updated_src)}
            onEdit={(edit) => handleChange(edit.updated_src)}
            onDelete={(del) => handleChange(del.updated_src)}
            displayDataTypes={false} // Optional: Hide data type info
            displayObjectSize={false} // Optional: Hide object size
            theme="monokai" // Optional: Use a theme like monokai or others
            collapsed={false} // Optional: Make it collapsible
        />

    );
};
const PostEditActions = (props) => {
    const translate = useTranslate();

    let {basePath, data, resource, setState} = props
    return (
        <CardActions>
            {/*<ShowButton record={data}/>*/}
            <RefreshButton/>
            {/*<TelegramPushPostButton record={data}/>*/}
            <Button record={data} onClick={(e) => {
                console.log("e", e)
                setState('general');
            }}>{translate("resources.product.generalSettings")}</Button>
            <Button record={data} onClick={(e) => {
                console.log("e", e)
                setState('code');
            }}>{translate("resources.product.data")}</Button>

        </CardActions>
    )
}

const PostEditToolbar = (props) => {
    let {data, _id} = props
    const notify = useNotify();
    const {record, save, isLoading} = useEditController({resource: 'product', _id});

    return (
        <Toolbar>
            <Button alwaysEnable onClick={(e) => {
                console.log("data is:", data, _id)
                API.put("/product/" + _id, JSON.stringify({...record, data: data}))
                    .then(({data = {}}) => {
                        notify("saved");
                        if (data) {
                            // values = [];
                            // valuess = [];
                        }
                    })
                    .catch((err) => {
                        console.log("error", err);
                    });
            }}>Save</Button>

        </Toolbar>
    )
};
const edit = (props) => {
    // console.clear()
    const transform = (data, {previousData}) => {
        console.log("transform={transform}", data, {previousData})

        return ({
            ...data,
            // firstCategory: "61d58e37d931414fd78c7fb7"
        });
    }
    const translate = useTranslate();
    const {id} = props;
    const {record, save, isLoading} = useEditController({resource: 'product', id});

// return JSON.stringify(record)
    const [state, setState] = useState('general');
    const [jsonValue, setJsonValue] = useState(record?.data || {});

    useEffect(() => {
        if (record?.data && Object.keys(record.data).length > 0) {
            setJsonValue(record.data);
        }
    }, [record?.data]);


    console.log("jsonValue",jsonValue)
    console.log("record?.data",record?.data)
    const handleJsonChange = (newJsonValue) => {
        setJsonValue(newJsonValue);
    };

    // console.log("propsprops", props)
    // transform={transform}
    if (state != 'general') {

        return (
            <Edit actions={<PostEditActions setState={setState}/>}  {...props} redirect={false}
                  mutationMode={'pessimistic'}

            >
                <SimpleForm toolbar={<PostEditToolbar data={jsonValue} _id={record?._id}/>}>
                    {/*<TextField label="data" source="data"/>*/}
                    <FunctionField label={translate("resources.product.data")}
                                   render={record => {
                                       return JSON.stringify(record?.data)
                                   }}/>

                    <JsonEditorInput
                        fullWidth
                        value={jsonValue}
                        onChange={handleJsonChange}
                        label="data"
                    />

                </SimpleForm>
            </Edit>
        );
    }
    return (
        <Edit actions={<PostEditActions setState={setState}/>}  {...props} redirect={false}
              mutationMode={'pessimistic'}

        >
            <Form record={record} redirect={false}>
                <TextInput source={"_id"} label={translate("_id")}
                           className={"width100 mb-20"} fullWidth disabled/>

            </Form>
        </Edit>
    );
}


export default edit;
