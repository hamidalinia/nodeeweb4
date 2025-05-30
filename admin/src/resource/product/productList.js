import {
    ChipField,
    Confirm,
    Create,
    CreateButton,
    Datagrid,
    downloadCSV,
    EditButton,
    ExportButton,
    FileField,
    FileInput,
    Filter,
    FunctionField,
    Link,
    ListContextProvider,
    Pagination,
    SearchInput,
    SimpleList,
    TextField,
    Toolbar,
    TopToolbar,
    useListContext,
    useRefresh,
    useTranslate
} from "react-admin";
import {Button, Card, Chip, Divider, Tab, Tabs,MenuItem,CircularProgress,Select, TextField as MuiTextField, useMediaQuery, FormControlLabel, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Modal from '@/components/global/Modal';
import jsonExport from "jsonexport/dist";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import API, {BASE_URL} from "@/functions/API";
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

import React, {Fragment, useCallback, useEffect, useState} from "react";
import {makeStyles} from "@mui/styles/index";
import {useSelector} from "react-redux";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SettingsIcon from '@mui/icons-material/Settings';

const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />;


const postRowStyle = (record, index) => {
    // const classes = useStyles();
    // console.log('useStyles',classes.productItem);
    return ({
        backgroundColor: record.type === "variable" ? "#9f9f9f" : "#fbe4ff"
    });
};


const PostFilter = (props) => {
    const t = useTranslate();

    return (
        <Filter {...props}>
            {/*<TextInput label="Search" source="search" alwaysOn/>*/}
            <SearchInput source="Search" placeholder={t("resources.product.search")} alwaysOn/>
            {/*<ReferenceField label="Category" source="user_id" reference="category">*/}
            {/*<SearchInput source="category" placeholder={t('resources.product.category')} alwaysOn/>*/}
            {/*</ReferenceField>*/}
            {/*<ReferenceInput perPage={1000} label={t("resources.product.category")} source="category"*/}
            {/*reference="category" alwaysOn>*/}
            {/*<AutocompleteInput optionText={"name." + t("lan")}/>*/}
            {/*</ReferenceInput>*/}
            {/*<SearchInput source="firstCategory" placeholder={'نام'} alwaysOn/>*/}
            {/*<SearchInput source="lastName" placeholder={'نام خانوادگی'} alwaysOn/>*/}
            {/*<SelectInput source="firstCategory" label={'دسته بندی اول'}  emptyValue="" choices={typeChoices4}/>*/}
            {/*<SelectInput source="secondCategory" label={'دسته بندی دوم'}  emptyValue="" choices={typeChoices3}/>*/}
            {/*<SelectInput source="thirdCategory" label={'دسته بندی سوم'}  emptyValue="" choices={typeChoices3}/>*/}

        </Filter>
    );
};
const exporter = posts => {

    let allpros = [];
    let cats = [];
    console.log('postspostsposts', posts);
    const postsForExport = posts.map((post, i) => {
        cats = [];
        const {backlinks, author, ...postForExport} = post; // omit backlinks and author
        postForExport._id = post._id; // add a field
        // postForExport.maxResults  = 10000;
        if (post.productCategory) {
            post.productCategory.map((cat, ci) => {
                cats.push(cat.slug)
            })
        }

        if (post.title)
            postForExport.title = post.title.fa; // add a field
        postForExport.type = post.type; // add a field
        // postForExport.combinations = post.combinations; // add a field
        if (post.type == "variable") {
            // postForExport.price=[];
            // postForExport.salePrice=[];
            // postForExport.in_stock=[];
            // postForExport.quantity=[];
            // allpros.pop();
            post.combinations.map((com, i) => {
                allpros.push({
                    _id: post._id,
                    slug: postForExport.slug,
                    title: postForExport.title,
                    // description: post && post.description && post.description.fa,
                    category: cats,
                    category1: post.productCategory[0] ? post.productCategory[0]?.name?.fa : '',
                    category2: post.productCategory[1] ? post.productCategory[1]?.name?.fa : '',
                    category3: post.productCategory[2] ? post.productCategory[2]?.name?.fa : '',
                    price: com.price,
                    salePrice: com.salePrice,
                    in_stock: com.in_stock,
                    quantity: com.quantity,
                    type: post.type,
                    options: com.options ? Object.values(com.options).toString() : "",
                    combination_id: (i + 1)
                });
            });
        } else {
            allpros.push({
                _id: post._id,
                slug: post.slug,
                title: postForExport.title,
                // description: post && post.description && post.description.fa,
                category1: post.productCategory[0] ? post.productCategory[0]?.name?.fa : '',
                category2: post.productCategory[1] ? post.productCategory[1]?.name?.fa : '',
                category3: post.productCategory[2] ? post.productCategory[2]?.name?.fa : '',

                category: cats,
                price: post.price,
                salePrice: post.salePrice,
                in_stock: post.in_stock,
                quantity: post.quantity,
                type: post.type
            });
        }
    });
    jsonExport(allpros, {
        headers: ["_id", "slug", "title", "description", "category", "type", "price", "salePrice", "in_stock", "quantity"] // order fields in the export
    }, (err, csv) => {
        const BOM = "\uFEFF";
        downloadCSV(`${BOM} ${csv}`, "products"); // download as 'posts.csv` file
    });
};


const ListActions = (props) => {
    let {basePath, data, resource, toggleImportModal, importModal, setOpen, setOpenSettingModal} = props;

    const t = useTranslate();
    const [setting, setSetting] = useState(false);

    return (
        <TopToolbar>
            {/*<FilterButton/>*/}
            <CreateButton/>
            <Button
                onClick={() => {
                    setSetting(true)
                }}
                size={"small"}
            >
                <SettingsIcon/>
            </Button>
            {setting && <Modal
                open={setting}
                onClose={(e, r) => {
                    console.log("e", e, "r", r)
                    setSetting(!setting)

                }}
                className={'width50vw sdfghyjuikol kiuytgfhjuyt modal modal-b'}>
                <Card className={'modal-b-indside'}>
                    <ExportButton maxResults={3000}/>
                    {/*<CreateButton basePath={basePath} />*/}
                    {/*<ImportButton {...props} {...config} />*/}
                    {/*<ProductRewriteButton record={data}/>*/}
                    {/* Add your custom actions */}

                    <Button
                        onClick={() => {
                            // alert('Your custom action');
                            toggleImportModal(!importModal)
                            setSetting(false)

                        }}
                        label={t("resources.product.import")}
                        size={"small"}
                    >
                        <FileUploadIcon/><span>{t("resources.product.import")}</span>
                    </Button>
                    <Button
                        onClick={() => {
                            setOpen(true)
                            setSetting(false)
                        }}
                        label={t("resources.product.deleteAllProduct")}
                        size={"small"}
                    >
                        <DeleteForeverIcon/><span>{t("resources.product.deleteAllProduct")}</span>
                    </Button>
                    <Button
                        onClick={() => {
                            setOpenSettingModal(true)
                            setSetting(false)

                        }}
                        label={t("resources.product.settings")}
                        size={"small"}
                    >
                        <SettingsIcon/><span>{t("resources.product.settings")}</span>
                    </Button>
                </Card>
            </Modal>}

        </TopToolbar>
    );
};

const TabbedDatagrid = (props) => {
    const listContext = useListContext();
    const {ids, filterValues, setFilters, displayedFilters} = listContext;
    const classes = useDatagridStyles();
    const t = useTranslate();

    const [cart, setCart] = useState([]);
    const [checkout, setCheckout] = useState([]
    );
    const [processing, setProcessing] = useState([]
    );
    const themeData = useSelector((st) => st.themeData);
    const totals = 0;

    useEffect(() => {
        if (ids && ids !== filterValues.status) {
            switch (filterValues.status) {
                case "published":
                    console.log("ids", ids);
                    setCart(ids);
                    break;
                case "draft":
                    setCheckout(ids);
                    break;
                case "processing":
                    setProcessing(ids);
                    break;
                default:
                    setCart("published");

            }
        }
    }, [ids, filterValues.status]);

    const handleChange = useCallback(
        (event, value) => {
            setFilters &&
            setFilters(
                {...filterValues, status: value},
                displayedFilters
            );
        },
        [displayedFilters, filterValues, setFilters]
    );
    const handleSelect = useCallback(
        (e, v) => {
            console.log('e', e)
            console.log('v', v?.props?.value)

            setFilters({...filterValues, status: v?.props?.value}, displayedFilters);
        },
        [displayedFilters, filterValues, setFilters]
    );
    const selectedIds =
        filterValues.status === "published"
            ? cart
            : filterValues.status === "draft"
            ? checkout
            : cart;
// console.log('filterValues.status',filterValues.status);
    if (!filterValues.status) {
        filterValues.status = "published";
    }
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

    return (
        <Fragment>
            {isSmall ? (<Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterValues.status}
                label={t('resources.order.status')}
                onChange={handleSelect}
            >{tabs.map((choice) => (<MenuItem key={choice.id} value={choice.id}>{totals[choice.name]
                ? `${choice.name} (${totals[choice.name]})`
                : choice.name}</MenuItem>))}
            </Select>) : (<Tabs
                variant="fullWidth"
                centered
                value={filterValues.status}
                indicatorColor="primary"
                onChange={handleChange}
            >
                {tabs.map(choice => (
                    <Tab
                        key={choice.id}
                        label={
                            totals[choice.name]
                                ? `${choice.name} (${totals[choice.name]})`
                                : choice.name
                        }
                        value={choice.id}
                    />
                ))}
            </Tabs>)}
            <Divider/>

            <div className={'product-list-in-mobile'}>
                {/*{filterValues.status === 'cart' && (*/}
                <ListContextProvider
                    value={{...listContext, ids: cart}}
                >
                    {isSmall ? (
                        <SimpleList
                            primaryText={record => <div>
                                <div className={"d-dfgfd"}>
                                    <span>
                                    <SimpleImageField label={t("resources.product.image")}/>
                                    </span>
                                    <span className={'gap-10'}>
                                           <div className={"categories"}>
                                                   {record.productCategory && record.productCategory.map((item, it) =>
                                                       <div>
                                                           <ChipField source={"productCategory[" + it + "].slug"}
                                                                      label={item.slug}
                                                                      sortable={false}/>
                                                       </div>)}

                                               </div>
                                    </span>
                                </div>

                            </div>}
                            secondaryText={record => <div>
                                <div className={'d-flex flex-dir-col align-items-start'}>
                                    <ShowLink source={"title." + t("lan")}
                                              label={t("resources.product.title")}
                                              sortable={false}/>
                                    <br/>
                                    <TextField source={"slug"}/>
                                    <FunctionField label={t("resources.product.prices")}
                                                   render={record => {
                                                       let tt = t("resources.product.outOfStock"), thecl = "erro";

                                                       if (record.type == "variable") {
                                                           if (record.combinations) {
                                                               record.combinations.map((comb, key) => {
                                                                   if (comb.in_stock == true) {
                                                                       tt = t("resources.product.stock");
                                                                       thecl = "succ";
                                                                   }
                                                               });
                                                               return (
                                                                   <div className={"stockandprice " + thecl}>

                                                                       <div className='theDate hoverparent'>
                                                                           <Chip className={thecl} label={tt}/>
                                                                           <div className='theDate thehover'>
                                                                               {record.combinations.map((comb, key) => {
                                                                                   return (<div
                                                                                       className={"cobm flex-d cobm" + key}
                                                                                       key={key}>
                                                                                       <div className={"flex-1"}>
                                                                                           {comb.options && <div
                                                                                               className={""}>{Object.keys(comb.options).map((item, index) => {
                                                                                               return <div
                                                                                                   key={index}>{(item) + " : " + comb.options[item] + "\n"}</div>;

                                                                                           })}</div>}
                                                                                       </div>
                                                                                       <div className={"flex-1"}>

                                                                                           {comb.price &&
                                                                                           <div className={"FDFD"}>
                                                                                               <span>{t("resources.product.price")}</span><span>{comb.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                                                           </div>}
                                                                                       </div>
                                                                                       <div className={"flex-1"}>

                                                                                           {comb.salePrice &&
                                                                                           <div className={"vfdsf"}>
                                                                                               <span>{t("resources.product.salePrice")}</span><span>{comb.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                                                           </div>}
                                                                                       </div>
                                                                                       <div className={"flex-1"}>

                                                                                           {comb.in_stock &&
                                                                                           <div className={""}>
                                                                                               <span>{(comb.in_stock == true ? t("resources.product.inStock") : t("resources.product.outOfStock"))}</span>
                                                                                           </div>}
                                                                                       </div>
                                                                                       <div className={"flex-1"}>

                                                                                           {comb.quantity &&
                                                                                           <div className={""}>
                                                                                               <span>{comb.quantity}</span>
                                                                                           </div>}
                                                                                       </div>
                                                                                   </div>);
                                                                               })}
                                                                           </div>
                                                                       </div>
                                                                   </div>
                                                               );

                                                           }

                                                       } else {
                                                           if (record.in_stock == true) {
                                                               tt = t("resources.product.inStock");
                                                               thecl = "succ";
                                                           }
                                                           return (<div className={"cobm flex-d cobm no-border"}>
                                                               <div>
                                                                   {record.price && <div className={"flex-1"}>
                                                                       <span>{t("resources.product.price")}:</span><span>{record.price && record.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                                   </div>}
                                                                   {record.salePrice && <div className={"flex-1"}>
                                                                       <span>{t("resources.product.salePrice")}:</span><span>{record.salePrice && record.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                                   </div>}
                                                               </div>
                                                               <div>
                                                                   <div className={"flex-1"}>

                                                                       <span>{t("resources.product.stock")}:</span><Chip
                                                                       className={thecl}
                                                                       label={tt}></Chip><span></span>
                                                                   </div>
                                                                   <div className={"flex-1"}>
                                                                       <span>{t("resources.product.count")}:</span><span>{record.quantity}</span>
                                                                   </div>
                                                               </div>
                                                           </div>);

                                                       }

                                                   }}/>

                                </div>
                                <div className="ph">
                                    <div className={'d-flex asdfss'}>
                                        <div className={'d-flex-child'}>
                                            <Link
                                                className={"link-with-icon"}
                                                rel="noopener noreferrer"
                                                to={'/product/' + record._id}>
                                                <EditIcon/>
                                                <span className={'ml-2 mr-2'}>
                                        {t('resources.page.edit')}
                                    </span>
                                            </Link>
                                        </div>
                                        <div>
                                            <Button
                                                color="primary"
                                                size="small"
                                                onClick={() => {
                                                    // console.log('data', record._id);
                                                    API.post('/product/copy/' + record._id, null)
                                                        .then(({data = {}}) => {
                                                            // console.log('data', data._id);
                                                            props.history.push('/post/' + data._id);
                                                            // ale/rt('done');
                                                        })
                                                        .catch((err) => {
                                                            console.log('error', err);
                                                        });
                                                }}>
                                                <ContentCopyIcon/>
                                                <span className={'ml-2 mr-2'}>
                    {t('resources.page.copy')}
                  </span>
                                            </Button>
                                        </div>
                                        <div>
                                            <Link
                                                to={
                                                    '/action?filter=%7B%page"%3A"' +
                                                    record._id +
                                                    '"%7D&order=ASC&product=1&perPage=10&sort=id/'
                                                }
                                                className={"link-with-icon"}
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                <PendingActionsIcon/>
                                                <span className={'ml-2 mr-2'}>
                    {t('resources.page.activities')}
                  </span>
                                            </Link>
                                        </div>
                                        {/*<div>*/}
                                        {/*<DeleteButton/>*/}
                                        {/*</div>*/}
                                    </div>

                                </div>
                            </div>}
                            // tertiaryText={record => }
                            linkType={false}
                        />
                    ) : (<Datagrid optimized
                        // rowStyle={postRowStyle}
                    >
                        <SimpleImageField label={t("resources.product.image")}/>
                        <FunctionField label={t("resources.product.categories")}
                                       render={record => {
                                           return <><ShowLink source={"title." + t("lan")}
                                                              label={t("resources.product.title")}
                                                              sortable={false}/>
                                               <br/>
                                               <TextField source={"slug"}/>
                                           </>;
                                       }}/>
                        {/*<CustomTextInput source="description.fa" label="description" sortable={false}/>*/}

                        <FunctionField label={t("resources.product.categories")}
                                       render={record => {


                                           return (
                                               <div className={"categories"}>
                                                   {record.productCategory && record.productCategory.map((item, it) =>
                                                       <div>
                                                           <ChipField source={"productCategory[" + it + "].slug"}
                                                                      label={item.slug}
                                                                      sortable={false}/>
                                                       </div>)}

                                               </div>
                                           );
                                       }}/>

                        {/*<NumberField source="price" label="قیمت" sortable={false}/>*/}
                        {/*<TextInput source="title.fa" label="Title" value="title.fa"/>*/}
                        {/*<NumberField source="salePrice" label="قیمت تخفیف خورده" sortable={false}/>*/}
                        {/*<BooleanField source="in_stock" label="موجودی"/>*/}
                        {/*<NumberField source="quantity" label="مقدار" sortable={false}/>*/}
                        {/*<FunctionField label="نوع"*/}
                        {/*render={record => `${record.combinations && record.combinations.length ? 'مادر' : 'ساده'}`}/>*/}
                        {/*<FileChips source="photos" sortable={false}/>*/}
                        <FunctionField label={t("resources.product.prices")}
                                       render={record => {
                                           let tt = t("resources.product.outOfStock"), thecl = "erro";

                                           if (record.type == "variable") {
                                               if (record.combinations) {
                                                   record.combinations.map((comb, key) => {
                                                       if (comb.in_stock == true) {
                                                           tt = t("resources.product.stock");
                                                           thecl = "succ";
                                                       }
                                                   });
                                                   return (
                                                       <div className={"stockandprice " + thecl}>

                                                           <div className='theDate hoverparent'>
                                                               <Chip className={thecl} label={tt}/>
                                                               <div className='theDate thehover'>
                                                                   {record.combinations.map((comb, key) => {
                                                                       return (<div className={"cobm flex-d cobm" + key}
                                                                                    key={key}>
                                                                           <div className={"flex-1"}>
                                                                               {comb.options && <div
                                                                                   className={""}>{Object.keys(comb.options).map((item, index) => {
                                                                                   return <div
                                                                                       key={index}>{(item) + " : " + comb.options[item] + "\n"}</div>;

                                                                               })}</div>}
                                                                           </div>
                                                                           <div className={"flex-1"}>

                                                                               {comb.price && <div className={"FDFD"}>
                                                                                   <span>{t("resources.product.price")}</span><span>{comb.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                                               </div>}
                                                                           </div>
                                                                           <div className={"flex-1"}>

                                                                               {comb.salePrice &&
                                                                               <div className={"vfdsf"}>
                                                                                   <span>{t("resources.product.salePrice")}</span><span>{comb.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                                               </div>}
                                                                           </div>
                                                                           <div className={"flex-1"}>

                                                                               {comb.in_stock && <div className={""}>
                                                                                   <span>{(comb.in_stock == true ? t("resources.product.inStock") : t("resources.product.outOfStock"))}</span>
                                                                               </div>}
                                                                           </div>
                                                                           <div className={"flex-1"}>

                                                                               {comb.quantity &&
                                                                               <div className={""}>
                                                                                   <span>{comb.quantity}</span>
                                                                               </div>}
                                                                           </div>
                                                                       </div>);
                                                                   })}
                                                               </div>
                                                           </div>
                                                       </div>
                                                   );

                                               }

                                           } else {
                                               if (record.in_stock == true) {
                                                   tt = t("resources.product.inStock");
                                                   thecl = "succ";
                                               }
                                               return (<div className={"cobm flex-d cobm"}>
                                                   <div>
                                                       {record.price && <div className={"flex-1"}>
                                                           <span>{t("resources.product.price")}:</span><span>{record.price && record.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                       </div>}
                                                       {record.salePrice && <div className={"flex-1"}>
                                                           <span>{t("resources.product.salePrice")}:</span><span>{record.salePrice && record.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                       </div>}
                                                   </div>
                                                   <div>
                                                       <div className={"flex-1"}>

                                                           <span>{t("resources.product.stock")}:</span><Chip
                                                           className={thecl}
                                                           label={tt}></Chip><span></span>
                                                       </div>
                                                       <div className={"flex-1"}>
                                                           <span>{t("resources.product.count")}:</span><span>{record.quantity}</span>
                                                       </div>
                                                   </div>
                                               </div>);

                                           }

                                       }}/>


                        <FunctionField label={t("resources.product.date")}
                                       render={record => (
                                           <div className='theDate'>
                                               <div>
                                                   {t("resources.product.createdAt") + ": " + `${dateFormat(record.createdAt)}`}
                                               </div>
                                               <div>
                                                   {t("resources.product.updatedAt") + ": " + `${dateFormat(record.updatedAt)}`}
                                               </div>

                                               {record.views && <div>
                                                   {t("resources.product.viewsCount") + ": " + `${(record.views.length)}`}
                                               </div>}
                                           </div>
                                       )}/>

                        <FunctionField label={t("resources.product.edit")}
                                       render={record => (
                                           <>
                                               <div>
                                                   <EditButton label={"resources.product.edit"}/>
                                               </div>
                                               {/*<EditButton label={"resources.product.content"} key={'11'}/>,*/}
                                               {/*<ShowButton label={"resources.product.analytics"} key={'22'}/>,*/}
                                               <div>
                                                   <Button
                                                       color="primary"
                                                       size="small"
                                                       onClick={() => {
                                                           // console.log('data', record._id);
                                                           API.post("/product/copy/" + record._id, null)
                                                               .then(({data = {}}) => {
                                                                   // console.log('data', data._id);
                                                                   props.history.push("/product/" + data._id);
                                                                   // ale/rt('done');
                                                               })
                                                               .catch((err) => {
                                                                   console.log("error", err);
                                                               });
                                                       }}>
                                                       <ContentCopyIcon/><span
                                                       className={"ml-2 mr-2"}>{t("resources.product.copy")}</span>

                                                   </Button>
                                               </div>
                                               <div>
                                                   <a
                                                       href={"/#/action?filter=%7B%22product\"%3A\"" + record._id + "\"%7D&order=ASC&page=1&perPage=10&sort=id/"}
                                                       target={"_blank"}
                                                       color="primary"
                                                       size="small"
                                                       onClick={() => {

                                                       }}>
                                                       <PendingActionsIcon/><span
                                                       className={"ml-2 mr-2"}>{t("resources.product.activities")}</span>

                                                   </a>
                                               </div>
                                           </>
                                       )}/>

                    </Datagrid>)}

                </ListContextProvider>
                {isSmall && <div style={{height: '70px'}}></div>}
            </div>

        </Fragment>
    );
};

const useDatagridStyles = makeStyles({
    total: {fontWeight: "bold"}
});
const PostEditToolbar = () => (
    <Toolbar>
    </Toolbar>
);

const tabs = [
    {id: "published", name: "منتشر شده"},
    {id: "processing", name: "در دست بررسی"},
    {id: "draft", name: "پیش نویس"}
];

const list = (props) => {

    // console.log('props', props);
    const t = useTranslate();
    const refresh = useRefresh();

    const [importModal, toggleImportModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [openSettingModal, setOpenSettingModal] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [loadImport, setLoadImport] = useState(false);
    const [updateType, setUpdateType] = useState('percentage'); // 'percentage' or 'constant'
    const [updateValue, setUpdateValue] = useState('');
    const [operation, setOperation] = useState('add'); // 'add' or 'subtract'
    const [isChecked, setIsChecked] = useState(false);
    const [productCount, setProductCount] = useState(0); // State to store product count
    const totals = 0;

    const handlePriceUpdate = async () => {
        if (!updateValue || isNaN(updateValue)) {
            alert(t('Invalid value'));
            return;
        }

        try {
            const response = await API.post(`/product/updateAllPrices`, JSON.stringify({
                updateType,
                value: parseFloat(updateValue),
                operation, // Add operation (add or subtract)
                updateSalePrice:isChecked,  // Include the isChecked state in the request
            }));

            if (response.status === 200) {
                alert(t('Prices updated successfully'));
            } else {
                alert(t('Failed to update prices'));
            }
        } catch (error) {
            console.error('Error updating prices:', error);
            alert(t('An error occurred'));
        }
    };

    const handleUpload = (files) => {
        console.log("handleUpload files", files)
        let file = files[0];

        if (!file) return;
        // setLoading(true);
        setLoadImport(true);
        let formData = new FormData();
        formData.append('file', file);
        formData.append('type', file.type);
        API.post('/product/importFromExcel', formData, {
            onUploadProgress: (e) => {
                let p = Math.floor((e.loaded * 100) / e.total);
                console.log("p", p)
                // setProgress(p);
            },
        }).then((p) => {
            // setLoading(false);
            setLoadImport(false);
            toggleImportModal(false)
            refresh();

            // handleNotif('resources.settings.logoUploadedSuccessfully');
        }).catch(e => {
            setLoadImport(false);

        });
    };
    const handleDialogClose = () => {
        setLoadImport(false);
        setOpen(false)
    }
    const handleConfirm = () => {
        console.log("handleConfirm")
        setIsPending(true);

        API.post('/product/deleteAll').then((p) => {
            // setLoading(false);
            setIsPending(false);

            setOpen(false);
            // window.location.reload();
            refresh();

            // handleNotif('resources.settings.logoUploadedSuccessfully');
        });
    };

    return (
        <>
            <List  {...props} filters={<PostFilter/>} pagination={<PostPagination/>}
                   actions={<ListActions setOpen={setOpen} setOpenSettingModal={setOpenSettingModal} open={open}
                                         toggleImportModal={toggleImportModal}
                                         importModal={importModal}/>}
                   exporter={exporter}>
                <TabbedDatagrid/>
            </List>
            <Modal
                open={importModal}
                onClose={(e, r) => {
                    console.log("e", e, "r", r)
                    toggleImportModal(!importModal)
                    setLoadImport(false)
                }}
                className={'width50vw sdfghyjuikol kiuytgfhjuyt modal'}>
                <Card>
                    <Create>
                        <SimpleForm toolbar={<PostEditToolbar/>}>
                            <FileInput
                                name={'file'}
                                onChange={(e) => {
                                    console.log("e", e)
                                }}
                                source={'file'}
                                type={'file'}
                                // accept={'*'}
                                onBlur={() => {
                                    console.log("hi")
                                }}

                                options={{
                                    onDrop: (e) => handleUpload(e)
                                }}>
                                <FileField
                                    source="src"
                                    title="title"
                                />
                            </FileInput>
                            {loadImport && <><CircularProgress/></>}
                        </SimpleForm>
                    </Create>
                </Card>
            </Modal>
            <Modal
                open={openSettingModal}
                onClose={(e, r) => {
                    console.log("e", e, "r", r)
                    setOpenSettingModal(!openSettingModal)
                    setLoadImport(false)
                }}
                className={'width50vw sdfghyjuikol kiuytgfhjuyt modal'}>
                <Card className={'update-price-box '+t('direction')}>
                    <div className="style-123">

                        <Select
                            value={updateType}
                            onChange={(e) => setUpdateType(e.target.value)}
                            fullWidth
                            style={{marginBottom: '16px'}}
                        >
                            <MenuItem value="percentage">{t('resources.product.Percentage')}</MenuItem>
                            <MenuItem value="constant">{t('resources.product.Constant')}</MenuItem>
                        </Select>
                        <MuiTextField
                            type="number"
                            className={"ltr"}
                            label={t('resources.product.Value')}
                            value={updateValue}
                            onChange={(e) => setUpdateValue(e.target.value)}
                            fullWidth
                            style={{marginBottom: '16px'}}
                        />
                        <Select
                            value={operation}
                            onChange={(e) => setOperation(e.target.value)}
                            fullWidth
                            style={{marginBottom: '16px'}}
                        >
                            <MenuItem value="add">{t('resources.product.Add')}</MenuItem>
                            <MenuItem value="subtract">{t('resources.product.Subtract')}</MenuItem>
                        </Select>

                        {operation === 'subtract' && (
                            <div><FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isChecked}
                                        onChange={(e) => setIsChecked(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={t('resources.product.UpdateSalePriceBasedOnPrice')}
                            /></div>
                        )}
                        <Button variant="contained" color="primary" onClick={handlePriceUpdate}>
                            {t('resources.product.updatePrices')}
                        </Button>
                        {loadImport && <><CircularProgress/></>}
                    </div>
                </Card>
            </Modal>
            <Confirm
                isOpen={open}
                loading={isPending}
                title={t("resources.product.deleteAllProduct")}
                content={t("resources.product.deleteQuestion")}
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </>
    );
};

export default list;
