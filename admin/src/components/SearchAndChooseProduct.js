import * as React from "react";
import {useCallback, useState} from "react";
import {debounce} from 'lodash';
// import { useLocation } from 'react-router-dom';
import {useForm} from "react-hook-form";
import API, {BASE_URL} from "@/functions/API";
import {ColorPicker} from "@/components";
import {useTheme} from '@mui/material/styles'; // To access t
// he theme
import TextField from '@mui/material/TextField';
import {useNotify, useRefresh, useTranslate} from "react-admin";
// import { SelectInput } from 'react-admin';
// import {  } frsom 'react-hook-form';
const SearchAndChooseProduct = (props) => {
    const {theStatus, setProduct, source, addToItems, setTheValue, card, theKey} = props;
    const refresh = useRefresh();
    const {register, handleSubmit, formState: {errors}, setValue, getValues} = useForm({
        defaultValues: {
            _id: "",
            status: ""
        }
    });
    const theme = useTheme(); // Access theme to get the primary text color
    const isDarkMode = theme.palette.mode === 'dark';
    const [childs, setChilds] = useState([]);
    const [text, setText] = useState('');
    const [lists, setList] = useState([]);
    const [theMainProduct, setTheMainProduct] = useState(false);
    const [secondLists, setSecondLists] = useState(false);
    const [loading, setLoading] = useState(false);
    let [counter, setCounter] = useState(0);

    const [theData, setTheData] = React.useState(false);
    const [theSecondData, setTheSecondData] = React.useState(false);
    const translate = useTranslate();
    const notify = useNotify();

    const handleNotif = (t, type = "success") => {
        notify((t), {type: type});
    };

    const getDefultData = (search) => {
        //
        setLoading(true);
        //
        API.get("/product/0/10").then((response = {}) => {
            const {data} = response
            setLoading(false);
            setList(data);
            setTheData(true);
            return data;
        }).catch(e => {
            setLoading(false);
            setTheData(true);
        });
    };
    // Debounced function to handle the API request
    const getData = useCallback(
        debounce((inputValue, source) => {
            console.log('Sending request for:', inputValue);
            // Your API request logic here
            let search = inputValue;
            if (search?.length > 2)
                API.post("/product/searchWithBarcode", JSON.stringify({
                    "search": search
                })).then((response = {}) => {
                    const {data} = response
                    setLoading(false);
                    // console.clear();
                    console.log("data", data)
                    if (data?.length == 1 && data[0] && data[0]._id) {
                        chooseProduct(data[0])
                        // setTimeOut(() => {
                            addToItems()
                        setText((prevValue) => {
                            console.log('Previous Value:', prevValue);
                            return false; // Update the state with the new value
                        });
                        // }, 1000)
                        // setTheValue('');

                        // console.log("sourcesourcesourcesourcesourcesource",source)
                    }
                    setList(data);
                    setTheData(true);
                    return data;
                }).catch(e => {
                    // console.clear();
                    console.log("e", e)
                    setLoading(false);
                    setTheData(true);
                });
        }, 600), // Adjust the delay (500ms) as needed
        []
    );
    const getData2 = (search) => {

        API.post("/product/searchWithBarcode", JSON.stringify({
            "search": search
        })).then((response = {}) => {
            const {data} = response
            setLoading(false);
            // console.clear();
            console.log("data", data)
            if (data?.length == 1 && data[0] && data[0]._id) {
                chooseProduct(data[0])
                addToItems()
                setText((prevValue) => {
                    console.log('Previous Value:', prevValue);
                    console.log('Next Value:', newValue);
                    return false; // Update the state with the new value
                });
            }
            setList(data);
            setTheData(true);
            return data;
        }).catch(e => {
            // console.clear();
            console.log("e", e)
            setLoading(false);
            setTheData(true);
        });
    };


    React.useEffect(() => {
        getDefultData("")
    }, []);


    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' تومان'
    }
    const chooseProduct = (product) => {
        console.log("chooseProduct", product)
        if (product.type == "variable" && product.combinations && product.combinations[0]) {
            console.log("our product is variable", product.combinations)
            setTheMainProduct(product);
            setSecondLists(product.combinations)
            setTheSecondData(true)
            setTheData(false)
        }
        if (product.type == 'normal') {
            setProduct(product);
            setTheSecondData(false)

            setTheData(false)
        }
    }
    const chooseCombination = (combination, ttl = "") => {
        console.log("chooseCombination", combination)
        // if (product.type == 'variable' && product.combinations && product.combinations[0]) {
        //
        setProduct({
            _id: theMainProduct?._id,
            title: {fa: theMainProduct?.title[translate("lan")] + " - " + ttl},
            type: "variable",
            price: combination?.price,
            salePrice: combination?.salePrice,
        });

        setSecondLists(false);
        setTheSecondData(false);
        setTheData(false);
        // }
        // if (product.type == 'normal') {
        //     setTheSecondData(false)
        //
        //     setTheData(false)
        //
        // }


    }

    // let {
    //     card
    // } = getValues();
    console.log("card", card, source)
    return (<div className={'product-search-wrapper-f '}>
            <TextField
                fullWidth
                label={translate("resources.order.product")}
                // source={source}

                autoFocus
                resettable
                value={text ? text : ''}
                onChange={(event) => {
                    // console.log("event.target", event);
                    const inputValue = event?.target?.value;
                    setText((prevValue) => {
                        return inputValue; // Update the state with the new value
                    });
                    if (inputValue) {
                        console.log("setValue", source, inputValue)
                        // setValue(source,inputValue);
                        getData(inputValue, source);
                    }
                    // if (event?.target?.value.length > 3)
                    //     getData(event?.target?.value);
                }}/>

            {(lists && theData) &&
            <div className={'product-search-list-f ' + (isDarkMode ? "ps-dark-mode" : "")}>{lists.map((item, key) => {
                return <div key={key} className={'psl-items'}
                            onClick={(e) => chooseProduct(item)}><span
                    className={"p-title"}>{item.title[translate("lan")]}</span>
                    <span className={"badge"}>{translate(item?.type)}</span>
                </div>
            })}</div>}
            {(secondLists && theSecondData) && <div
                className={'product-search-list-f ' + (isDarkMode ? "ps-dark-mode" : "")}>{secondLists.map((item, key) => {
                let ttl = '';
                if (item.options) {
                    Object.keys(item.options)?.map((opt, kop) => {
                        let yp = item.options[opt];
                        ttl += opt + " " + yp

                    })
                }
                return <div key={key} className={'psl-items'}
                            onClick={(e) => chooseCombination(item, ttl)}>
                    <div className={'d-flex'}>
                        <div className={"p-title"}>
                            {ttl}</div>
                        <div>
                            {(item.price && item.salePrice) && <>
                                <span>{formatPrice(item.salePrice)}</span>
                                <span className={'del-price'}>{formatPrice(item.price)}</span>
                            </>}
                            {(item.price && !item.salePrice) && <>
                                <span>{formatPrice(item.price)}</span></>}
                        </div>
                    </div>

                </div>
            })}</div>}
        </div>
    );

};


export default React.memo(SearchAndChooseProduct);
