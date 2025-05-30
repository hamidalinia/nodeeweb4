import {
    ArrayInput,
    BooleanInput,
    DeleteButton,
    FormDataConsumer,
    NumberInput,
    ReferenceArrayInput,
    SaveButton,
    SelectArrayInput,
    SelectInput,
    showNotification,
    SimpleFormIterator,
    TextInput,
    Toolbar,
    useNotify,
    useRedirect,
    useTranslate
} from "react-admin";
import _get from 'lodash/get';
import {useForm, useFormContext,} from 'react-hook-form';
import API, {ShopURL} from "@/functions/API";
import {dateFormat} from "@/functions";
import {
    AtrRefField,
    CatRefField,
    Combinations,
    EditOptions,
    FileChips,
    FormTabs,
    List,
    ProductType,
    ShowDescription,
    showFiles,
    ShowLink,
    ShowOptions,
    ShowPictures,
    SimpleForm,
    SimpleImageField,
    StockStatus,
    UploaderField
} from "@/components";
import {Val} from "@/Utils";
import React, {useState} from "react";
import Fab from '@mui/material/Fab';
import AndroidIcon from '@mui/icons-material/Android';
import {RichTextInput} from "ra-input-rich-text";
import {GPTButton, LightTooltip, StyledMenu} from '@/components/ChatGPTButtonStyle';
// import { RichTextInput } from 'ra-input-rich-text';
import CircularProgress from '@mui/material/CircularProgress';
import {useSelector} from 'react-redux';

// import {ImportButton} from "react-admin-import-csv";
let combs = [];

let valuess = {"photos": [], "files": [], thumbnail: "", combinations: []};


function setPhotos(values) {

    // let {values} = useFormState();
    console.log("setPhotos", values);
    valuess["photos"] = values;
    // setV(!v);
    // this.forceUpdate();
}

function returnToHome(values) {
    console.log("returnToHome", values);
    if (values["firstCategory"])
        valuess["firstCategory"] = values["firstCategory"];
    if (values["secondCategory"])
        valuess["secondCategory"] = values["secondCategory"];
    if (values["thirdCategory"])
        valuess["thirdCategory"] = values["thirdCategory"];
}

function onCreateCombinations(options) {
    // console.log('onCreateCombinations', options);
    let combCount = 1;
    let combinationsTemp = [];
    let combinations = [];
    let counter = 0;
    options.forEach((opt, key) => {
        let optemp = {};
        let theVals = [];
        opt.values.forEach((val, key2) => {
            theVals.push({[opt.name]: val.name});

        });
        combinationsTemp.push(theVals);

    });
    // console.log('combinationsTemp', combinationsTemp);
    let ttt = cartesian(combinationsTemp);
    // console.log('ttt', ttt);

    ttt.forEach((tt, key) => {
        let obj = {};
        tt.forEach((ther, key) => {
            // obj[key]=ther;
            Object.assign(obj, ther);
        });
        combinations.push({
            id: key,
            options: obj,
            in_stock: false,
            price: null,
            salePrice: null,
            normalBarcode: null,
            quantity: 0
        });

    });
    // (id, path, rowRecord) => form.change('combinations', combinations)
    // console.log('combinations', combinations);
    combs = combinations;
    return combinations;

}

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

function returnCatsValues() {
    console.log("returnCatsValues", values);
    return ({
        firstCategory: valuess["firstCategory"],
        secondCategory: valuess["secondCategory"],
        thirdCategory: valuess["thirdCategory"]
    });
}

function thel(values) {
    console.log("changechangechange", values);
    return new Promise(resolve => {


        valuess["photos"] = values;
        resolve(values);
    }, reject => {
        reject(null);
    });

    // console.log(values);

}

function theP(values) {
    console.log("change thumbnail field", values);
    valuess["thumbnail"] = values;

}

function thelF(values) {
    // console.log('change files field', values);

    valuess["files"].push({
        url: values
    });
    // console.log(values);

}


function CombUpdater(datas) {
    console.log("datas", datas);
    valuess["combinations"] = datas;
}

function OptsUpdater(datas) {
    console.log("datas", datas);
    valuess["options"] = datas;
}


const CustomToolbar = props => {
    const notify = useNotify();
    const {reset} = useFormContext();
    const redirect = useRedirect();

    const transform = (data, {previousData}) => {

        console.log("transformProduct()...");

        if (valuess.firstCategory) {
            // console.log('let us set firstCategory');
            values.firstCategory = valuess.firstCategory;

        }
        if (valuess.secondCategory) {
            // console.log('let us set secondCategory');

            values.secondCategory = valuess.secondCategory;

        }
        if (valuess.thirdCategory) {
            // console.log('let us set thirdCategory');

            values.thirdCategory = valuess.thirdCategory;

        }
        if (valuess.thumbnail) {
            values.thumbnail = valuess.thumbnail;

        }
        console.log("values", values);
        return values;
    };
    let {record} = props;

//     function save(e) {
//         
//         let values = record;
//         console.log('save function ()...');
//         // const translate = useTranslate();
// 
// // console.log('save');
//         // let {values} = useFormState();
// 
// //     console.log('product values', values);
// //     console.log('product valuess', valuess);
//         // dataProvider.createOne(values).then(()=>{
//         //     console.log('hell yeah');
//         // })
//         // return;
//         // values={...valuess};
//         if (valuess.firstCategory) {
//             // console.log('let us set firstCategory');
//             values.firstCategory = valuess.firstCategory;
//
//         }
//         if (valuess.secondCategory) {
//             // console.log('let us set secondCategory');
//
//             values.secondCategory = valuess.secondCategory;
//
//         }
//         if (valuess.thirdCategory) {
//             // console.log('let us set thirdCategory');
//
//             values.thirdCategory = valuess.thirdCategory;
//
//         }
//         if (valuess.thumbnail) {
//             values.thumbnail = valuess.thumbnail;
//
//         }
//         // if (valuess.photos) {
//         //   values.photos = valuess.photos;
//         //   // valuess['photos']
//         // }
//         // if (valuess.combinations) {
//         //   values.combinations = valuess.combinations;
//         //   // valuess['photos']
//         // }
//
//         console.log("values after edit: ", values);
//         return;
//         if (values._id) {
//             // delete values.photos;
//             delete values.questions;
//             delete values.nextproduct;
//             delete values.category;
//             delete values.catChoosed;
//             delete values.files;
//             console.log("last values (edit): ", values);
//
//             API.put("/product/" + values._id, JSON.stringify({...values}))
//                 .then(({data = {}}) => {
//                     // const refresh = useRefresh();
//                     // refresh();
//                     // alert('it is ok');
//                     redirect(false);
//                     // showNotification(translate('product.updated'));
//                     // window.location.reload();
//                     if (data.success) {
//                         values = [];
//                         valuess = [];
//                     }
//                 })
//                 .catch((err) => {
//                     console.log("error", err);
//                 });
//         }
//         else {
//             if (valuess.photos) {
//                 values.photos = valuess.photos;
//             }
//             if (valuess.files) {
//                 values.files = valuess.files;
//             }
//             API.post("/product/", JSON.stringify({...values}))
//                 .then(({data = {}}) => {
//                     // showNotification(translate('product.created'));
//                     // console.clear()
//                     console.log("data", data);
//                     if (data._id) {
//                         // window.location.reload()
//                         window.location.href = "/#/product/" + data._id;
//                         // values = [];
//                         // valuess = [];
//                     }
//                 })
//                 .catch((err) => {
//                     console.log("error", err);
//                 });
//         }
//     }

    return (
        <Toolbar {...props} className={"dfghjk"}>
            <SaveButton alwaysEnable
                        redirect={false}
                // onClick={(e) => save(e)}
                        edit={"edit"}
                        mutationMode={"pessimistic"}
                        transform={transform}
            />
            <DeleteButton mutationMode="pessimistic"/>
        </Toolbar>
    );
};

const Form = ({children, ...props}) => {


    const [clientMode, setClientMode] = useState(localStorage.getItem('client_mode')); // Default mode is 'advanced'
    const isSimple = clientMode == 'simple'
    const themeData = useSelector((st) => st.themeData);
    const factore_shop_name = _get(themeData, 'factore_shop_name', []) || [];
    let _The_ID = '';
    let DublicateProduct = false;
    const {record} = props;
//   const { data, total, isLoading, error } = useGetList('product',
//   { 
//     pagination: { page: 1, perPage: 10000 }
// });
    const translate = useTranslate();
    const notify = useNotify();
    if (record && record._id) {
        _The_ID = record._id;
    }
    if (record && record.photos) {
        valuess["photos"] = record.photos;
    }
    if (record && record.thumbnail) {
        valuess["thumbnail"] = record.thumbnail;
    }
    // const {reset} = useFormContext();
    const redirect = useRedirect();
    const transform = (data, {previousData}) => {
        return ({
            ...data
            // firstCategory: "61d58e37d931414fd78c7fb7"
        });
    };

    function save(values) {

        if (valuess.firstCategory) {
            values.firstCategory = valuess.firstCategory;
        }
        if (valuess.secondCategory) {
            values.secondCategory = valuess.secondCategory;
        }
        if (valuess.thirdCategory) {
            values.thirdCategory = valuess.thirdCategory;
        }
        if (valuess.thumbnail) {
            values.thumbnail = valuess.thumbnail;
        }
        if (valuess.photos) {
            values.photos = valuess.photos;
        }

        if (valuess.requireWarranty) {
            values.requireWarranty = valuess.requireWarranty;
        }

        if (_The_ID.length > 0) {
            // delete values.photos;
            delete values.questions;
            delete values.nextproduct;
            delete values.category;
            delete values.catChoosed;
            delete values.files;
            API.put("/product/" + _The_ID, JSON.stringify({...values}))
                .then(({data = {}}) => {
                    notify("saved");
                    if (data) {
                        values = [];
                        valuess = [];
                    }
                })
                .catch((err) => {
                    console.log("error", err);
                });
        }
        else {
            if (valuess.photos) {
                values.photos = valuess.photos;
            }
            if (valuess.files) {
                values.files = valuess.files;
            }

            if (!values.status) {
                values.status = 'draft';
            }
            if (valuess.requireWarranty) {
                values.requireWarranty = valuess.requireWarranty;
            }
            API.post("/product/", JSON.stringify({...values}))
                .then(({data = {}}) => {
                    if (data) {
                        _The_ID = '';
                        redirect('/product');
                    }
                })
                .catch((err) => {
                    console.log("error", err);
                });
        }

    }

    let ST = StockStatus() || [];
    ST.map(item => {
        item.id = item.value;
        item.name = item.label;
        // delete item.value;
        // delete item.label;
        return item;
    });
    console.log(ST);
    const totals = 0;

    const [waitings1, setWaitings1] = useState(false);
    const [waitings2, setWaitings2] = useState(false);
    const [waitings3, setWaitings3] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const {setValue, getValues} = useForm({
        defaultValues: {
            slug: props?.record?.slug,
            mainWord: props?.record?.title?.fa,
            chatGPTanswerForExcerpt: props?.record?.excerpt?.fa,
            chatGPTanswerForDescription: props?.record?.description?.fa,
            chatGPTanswerForMetadescription: props?.record?.metadescription?.fa,
        },
    });

    const handleChange = (t, value) => {
        setValue(t, value);
    };

    const chatGptHandler = async (e, expr) => {
        // e.preventDefault();
        // handleClose();
        console.log("props.record?.title.fa", props.record?.title.fa)
        try {
            let lang = localStorage.getItem('RaStore.locale');
            if(!lang || (lang && !lang[0]))
                lang=['fa']
            let question;
            let slug = getValues('slug')
            let product_url_to_buy = ShopURL + 'product/' + getValues('slug')
            // const expr = e.target.id;
            console.log("expr", expr)
            switch (expr) {
                case 'excerpt':
                    question = getValues('mainWord')
                        ? `tell me about ${getValues('mainWord').trim()} in 100 words in ${
                            lang.includes('fa') ? 'persian' : 'english' } and only return html ul li (at last 5 items) in your response without mention anything`
                        : props.record?.title.fa
                            ? `tell me about ${props.record.title.fa} in 100 words in ${
                                lang.includes('fa') ? 'persian' : 'english' } and only return html ul li (at last 5 items) in your response without mention anything`
                            : null;
                    break;
                case 'metadescription':
                    question = getValues('mainWord')
                        ? `give me a meta description for keyword ${getValues(
                            'mainWord'
                        ).trim()} in 60 words in ${
                            lang.includes('fa') ? 'persian' : 'english'
                            }`
                        : props.record?.title?.fa
                            ? `give me a meta description for keyword ${
                                props.record.title?.fa
                                } in 60 words in ${lang.includes('fa') ? 'persian' : 'english'}`
                            : null;
                    break;
                case 'description':
                    question = getValues('mainWord')
                        ? `think you are smart and professional article writer for seo, write me about keyword ${getValues('mainWord').trim()} in 1000 words in order to introduce it to the customer for sale purposes and get view from google side (without customer comment parts) in ${
                            lang.includes('fa') ? 'persian' : 'english'} and only return HTML code with good practice of H tags (without any H1) and link tags for seo  and do not mention anything at end of your response and do not leave me anything or any part so you need me fill that, also product link to buy is: ${product_url_to_buy} and this website name is: ${factore_shop_name}.`
                        : props.record?.title.fa
                            ? `think you are smart and professional article writer for seo, write me about keyword ${
                                props.record.title.fa
                                } in 1000 words in order to introduce it to the customer for sale purposes and get view from google side (without customer comment parts) in ${
                                lang.includes('fa') ? 'persian' : 'english'
                                } and only return HTML code the body part only with good practice of H tags (without any H1) and link tags for seo and do not mention anything at end of your response and do not leave me anything or any part so you need me fill that, also product link to buy is: ${product_url_to_buy} and this website name is: ${factore_shop_name}.`
                            : null;
                    break;
                default:
                    console.log(`Sorry, There is no question`);
            }

            if (!question) {
                notify('Please enter a title');
                return;
            }

            var myHeaders = new Headers();

            myHeaders.append(
                'content-type',
                'application/x-www-form-urlencoded; charset=UTF-8'
            );
            // var raw = `content=${question}`;
            var raw = ``;

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                // body: raw,
                redirect: 'follow',
            };
            if (expr == 'metadescription') {
                setWaitings1(true)
            }
            if (expr == 'excerpt') {
                setWaitings2(true)
            }
            if (expr == 'description') {
                setWaitings3(true)
            }
            // setWaitings(true);
            console.log("ShopURL", ShopURL)
            const data = await fetch(
                `${ShopURL}customer/gateway/ai/chat?q=${question}`,
                requestOptions
            );

            const response = await data.json();
            let formatedData = await response?.candidates[0].content?.parts[0]?.text;

            if (expr == 'metadescription') {
                setWaitings1(false)
            }
            if (expr == 'excerpt') {
                setWaitings2(false)
            }
            if (expr == 'description') {
                setWaitings3(false)
            }
            formatedData = formatedData?.replace("```html", "")
            formatedData = formatedData?.replace("```", "")
            switch (expr) {
                case 'excerpt':
                    handleChange('chatGPTanswerForExcerpt', formatedData);
                    break;
                case 'metadescription':
                    handleChange('chatGPTanswerForMetadescription', formatedData);
                    break;
                case 'description':
                    handleChange('chatGPTanswerForDescription', formatedData);
                    break;

                default:
                    console.log(`there is no response.`);
            }
        } catch (err) {
            console.log('err', err);
        }
    };
    const ControlledTextInput = ({value, ...props}) => {
        const {setValue} = useFormContext();

        React.useEffect(() => {
            console.log("props.source", props.source, value)
            setValue(props.source, value);
            //eslint-disable-next-line
        }, [value]);

        return <TextInput {...props} />;
    };

    const ControlledRichTextInput = ({value, ...props}) => {
        const {setValue} = useFormContext();

        React.useEffect(() => {
            setValue(props.source, value);
            //eslint-disable-next-line
        }, [value]);

        return <RichTextInput {...props} />;
    };

    console.log("Form props111", props);
    console.log("_The_ID111", _The_ID);

    return (

        <SimpleForm

            {...props}
            transform={transform}
            className={"this-is-product"}
            onSubmit={v => save(v)}
            toolbar={<CustomToolbar record={props.record}/>}
        >
            {children}
            {!isSimple && (
                <>
                    <TextInput source={"title." + translate("lan")} label={translate("resources.product.title")}
                               className={"width100 mb-20"} validate={Val.req} fullWidth/>


                    <ControlledTextInput
                        fullWidth
                        multiline
                        className={"width100 mb-20 ltr"}
                        source={'slug'}
                        validate={Val.req}
                        value={getValues('slug')}
                        onChange={(e) => {
                            setValue("slug", e?.target?.value)
                        }}
                        label={translate('resources.product.slug')}
                    />
                    <TextInput fullWidth source={"metatitle." + translate("lan")}
                               label={translate("resources.product.metatitle")}/>

                    <div className={'gpt-button-wrap-fab'}>
                        <ControlledTextInput
                            fullWidth
                            multiline
                            source={'metadescription.' + translate('lan')}
                            value={getValues('chatGPTanswerForMetadescription')}
                            onChange={(e) => {
                                setValue("chatGPTanswerForMetadescription", e?.target?.value)
                                console.log("e", e?.target?.value)
                            }}
                            label={translate('resources.product.metadescription')}
                        />
                        {waitings1 ? (
                            <CircularProgress className={'gpt-btn-circular'}/>
                        ) : (
                            <LightTooltip title="ASK CHATGPT" placement="top" arrow>
                                <Fab
                                    disabled={waitings1}
                                    // id="metadescription"
                                    // onClick={(e) => chatGptHandler(e)}
                                    onClick={(e) => chatGptHandler(e, 'metadescription')}
                                    size="small"
                                    className={'gpt-button-fab'}>
                                    <AndroidIcon
                                        id="metadescription"

                                        style={{color: '#27282c'}}
                                    />
                                </Fab>
                            </LightTooltip>
                        )}
                    </div>
                    <div className={'gpt-button-wrap-fab'}>
                        <ControlledTextInput
                            fullWidth
                            multiline
                            source={'excerpt.' + translate('lan')}
                            value={getValues('chatGPTanswerForExcerpt')}
                            onChange={(e) => {
                                setValue("chatGPTanswerForExcerpt", e?.target?.value)
                                console.log("e", e?.target?.value)
                            }}
                            label={translate('resources.product.excerpt')}
                        />
                        {waitings2 ? (
                            <CircularProgress className={'gpt-btn-circular'}/>
                        ) : (
                            <LightTooltip title="ASK CHATGPT" placement="top" arrow>
                                <Fab
                                    disabled={waitings2}
                                    // id="excerpt"
                                    onClick={(e) => chatGptHandler(e, 'excerpt')}

                                    // onClick={(e) => chatGptHandler(e)}
                                    size="small"
                                    className={'gpt-button-fab'}>
                                    <AndroidIcon
                                        id="excerpt"
                                        style={{color: '#27282c'}}
                                    />
                                </Fab>
                            </LightTooltip>

                        )}
                    </div>
                    <div className={'gpt-button-wrap-fab'}>
                        <ControlledRichTextInput
                            fullWidth
                            source={'description.' + translate('lan')}
                            value={getValues('chatGPTanswerForDescription')}
                            onChange={(e) => {
                                setValue("chatGPTanswerForDescription", e)
                                console.log("e", e)
                            }}
                            label={translate('resources.product.description')}
                        />
                        {waitings3 ? (
                            <CircularProgress className={'gpt-btn-circular'}/>
                        ) : (
                            <LightTooltip title="ASK CHATGPT" placement="top" arrow>
                                <Fab
                                    disabled={waitings3}
                                    // id="description"
                                    onClick={(e) => chatGptHandler(e, 'description')}

                                    // onClick={(e) => chatGptHandler(e)}
                                    size="small"
                                    className={'gpt-button-fab'}>
                                    <AndroidIcon
                                        id="description"
                                        style={{color: '#27282c'}}
                                    />
                                </Fab>
                            </LightTooltip>
                        )}
                    </div>
                    <div className={"mb-20"}/>
                    <BooleanInput source="requireWarranty" label={translate("resources.product.requireWarranty")}/>
                    <TextInput source={"miniTitle." + translate("lan")}
                               label={translate("resources.product.miniTitle")}/>
                    <TextInput source={"extra_button"} label={translate("resources.product.extra_button")}/>

                    {/*<CatRefField label={translate("resources.product.firstCategory")} returnToHome={returnToHome}*/}
                    {/*returnCatsValues={returnCatsValues}*/}
                    {/*// record={record}*/}
                    {/*source="firstCategory"*/}
                    {/*reference="category"*/}
                    {/*url={"/category/f/0/1000"} surl={"/category/s"}/>*/}

                    <ReferenceArrayInput
                        label={translate("resources.product.productCategory")}
                        perPage={100}
                        source="productCategory" reference="productCategory">
                        <SelectArrayInput optionText="name.fa"/>
                    </ReferenceArrayInput>
                    {/*<ReferenceArrayInput*/}
                    {/*label={translate("resources.product.attributes")}*/}
                    {/*source="attributes" reference="attributes">*/}
                    {/*<SelectArrayInput optionText="name.fa" optionValue="_id"/>*/}
                    {/*</ReferenceArrayInput>*/}

                    <AtrRefField label={translate("resources.product.attributes")}
                                 source="attributes"

                                 reference="attributes"
                                 url={"/attributes/0/1000"}
                                 surl={"/attributes"}
                    />


                    <div className={"mb-20"}/>

                    <SelectInput
                        label={translate("resources.product.type")}
                        fullWidth
                        className={"mb-20"}
                        source="type"
                        choices={ProductType()}

                    />


                    <div className={"mb-20"}/>

                    <FormDataConsumer>
                        {({formData = {}, ...rest}) => {
                            console.log("formData.type", formData.type);
                            // {/*// console.log('rendering???',formData);*/}
                            if (formData.type == "variable")
                                return [
                                    <EditOptions source={'options'} record={formData}
                                                 onCreateCombinations={onCreateCombinations}
                                                 formData={formData}
                                                 type={formData.type} updater={OptsUpdater}/>,
                                    <Combinations
                                        record={formData}
                                        theST={ST}
                                        source="combinations" updater={() => {
                                    }}/>];
                            if (formData.type == "normal")
                                return [<div className={"row mb-20"}>
                                    <div className={"col-md-4 col-xs-12 col-sm-12"}>
                                        <SelectInput
                                            fullWidth

                                            label={translate("resources.product.stock")}
                                            // record={scopedFormData}
                                            source={"in_stock"}

                                            choices={ST}
                                            // formClassName={cls.f2}
                                            {...rest}
                                        />
                                    </div>
                                    <div className={"col-md-4"}>
                                        <NumberInput
                                            fullWidth

                                            source={"quantity"}

                                            label={translate("resources.product.quantity")}
                                            // record={scopedFormData}
                                            {...rest}
                                        />
                                    </div>
                                    <div className={"col-md-4"}>
                                        <NumberInput
                                            fullWidth

                                            source={"weight"}

                                            label={translate("resources.product.weight")}
                                            // record={scopedFormData}
                                            {...rest}
                                        />
                                    </div>
                                </div>,
                                    <div className={"row mb-20"}>
                                        <div className={"col-md-6"}>
                                            <TextInput
                                                fullWidth
                                                // record={scopedFormData}

                                                source={"price"}
                                                className={"ltr"}

                                                label={translate("resources.product.price")}
                                                format={v => {
                                                    if (!v) return "";

                                                    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                }}
                                                parse={v => {
                                                    if (!v) return "";

                                                    return v.toString().replace(/,/g, "");

                                                }}
                                                {...rest}
                                            />
                                        </div>
                                        <div className={"col-md-6"}>
                                            <TextInput
                                                fullWidth
                                                // record={scopedFormData}

                                                source={"salePrice"}
                                                className={"ltr"}

                                                label={translate("resources.product.salePrice")}
                                                format={v => {
                                                    if (!v) return "";

                                                    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                }}
                                                parse={v => {
                                                    if (!v) return "";

                                                    return v.toString().replace(/,/g, "");

                                                }}
                                                {...rest}
                                            />
                                        </div>
                                    </div>,
                                    <div className={"row mb-20"} key={2}>
                                        <div className={"col-md-3"}>
                                            <TextInput
                                                fullWidth
                                                // record={scopedFormData}

                                                source={"source"}
                                                className={"ltr"}

                                                label={translate("resources.product.source")}

                                                {...rest}
                                            />
                                        </div>
                                        <div className={"col-md-3"}>
                                            <TextInput
                                                fullWidth
                                                // record={scopedFormData}

                                                source={"minPrice"}
                                                className={"ltr"}

                                                label={translate("resources.product.minPrice")}
                                                format={v => {
                                                    if (!v) return;

                                                    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                }}
                                                parse={v => {
                                                    if (!v) return;

                                                    return v.toString().replace(/,/g, "");

                                                }}
                                                {...rest}
                                            />
                                        </div>
                                        <div className={"col-md-3"}>
                                            <TextInput
                                                fullWidth
                                                // record={scopedFormData}

                                                source={"maxPrice"}
                                                className={"ltr"}

                                                label={translate("resources.product.maxPrice")}
                                                format={v => {
                                                    if (!v) return;

                                                    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                }}
                                                parse={v => {
                                                    if (!v) return;

                                                    return v.toString().replace(/,/g, "");

                                                }}
                                                {...rest}
                                            />
                                        </div>
                                        <div className={"col-md-3"}>
                                            <TextInput
                                                fullWidth
                                                // record={scopedFormData}

                                                source={"formula"}
                                                className={"ltr"}

                                                label={translate("resources.product.formula")}

                                                {...rest}
                                            />
                                        </div>

                                    </div>];

                        }}
                    </FormDataConsumer>

                    {/*<EditOptions*/}
                    {/*// record={record}*/}
                    {/*onCreateCombinations={onCreateCombinations} updater={OptsUpdater}/>*/}


                    {/*<ShowPictu  <EditOptions ros" thep={theP} setPhotos={setPhotos}/>*/}

                    <BooleanInput source="oneItemPerOrder" label={translate("resources.product.oneItemPerOrder")}/>
                    <BooleanInput source="notBuyableAlone" label={translate("resources.product.notBuyableAlone")}/>

                    <UploaderField
                        label={translate("resources.product.photo")}
                        accept="image/*"
                        source="photos"
                        multiple={true}
                        thep={theP}
                        setPhotos={setPhotos}
                        inReturn={thel}

                    />

                    <div className={"mb-20"}/>

                    <ArrayInput source="extra_attr"
                                label={translate("resources.product.extra_attr")}
                    >
                        <SimpleFormIterator {...props}>

                            <FormDataConsumer>
                                {({getSource, scopedFormData}) =>
                                    ([
                                            <div className={"mb-20"}/>,

                                            <TextInput
                                                fullWidth
                                                source={getSource("title")}
                                                label={translate("resources.product.title")}

                                                record={scopedFormData}
                                            />,
                                            <TextInput
                                                fullWidth
                                                source={getSource("des")}
                                                label={translate("resources.product.description")}


                                                record={scopedFormData}
                                            />]
                                    )
                                }
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                    <ArrayInput source="labels" label={translate("resources.product.labels")}>
                        <SimpleFormIterator {...props}>

                            <FormDataConsumer>
                                {({getSource, scopedFormData}) =>
                                    (
                                        <TextInput
                                            fullWidth
                                            source={getSource("title")}

                                            label={translate("resources.product.title")}

                                            record={scopedFormData}
                                        />
                                    )
                                }
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>


                    <SelectInput
                        label={translate("resources.product.status")}

                        source="status"
                        choices={[
                            {id: "published", name: translate("resources.product.published")},
                            {id: "processing", name: translate("resources.product.processing")},
                            {id: "draft", name: translate("resources.product.draft")},
                            {id: "deleted", name: translate("resources.product.deleted")}
                        ]}
                    />
                    <SelectInput
                        label={translate("resources.page.access")}
                        defaultValue={"public"}
                        source="access"
                        choices={[
                            {id: "public", name: translate("resources.page.public")},
                            {id: "private", name: translate("resources.page.private")}
                        ]}
                    />
                    <TextInput className={'ltr'} source={"normalBarcode"}
                               label={translate("resources.product.normalBarcode")}/>

                </>
            )}
            {isSimple && (
                <>
                    <TextInput source={"title." + translate("lan")} label={translate("resources.product.title")}
                               className={"width100 mb-20"} validate={Val.req} fullWidth/>
                    {/* <div className={'gpt-button-wrap-fab'}>
            <ControlledTextInput
                fullWidth
                multiline
                source={'excerpt.' + translate('lan')}
                value={getValues('chatGPTanswerForExcerpt')}
                onChange={(e)=>{
                    setValue("chatGPTanswerForExcerpt",e?.target?.value)
                    console.log("e",e?.target?.value)
                }}
                label={translate('resources.product.excerpt')}
            />
            {waitings2 ? (
                <CircularProgress className={'gpt-btn-circular'} />
            ) : (
                <LightTooltip title="ASK CHATGPT" placement="top" arrow>
                    <Fab
                        disabled={waitings2}
                        // id="excerpt"
                        // onClick={(e) => chatGptHandler(e)}
                        size="small"
                        className={'gpt-button-fab'}>
                        <AndroidIcon
                            id="excerpt"
                            onClick={(e) => chatGptHandler(e,'excerpt')}
                            style={{ color: '#27282c' }}
                        />
                    </Fab>
                </LightTooltip>
            )}
        </div> */}
                    <ReferenceArrayInput
                        label={translate("resources.product.productCategory")}
                        perPage={100}
                        source="productCategory" reference="productCategory">
                        <SelectArrayInput label={translate("resources.product.productCategory")} optionText="name.fa"/>
                    </ReferenceArrayInput>
                    <div className={"row-d"}>

                        <div className={""}>

                            <SelectInput
                                fullWidth
                                defaultValue={true}
                                label={translate("resources.product.stock")}
                                // record={scopedFormData}
                                source={"in_stock"}

                                choices={ST}
                            />
                        </div>
                        <div className={""}>
                            <TextInput
                                fullWidth
                                defaultValue={10}

                                source={"quantity"}

                                label={translate("resources.product.quantity")}
                            />
                        </div>
                    </div>
                    <TextInput
                        fullWidth
                        // record={scopedFormData}

                        source={"price"}
                        className={"ltr"}
                        label={translate("resources.product.price")}
                        format={v => {
                            if (!v) return "";

                            return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }}
                        parse={v => {
                            if (!v) return "";

                            return v.toString().replace(/,/g, "");

                        }}
                    />
                    <UploaderField
                        label={translate("resources.product.photo")}
                        accept="image/*"
                        source="photos"
                        multiple={true}
                        thep={theP}
                        setPhotos={setPhotos}
                        inReturn={thel}

                    />
                    <SelectInput
                        label={translate("resources.product.status")}
                        defaultValue="published"
                        source="status"
                        choices={[
                            {id: "published", name: translate("resources.product.published")},
                            {id: "processing", name: translate("resources.product.processing")},
                            {id: "draft", name: translate("resources.product.draft")},
                        ]}
                    />
                </>
            )}


        </SimpleForm>
    );
};


export default Form;
