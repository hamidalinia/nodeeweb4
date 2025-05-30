import {
    ArrayInput,
    DeleteButton,
    FormDataConsumer,
    FormTab,
    NumberInput,BooleanInput,
    ReferenceArrayInput,
    SaveButton,
    SelectArrayInput,
    SelectInput,
    showNotification,
    SimpleFormIterator,
    TabbedForm,
    TextInput,
    Toolbar,
    useForm,
    useNotify,
    useRedirect,
    useTranslate
} from "react-admin";
import {useFormContext} from "react-hook-form";
import API from "@/functions/API";
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
    UploaderField,
    UploaderFieldBox,
    SeasonLessonsInput,
    VideoArrayInput
} from "@/components";
import {Val} from "@/Utils";
import React from "react";
import {RichTextInput} from "ra-input-rich-text";

// import { RichTextInput } from 'ra-input-rich-text';
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
    // console.log(values);

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
// //     console.log('course values', values);
// //     console.log('course valuess', valuess);
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
//             delete values.nextcourse;
//             delete values.category;
//             delete values.catChoosed;
//             delete values.files;
//             console.log("last values (edit): ", values);
//
//             API.put("/course/" + values._id, JSON.stringify({...values}))
//                 .then(({data = {}}) => {
//                     // const refresh = useRefresh();
//                     // refresh();
//                     // alert('it is ok');
//                     redirect(false);
//                     // showNotification(translate('course.updated'));
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
//             API.post("/course/", JSON.stringify({...values}))
//                 .then(({data = {}}) => {
//                     // showNotification(translate('course.created'));
//                     // console.clear()
//                     console.log("data", data);
//                     if (data._id) {
//                         // window.location.reload()
//                         window.location.href = "/#/course/" + data._id;
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
    let _The_ID = '';
    let DublicateProduct = false;
    const {record} = props;
//   const { data, total, isLoading, error } = useGetList('course',
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
            delete values.nextcourse;
            delete values.category;
            delete values.catChoosed;
            delete values.files;
            API.put("/course/" + _The_ID, JSON.stringify({...values}))
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
            API.post("/course/", JSON.stringify({...values}))
                .then(({data = {}}) => {
                    if (data) {
                        _The_ID = '';
                        redirect('/course');
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
    console.log("Form props111", props);
    console.log("_The_ID111", _The_ID);

    return (

        <TabbedForm

            {...props}
            transform={transform}
            className={"this-is-course"}
            onSubmit={v => save(v)}
            toolbar={<CustomToolbar record={props.record}/>}
        >
            <FormTab label={translate("resources.test.generalSettings")}>

                {children}

                <TextInput source={"title." + translate("lan")} label={translate("resources.course.title")}
                           className={"width100 mb-20"} validate={Val.req} fullWidth/>

                <TextInput

                    source="slug" label={translate("resources.course.slug")} className={"width100 mb-20 ltr"}
                    fullWidth/>
                <TextInput fullWidth source={"metatitle." + translate("lan")}
                           label={translate("resources.course.metatitle")}/>
                <TextInput multiline fullWidth source={"metadescription." + translate("lan")}
                           label={translate("resources.course.metadescription")}/>

                <TextInput multiline fullWidth source={"excerpt." + translate("lan")}
                           label={translate("resources.course.excerpt")}/>
                <RichTextInput multiline fullWidth source={"description." + translate("lan")}
                               label={translate("resources.course.description")}/>

                <div className={"mb-20"}/>
                {/*<BooleanInput source="story" label={translate("resources.course.story")}/>*/}
                {/*<BooleanInput source="requireWarranty" label={translate("resources.course.requireWarranty")}/>*/}
                <TextInput fullWidth source={"miniTitle." + translate("lan")} label={translate("resources.course.miniTitle")}/>
                {/*<TextInput source={"extra_button"} label={translate("resources.course.extra_button")}/>*/}
                <TextInput fullWidth source={"courseLength"} label={translate("resources.course.courseLength")}/>

                {/*<CatRefField label={translate("resources.course.firstCategory")} returnToHome={returnToHome}*/}
                {/*returnCatsValues={returnCatsValues}*/}
                {/*// record={record}*/}
                {/*source="firstCategory"*/}
                {/*reference="category"*/}
                {/*url={"/category/f/0/1000"} surl={"/category/s"}/>*/}
                <SelectArrayInput fullWidth source="include" label="include" choices={[
                    {id: 'video', name: translate("resources.course.video")},
                    {id: 'textbook', name: translate("resources.course.textbook")},
                    {id: 'practice', name: translate("resources.course.practice")},
                    {id: 'game', name: translate("resources.course.game")},
                ]}/>

                <ReferenceArrayInput
                    fullWidth
                    label={translate("resources.course.courseCategory")}
                    perPage={100}
                    source="courseCategory" reference="courseCategory">
                    <SelectArrayInput fullWidth optionText="name.fa"/>
                </ReferenceArrayInput>




                <div className={"mb-20"}/>

                <div className={"row mb-20"}>
                    <div className={"col-md-4 col-xs-12 col-sm-12"}>
                        <SelectInput
                            fullWidth

                            label={translate("resources.course.stock")}
                            // record={scopedFormData}
                            source={"in_stock"}

                            choices={ST}
                            // formClassName={cls.f2}
                        />
                    </div>
                    <div className={"col-md-4"}>
                        <NumberInput
                            fullWidth

                            source={"quantity"}

                            label={translate("resources.course.quantity")}
                            // record={scopedFormData}
                        />
                    </div>

                </div>
                <div className={"row mb-20"}>
                    <div className={"col-md-6"}>
                        <TextInput
                            fullWidth
                            // record={scopedFormData}

                            source={"price"}
                            className={"ltr"}

                            label={translate("resources.course.price")}
                            format={v => {
                                if (!v) return "";

                                return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }}
                            parse={v => {
                                if (!v) return "";

                                return v.toString().replace(/,/g, "");

                            }}
                        />
                    </div>
                    <div className={"col-md-6"}>
                        <TextInput
                            fullWidth
                            // record={scopedFormData}

                            source={"salePrice"}
                            className={"ltr"}

                            label={translate("resources.course.salePrice")}
                            format={v => {
                                if (!v) return "";

                                return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }}
                            parse={v => {
                                if (!v) return "";

                                return v.toString().replace(/,/g, "");

                            }}
                        />
                    </div>
                </div>
                <UploaderField
                    label={translate("resources.course.photo")}
                    accept="image/*"
                    source="photos"
                    multiple={true}
                    thep={theP}
                    setPhotos={setPhotos}
                    inReturn={thel}

                />

                <div className={"mb-20"}/>

                <ArrayInput source="faq"
                            label={translate("resources.course.faq")}
                >
                    <SimpleFormIterator {...props}>

                        <FormDataConsumer>
                            {({getSource, scopedFormData}) =>
                                ([
                                        <div className={"mb-20"}/>,

                                        <TextInput
                                            fullWidth
                                            source={getSource("questionText")}
                                            label={translate("resources.course.questionText")}

                                            record={scopedFormData}
                                        />,
                                        <TextInput
                                            fullWidth
                                            source={getSource("response")}
                                            label={translate("resources.course.response")}


                                            record={scopedFormData}
                                        />]
                                )
                            }
                        </FormDataConsumer>
                    </SimpleFormIterator>
                </ArrayInput>
                <VideoArrayInput
                    label={translate("resources.course.videos")}
                    source="videos"
                    fullWidth
                />
                <ArrayInput source="extra_attr"
                            label={translate("resources.course.extra_attr")}
                >
                    <SimpleFormIterator {...props}>

                        <FormDataConsumer>
                            {({getSource, scopedFormData}) =>
                                ([
                                        <div className={"mb-20"}/>,

                                        <TextInput
                                            fullWidth
                                            source={getSource("title")}
                                            label={translate("resources.course.title")}

                                            record={scopedFormData}
                                        />]
                                )
                            }
                        </FormDataConsumer>
                    </SimpleFormIterator>
                </ArrayInput>
                <ArrayInput source="labels" label={translate("resources.course.labels")}>
                    <SimpleFormIterator {...props}>

                        <FormDataConsumer>
                            {({getSource, scopedFormData}) =>
                                (
                                    <TextInput
                                        fullWidth
                                        source={getSource("title")}

                                        label={translate("resources.course.title")}

                                        record={scopedFormData}
                                    />
                                )
                            }
                        </FormDataConsumer>
                    </SimpleFormIterator>
                </ArrayInput>

                <UploaderFieldBox
                    source={`icon`}
                    label={translate("resources.course.icon")}
                    accept="image/*"
                    multiple={false}
                />
                <SelectInput
                    label={translate("resources.course.status")}

                    source="status"
                    choices={[
                        {id: "published", name: translate("resources.course.published")},
                        {id: "processing", name: translate("resources.course.processing")},
                        {id: "draft", name: translate("resources.course.draft")},
                        {id: "deleted", name: translate("resources.course.deleted")}
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
            </FormTab>
            <FormTab label={translate("resources.course.lessons")}>
                <SeasonLessonsInput source="season" />
            </FormTab>

        </TabbedForm>
    );
};


export default Form;
