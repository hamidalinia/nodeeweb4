import {Create, SaveButton,useNotify, SelectInput, TextInput, Toolbar, useTranslate,useRedirect} from "react-admin";
import {
    AddProductsField,
    CreateOrShowCustomer,
    List,
    OrderPaymentStatus,
    OrderStatus,
    PrintOrder,
    PrintPack,
    SimpleForm
} from "@/components";
import {dateFormat} from "@/functions";
import {useForm, useFormContext,} from 'react-hook-form';
import {BASE_URL} from "@/functions/API";
import React, {useEffect, useState} from "react";

import API, {ShopURL} from "@/functions/API";

const CustomToolbar = props => (
    <Toolbar {...props} className={"dfghjk"}>
        <SaveButton alwaysEnable/>
    </Toolbar>
);
const Form = ({children, ...props}) => {
    const translate = useTranslate();
    const [state, setState] = useState(false);
    const redirect = useRedirect();
    const notify = useNotify();
    const [url, setUrl] = useState([""]);
    const {setValue, getValues} = useForm({
        defaultValues: {
            customerId: props?.record?.customer,
            sum: props?.record?.sum,
            amount: props?.record?.amount,
            phoneNumber: ""
        },
    });

    function save(values) {

        console.log("values", values, getValues("customerId"))
        // return;
        API.post("/order/", JSON.stringify({...values}))
            .then(({data = {}}) => {
                if (data) {
                    console.log('data',data)
                    // _The_ID = '';
                    notify(translate("saved successfully."), {
                        type: "success"
                    });
                    redirect('/order/'+data?._id);
                }
            })
            .catch((err) => {
                notify(JSON.stringify(err), {
                    type: "error"
                });
                console.log("error", err);
            });
    }

    const handleChange = (t, value) => {
        console.log("handleChange", t, value)
        setValue(t, value);
        setState((prev)=>!prev)

    };
    const handleCustomer = (value) => {
        console.log("handleCustomer", value)
        setValue('customerId', value);
        setState((prev)=>!prev)
    };
    const ControlledTextInput = ({value, ...props}) => {
        // console.log("ControlledTextInput",props.source,value)
        const {setValue} = useFormContext();

        useEffect(() => {
            // console.log("ControlledTextInput useEffect")

            // console.log("props.source", props.source, value)
            setValue(props.source, value);
            //eslint-disable-next-line
        }, [value]);

        return <TextInput {...props} />;
    };
    return (
        <>
            <div className={'row'}>
                <div className={'col col-md-6 col-xs-12'}>

                    <CreateOrShowCustomer
                        handleCustomer={(value) => handleCustomer(value)}
                        source={"customer"}
                    />
                </div>
                <div className={'col col-md-6 col-xs-12'}>
                </div>
            </div>
            <SimpleForm {...props}
                        onSubmit={(e) => save(e)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // Prevent form submission
                            }
                        }}
                        toolbar={<CustomToolbar record={props.record}/>}
                        className={"d-flex0"}>
                <ControlledTextInput
                    className={"d-none"}
                    source={'customer'}
                    value={getValues('customerId')}

                    onChange={(e) => {
                        console.log("customerId onChange", e?.target?.value)
                        setValue("customerId", e?.target?.value)
                    }}
                    label={translate('resources.order.customer')}
                />
                <AddProductsField
                    label={translate('resources.order.products')}
                    handleChange={(t, v) => {
                        handleChange(t, v)
                    }}
                    source="card"
                    url={"/product/0/1000"}
                />

                <div className={'row'}>
                    <div className={'col col-md-6 col-xs-12'}>

                        <div className={'box'}>
                            <SelectInput
                                label={translate("resources.order.paymentStatus")}
                                fullWidth
                                className={'mb-20'}
                                source="paymentStatus"
                                defaultValue="notpaid"
                                optionValue="id"
                                optionText="name"
                                choices={OrderPaymentStatus()}
                                translateChoice={true}

                            />
                            <SelectInput
                                label={translate("resources.order.status")}
                                fullWidth
                                defaultValue="processing"

                                className={'mb-20'}
                                source="status"
                                choices={OrderStatus()}

                            />
                        </div>
                    </div>

                    <div className={'col col-md-6 col-xs-12'}>

                        <div className={'box'}>

                            <ControlledTextInput
                                className={"ltr"}
                                source={'sum'}
                                value={getValues('sum')}
                                onChange={(e) => {
                                    console.log("sum onChange", e?.target?.value)
                                    setValue("sum", e?.target?.value)
                                }}
                                format={v => {
                                    if (!v) return "";

                                    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                }}
                                parse={v => {
                                    if (!v) return "";

                                    return v.toString().replace(/,/g, "");

                                }}
                                label={translate('resources.order.sum')}
                            />
                            <ControlledTextInput
                                className={"ltr"}
                                source={'amount'}
                                value={getValues('amount')}
                                onChange={(e) => {
                                    console.log("amount onChange", e?.target?.value)
                                    setValue("amount", e?.target?.value)
                                }}
                                format={v => {
                                    if (!v) return "";

                                    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                }}
                                parse={v => {
                                    if (!v) return "";

                                    return v.toString().replace(/,/g, "");

                                }}
                                label={translate('resources.order.amount')}
                            />
                        </div>
                    </div>
                </div>

                {children}
            </SimpleForm>
        </>
    );
};

const create = (props) => (
    <Create {...props}>
        <Form>


        </Form>
    </Create>
);


export default create;
