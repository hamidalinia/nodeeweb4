import * as React from "react";
import {useState} from "react";
// import { useLocation } from 'react-router-dom';
import {useForm} from "react-hook-form";
import API, {BASE_URL} from "@/functions/API";
import {ColorPicker} from "@/components";

import TextField from '@mui/material/TextField';
import {Box, Card, CardActions, CardContent, CircularProgress} from "@mui/material";
import {Form, SaveButton, TextInput, useNotify, useRefresh, useTranslate} from "react-admin";
// import { SelectInput } from 'react-admin';
// import {  } frsom 'react-hook-form';
const CreateOrShowCustomer = (props) => {
    const {_id, theStatus, handleCustomer} = props;
    const refresh = useRefresh();
    const {register, handleSubmit, formState: {errors}, setValue, getValues} = useForm({
        defaultValues: {
            phoneNumber: "",
            firstName: "",
            lastName: ""
        }
    });
    // const { setValue } = useFormContext();
    // const theTitle = useWatch({ name: "title" });

    // const {
    //   register,
    //   formState: { errors },
    // } = useFormContext();
    // register("title", { value: "data" });
    // console.log(watch("title"));
    // watch("title");
    // console.log("watch", watch('title'));

    const [mainId, setMainId] = useState("");
    const [childs, setChilds] = useState([]);
    const [Customer, setCustomer] = useState(false);
    const [loading, setLoading] = useState(false);
    let [counter, setCounter] = useState(0);
    // const [color, setColor] = React.useState({
    //   primaryColor: "#ee811d",
    //   secondaryColor: "#2d3488",
    //   textColor: "#000000",
    //   bgColor: "#ffffff",
    //   footerBgColor: "#ffffff"
    // });

    const [theData, setTheData] = React.useState(false);
    const translate = useTranslate();
    const notify = useNotify();
    // const login = useLogin();
    // const location = useLocation();
    const setTheColor = (t, e) => {
        console.log(t, e);
        setValue(t, e);
        // setCounter(counter++);
        // console.log("getValuszses", getValues());
        // color[t] = e.hex;
        // console.log('{...color}',{...color});
        // setColor({ ...color });
    };
    const setTheValue = (e) => {
        console.log(e.target.value);
    };
    const handleNotif = (t, type = "success") => {
        notify((t), {type: type});
    };

    const handleTheChange = (t, value) => {
        setValue(t, value);

    };

    const onSubmit = (theData) => {
        console.log("theData", theData)
        console.log("mainId", mainId)
        if (!theData.phoneNumber) {
            handleNotif("resources.settings.enterPhoneNumber", "error");

            return;

        }
        let jso = {
            phoneNumber: theData.phoneNumber,
        };
        if (mainId) {
            if (theData?.firstName)
                jso['firstName'] = theData.firstName
            if (theData?.lastName)
                jso['lastName'] = theData.lastName
            API.put("/customer/" + mainId, JSON.stringify(
                jso
            )).then(({data = {}}) => {
                setLoading(false);
                console.log("data", data);
                if (data?.success) {
                    handleNotif("resources.settings.success");

                } else {


                }
                return data;

            });
        } else {
            API.post("/customer/", JSON.stringify(
                jso
            )).then(({data = {}}) => {
                setLoading(false);
                console.log("data", data);
                if (data?.success) {
                    handleNotif("resources.settings.success");

                } else {
                    if (data?.err == "customer_exist" && data?.customers && data?.customers[0] && data?.customers[0]._id) {
                        setCustomer({...data?.customers[0]})
                        handleNotif("resources.settings.customerExist", "warning");
                        handleCustomer(data?.customers[0]._id)
                        setMainId(data?.customers[0]._id)
                    } else if (data?._id) {
                        setCustomer({...data})
                        handleCustomer(data?._id)

                        setMainId(data?._id)

                        handleNotif("resources.customers.customerCreated", "success");

                    } else {
                        handleNotif("resources.settings.sthWrong", "error");

                    }

                }
                return data;

            });
        }
    };

    React.useEffect(() => {
        // getData()
    }, []);


    const returnStatus = (st) => {
        let rd = childs && childs.filter(x => x.slug == st);
        if (rd && rd[0] && rd[0].title)
            return rd[0].title;
        else
            return JSON.stringify(st)
    };
    let co = 0;
    if (theStatus) {
        co = theStatus.length
    }

    // if (!theData) {
    //     return <></>;
    // }
    // if (theData) {
    let {
        phoneNumber,
        firstName,
        lastName
    } = getValues();
    return (
        <div className={'box'}>
            <Form onSubmit={handleSubmit(onSubmit)} noValidate={true} redirect={false}>
                <Box>
                    {Customer && <Card sx={{padding: "1em"}}>
                        <CardContent>
                            <Box>
                                <Box>
                                    <TextField fullWidth
                                               source={"firstName"}
                                               label={translate("resources.customers.firstName")}
                                               value={Customer?.firstName}
                                               defaultValue={firstName}
                                               onChange={(event) => {
                                                   event.preventDefault();
                                                   handleTheChange("firstName", event.target.value);
                                                   // handleCustomer(event.target.value);
                                               }}
                                    />
                                </Box>
                                <Box>

                                    <TextField fullWidth
                                               source={"lastName"}
                                               label={translate("resources.customers.lastName")}
                                               value={Customer?.lastName}
                                               defaultValue={lastName}
                                               onChange={(event) => {
                                                   event.preventDefault();
                                                   handleTheChange("lastName", event.target.value);
                                                   // handleCustomer(event.target.value);
                                               }}
                                    />
                                </Box>
                                <Box>

                                    <TextField fullWidth
                                               source={"phoneNumber"}
                                               label={translate("resources.customers.phoneNumber")}
                                               value={Customer?.phoneNumber} disabled/>
                                </Box>
                            </Box>
                        </CardContent>
                        <CardActions sx={{padding: "0 1em 1em 1em"}} className={'d-flex-space-between'}>
                            <SaveButton
                                variant="contained"
                                type="submit"
                                color="primary"
                                disabled={loading}
                                alwaysEnable
                                redirect={false}
                                // saving={onSubmit}
                            >
                                {loading && (
                                    <CircularProgress size={25} thickness={2}/>
                                )}
                                {translate("resources.settings.update")}
                            </SaveButton>
                            <a
                                color="secondary"
                                target={"_blank"}
                                href={"/admin/#/customer/" + mainId}
                                // saving={onSubmit}
                            >
                                {loading && (
                                    <CircularProgress size={25} thickness={2}/>
                                )}
                                {translate("resources.settings.goToCustomer")}
                            </a>
                        </CardActions>

                    </Card>
                    }

                    {!Customer && <Card sx={{padding: "1em"}}>


                        <Box>

                            <TextInput
                                autoFocus
                                fullWidth
                                className={"ltr"}
                                label={translate("resources.customers.phoneNumber")}
                                source={"phoneNumber"}
                                disabled={loading}
                                defaultValue={phoneNumber}
                                onChange={(event) => {
                                    event.preventDefault();
                                    handleTheChange("phoneNumber", event.target.value);
                                    // handleCustomer(event.target.value);
                                }}
                            />

                        </Box>


                        <CardActions sx={{padding: "0 1em 1em 1em"}}>
                            <SaveButton
                                variant="contained"
                                type="submit"
                                color="primary"
                                disabled={loading}
                                alwaysEnable
                                redirect={false}
                                // saving={onSubmit}
                            >
                                {loading && (
                                    <CircularProgress size={25} thickness={2}/>
                                )}
                                {translate("resources.settings.check")}
                            </SaveButton>
                        </CardActions>

                    </Card>}

                </Box>
            </Form>

        </div>
    );
    // }
};


export default React.memo(CreateOrShowCustomer);
