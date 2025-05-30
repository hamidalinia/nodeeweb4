import React from "react";
import {NumberInput, TextInput, useInput, useTranslate} from "react-admin";
import API from "@/functions/API";
import {SearchAndChooseProduct} from "@/components";
import {useForm, useFormContext,} from 'react-hook-form';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

API.defaults.headers.common["Content-Type"] = "multipart/form-data";
let ckjhg = {};
let hasTriggered = false;

export default (props) => {
    // console.log('props',props);
    // console.log('CatRefField...',props);
    const [v, setV] = React.useState([]);
    const [c, setC] = React.useState(0);
    const [state, setState] = React.useState(0);
    const {register, handleSubmit, formState: {errors}, setValue, getValues} = useForm({
        defaultValues: {
            card: [],
            amount: 0

        }
    });
    let {scopedFormData, getSource, source, label, handleChange} = props;
    const translate = useTranslate();
    // const record = useRecordContext();
    // const { setFilters, displayedFilters,selectedChoices,allChoices,availableChoices,total } = useChoicesContext();
    const {field} = useInput(props);
    const getData = () => {

        API.get("" + props.url, {}, {})
            .then(({data = []}) => {
                var cds = [];
                data.forEach((uf, s) => {
                    cds.push({
                        type: uf.type,
                        salePrice: uf.salePrice,
                        price: uf.price,
                        _id: uf._id,
                        title: (uf.title && uf.title.fa) ? uf.title.fa : uf.title,
                        key: s
                    });

                });
                setV(cds);
                // setSelectS([false, true, true]);
                // changeSecondInput(defaultV);
            });
    };
    // const [progress, setProgress] = React.useState(0);


    const returnDefaultValue = (product_id, x = "price") => {

        console.log("product_id", product_id);
        console.log("x", x);

        let ddd = [];
        v.forEach((f) => {
            if (f._id == product_id) {
                console.log("f", f);

                ddd = f[x];
            }
        });
        console.log("ddd", ddd);
        return ddd;

    };
    React.useEffect(() => {
        getData();
    }, []);

    console.log("getValues", getValues("_id"))
    console.log("card", getValues("card"))
    const addToItems = () => {
        card = getValues("card")
        console.log("addToItems = () => card", card);
        if (card) {
            let cy = card;
            cy.push({'_id': "", "title": "", "count": "", "price": "", "salePrice": ""});
            setValue("card", cy)

        } else {
            setValue("card", [{'_id': "", "title": "", "count": "", "price": "", "salePrice": ""}])
        }
        setState(state + 1)
    }
    const removeIndexFromCart = (card, index) => {
        let yt = [];
        console.log("removeIndexFromCart", card, index);
        if (card) {
            card.forEach((cd, j) => {
                console.log("j", j, j != index);

                if (j != index) {
                    yt.push(cd);
                }
            })
            console.log("******* remove card**********", yt)
            setValue("card", yt)
            setState(state + 1);
            setAmount()
            return yt
        } else {
            setState(state + 1);
            return getValue("card")

        }
    }
    const removeIndex = (index) => {
        let yt = [];
        console.log("removeIndex", card, index);
        if (card) {
            card.forEach((cd, j) => {
                console.log("j", j, j != index);

                if (j != index) {
                    yt.push(cd);
             
                }
            })
            console.log("******* remove card**********", yt)
            setValue("card", yt)
            setAmount()
            setState(state + 1);
            return yt
        } else {
            setState(state + 1);

        }
    }
    const productExist = (_id, card) => {
        console.log("productExist", _id, card)
        // let card = getValues("card");
        for (let i = 0; i < card?.length; i++) {
            let car = card[i];
            console.log("car", car)

            console.log("car?._id", car?._id, "_id", _id)
            if (car?._id === _id) {
                console.log("return index:", i)

                return i
            }
        }
        return -1
    }
    const setProduct = (key, product) => {
        // console.clear();
        let amount = 0;
        let card = getValues("card");
        let {title, price, salePrice, _id, type, combinations} = product
        console.log("setProduct(" + key + ",", product, ")", card)
        let indexIfExist = productExist(_id, card);
        console.log("indexIfExist", indexIfExist)

        if (indexIfExist > -1) {
            if (card[indexIfExist]) {
                if (type == "normal") {
                    console.log("product type is normal")
                    card[indexIfExist]._id = _id;
                    card[indexIfExist].product_id = _id;
                    card[indexIfExist].title = title;
                    card[indexIfExist].count = card[indexIfExist].count + 1;
                    card[indexIfExist].price = price;
                    card[indexIfExist].type = type;
                    card[indexIfExist].salePrice = salePrice;
                }
                if (type == "variable") {
                    card[indexIfExist]._id = _id;
                    card[indexIfExist].product_id = _id;

                    card[indexIfExist].title = title;
                    card[indexIfExist].count = card[indexIfExist].count + 1;
                    card[indexIfExist].price = price;
                    card[indexIfExist].salePrice = salePrice;
                }
            }
            console.log("before removeIndexFromCart",card)
            card = removeIndexFromCart(card,card?.length - 1)
            console.log("after removeIndexFromCart",card)

            // card = getValues("card")
        } else {
            if (card[key]) {
                console.log("card[key]", card[key])
                if (type == "normal") {
                    card[key]._id = _id;
                    card[key].product_id = _id;
                    card[key].title = title;
                    card[key].count = 1;
                    card[key].price = price;
                    card[key].salePrice = salePrice;
                }
                if (type == "variable") {
                    card[key]._id = _id;
                    card[key].product_id = _id;

                    card[key].title = title;
                    card[key].count = 1;
                    card[key].price = price;
                    card[key].salePrice = salePrice;
                }
            }
        }
        card.forEach((cr) => {
            console.log("cr.salePrice", "cr.price", cr.salePrice, cr.price)

            if (cr.salePrice && cr.price) {
                amount += (parseFloat(cr.salePrice) * parseInt(cr.count))
            }
            if (!cr.salePrice && cr.price) {
                amount += (parseFloat(cr.price) * parseInt(cr.count))
            }
            if (!cr.salePrice && !cr.price) {
            }
        })
        console.log("setProduct", {title, price, salePrice, _id, type})
        console.log("card is:", card)
        console.log("amount", amount)
        setValue("card", card)
        handleChange("sum", amount)
        handleChange("amount", amount)
        handleChange("card", card)
        setC((prev)=>product?._id)
        setState((prev)=>state+1)
    }
    const setAmount = () => {
        console.log("setAmount")
        let amount = 0
        let card = getValues("card");

        card.forEach((cr) => {
            if (cr.salePrice && cr.price) {
                amount += (parseFloat(cr.salePrice) * parseInt(cr.count))
            }
            if (!cr.salePrice && cr.price) {
                amount += (parseFloat(cr.price) * parseInt(cr.count))
            }
            if (!cr.salePrice && !cr.price) {
            }
        })
        console.log("card", card)

        handleChange("card", card)
        handleChange("amount", amount)
        handleChange("sum", amount)
        setState(state + 1)

    }

    const ControlledTextInput = ({value, ...props}) => {
        // console.log("ControlledTextInput", props.source, value)
        const {setValue} = useFormContext();

        React.useEffect(() => {
            // console.log("ControlledTextInput useEffect")

            // console.lo/g("props.source", props.source, value)
            setValue(props.source, value);
            //eslint-disable-next-line
        }, [value]);

        return <TextInput {...props} />;
    };
    const ControlledNumberInput = ({value, ...props}) => {
        // console.log("ControlledTextInput", props.source, value)
        const {setValue} = useFormContext();

        React.useEffect(() => {
            // console.log("ControlledTextInput useEffect")

            // console.log("props.source", props.source, value)
            setValue(props.source, value);
            //eslint-disable-next-line
        }, [value]);

        return <NumberInput {...props} />;
    };
    let {
        card
    } = getValues();
    return (
        <div className={'width-100-darsad'}>
            <label>{label}</label>
            <div className={'width-100-darsad'}>
                {card && card.map((cons, key) => {
                    return <div className={"mb-20 d-flex invoice-p-flex"} key={key}>

                        <div className={"invoice-p width-auto-title"}>
                            {!cons._id && <SearchAndChooseProduct
                                source={"card." + key + "._id"}
                                theKey={key}
                                autoFocus
                                card={card}
                                addToItems={addToItems}
                                // value={getValues("card." + key + "._id")}
                                onChange={(e) => {
                                    setValue("card." + key + "._id", e?.target?.value)
                                }}
                                setTheValue={(e) => {
                                    setValue("card." + key + "._id", e)

                                }}
                                setProduct={(product) => {
                                    console.log("card", card, product?._id)
                                    // setValue("card." + key + "._id", product?._id)
                                    setProduct(key, product)
                                }}/>}

                            {cons._id && <ControlledTextInput

                                source={"card." + key + "._id"}
                                value={getValues("card." + key + "._id")}
                                onChange={(e) => {
                                    setValue("card." + key + "._id", e?.target?.value)
                                }}
                                className={"width100 mb-20 ltr d-none"} fullWidth/>}

                            {cons._id && <ControlledTextInput
                                source={"card." + key + ".title." + translate("lan")}
                                value={getValues("card." + key + ".title." + translate("lan"))}
                                onChange={(e) => {
                                    setValue("card." + key + ".title." + translate("lan"), e?.target?.value)
                                }}
                                label={translate("resources.order.title")}
                                className={"width100 mb-20"} fullWidth/>}


                        </div>
                        <div className={"invoice-p width90"}>

                            {cons._id && <ControlledNumberInput
                                source={"card." + key + ".count"}
                                value={getValues("card." + key + ".count")}
                                onChange={(e) => {
                                    setValue("card." + key + ".count", e?.target?.value)
                                    setAmount()
                                }}
                                label={translate("resources.order.count")}
                                className={"width100 mb-20 ltr"} fullWidth/>}

                        </div>
                        <div className={"invoice-p width140"}>
                            {cons._id && <ControlledTextInput
                                source={"card." + key + ".price"}
                                fullWidth
                                className={"ltr mb-20"}
                                label={translate("resources.order.price")}
                                placeholder={translate("resources.order.price")}
                                value={getValues("card." + key + ".price")}
                                onChange={(e) => {
                                    let Price = e?.target?.value?.toString().replace(/,/g, "")

                                    setValue("card." + key + ".price", Price)
                                }}
                                format={v => {
                                    if (!v) return "";

                                    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                }}
                                parse={v => {
                                    if (!v) return "";

                                    return v.toString().replace(/,/g, "");

                                }}
                            />}
                        </div>
                        <div className={"invoice-p width140"}>
                            {cons._id && <ControlledTextInput
                                source={"card." + key + ".salePrice"}
                                value={getValues("card." + key + ".salePrice")}

                                fullWidth
                                className={"ltr mb-20"}
                                onChange={(e) => {
                                    let SalePrice = e?.target?.value?.toString().replace(/,/g, "")
                                    setValue("card." + key + ".salePrice", SalePrice)
                                }}
                                label={translate("resources.order.saleprice")}
                                placeholder={translate("resources.order.saleprice")}
                                format={v => {
                                    if (!v) return "";

                                    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                }}
                                parse={v => {
                                    if (!v) return "";

                                    return v.toString().replace(/,/g, "");

                                }}

                            />}
                        </div>
                        <div className={"invoice-p width50"}>
                            <Button onClick={(e) => {
                                e.preventDefault()

                                removeIndex(key)
                            }}><RemoveCircleOutlineIcon/></Button>
                        </div>
                    </div>;

                })}
            </div>
            <Button onClick={(e) => {
                e.preventDefault()

                addToItems();

            }}><AddCircleOutlineIcon/>
            </Button>
        </div>
    );

};
