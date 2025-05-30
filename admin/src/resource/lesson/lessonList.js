import {
    ChipField,
    CreateButton,
    Datagrid,
    downloadCSV,
    EditButton,
    ExportButton,
    Filter,
    FunctionField,
    ListContextProvider,
    Pagination,
    SearchInput,
    SimpleList,
    TextField,
    TopToolbar,
    useListContext,
    Link,
    useTranslate
} from "react-admin";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import EditIcon from '@mui/icons-material/Edit';
import {ImportButton} from "react-admin-import-csv";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// import ProductRewriteButton from "@/components/ProductRewriteButton";

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
import {Button, Chip, Divider, Tab, Tabs, useMediaQuery} from "@mui/material";

import React, {Fragment, useCallback, useEffect, useState} from "react";
import {makeStyles} from "@mui/styles/index";
import {useSelector} from "react-redux";


const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />;


const postRowStyle = (record, index) => {
    // const classes = useStyles();
    // console.log('useStyles',classes.lessonItem);
    return ({
        backgroundColor: record.type === "variable" ? "#9f9f9f" : "#fbe4ff"
    });
};


const PostFilter = (props) => {
    const t = useTranslate();

    return (
        <Filter {...props}>
            {/*<TextInput label="Search" source="search" alwaysOn/>*/}
            <SearchInput source="Search" placeholder={t("resources.lesson.search")} alwaysOn/>
            {/*<ReferenceField label="Category" source="user_id" reference="category">*/}
            {/*<SearchInput source="category" placeholder={t('resources.lesson.category')} alwaysOn/>*/}
            {/*</ReferenceField>*/}
            {/*<ReferenceInput perPage={1000} label={t("resources.lesson.category")} source="category"*/}
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
        if (post.lessonCategory) {
            post.lessonCategory.map((cat, ci) => {
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
                    description: post && post.description && post.description.fa,
                    category: cats,
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
                description: post && post.description && post.description.fa,
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
        downloadCSV(`${BOM} ${csv}`, "lessons"); // download as 'posts.csv` file
    });
};


const ListActions = (props) => {
    let {basePath, data, resource} = props;
    // All configuration options are optional
    const config = {
        // Enable logging
        logging: true,
        // Disable "import new" button
        // disableImportNew: false,
        // Disable "import overwrite" button
        // disableImportOverwrite: false,
        // // A function to translate the CSV rows on import
        // preCommitCallback?: (action: "create" | "overwrite", values: any[]) => Promise<any[]>;
        // // A function to handle row errors after import
        // postCommitCallback?: (error: any) => void;
        // Transform rows before anything is sent to dataprovider
        transformRows: (csvRows) => {
            console.log("csvRows", csvRows);
            // let update = [], create = [];
            let array = [];
            const postsForExport = csvRows.map(row => {
                console.log("row", row);

                row._id = row[" _id"];
                if (row._id)
                    array.push({
                        _id: row._id
                    });
                // else
                // delete row.photos;
                delete row[" _id"];
                delete row["id"];
                delete row.firstCategory_name_ru;
                delete row.secondCategory_name_ru;
                delete row.thirdCategory_name_ru;
                row.title = {
                    en: row.title_en,
                    fa: row.title_fa,
                    ru: row.title_ru,
                    uz: row.title_uz
                };
                delete row.title_en;
                delete row.title_ru;
                delete row.title_uz;
                delete row.createdAt;
                delete row.updatedAt;
                // if (row._id) {
                //     update.push(row);
                // } else {
                //     create.push(row);
                // }
                // if()

                return row;
            });
            console.log("ForImport", postsForExport);
            // API.post('/lesson/importlessonsfromcsv', JSON.stringify(postsForExport))
            //     .then(({data = {}}) => {
            // const refresh = useRefresh();
            // refresh();
            // alert('it is ok');
            // window.location.reload();
            // if (data.success) {
            //     values = [];
            //     valuess = [];
            // }
            // })
            // .catch((err) => {
            //     console.log('error', err);
            // });
        },
        validateRow: async (row) => {
            console.log("row", row);
            if (row.id) {
                // throw new Error("AAAA");
            }
        },
        postCommitCallback: reportItems => {
            console.log("reportItems", {reportItems});
        },
        // Async function to Validate a row, reject the promise if it's not valid
        parseConfig: {
            dynamicTyping: true
            // complete: function(results, file) {
            //     console.log("Parsing complete:", results, file);
            // },
            // preview:1
        }
    };
    return (
        <TopToolbar>
            {/*<FilterButton/>*/}
            <CreateButton/>
            <ExportButton maxResults={3000}/>
            {/*<CreateButton basePath={basePath} />*/}
            <ImportButton {...props} {...config} />
            {/*<ProductRewriteButton record={data}/>*/}
            {/* Add your custom actions */}

            {/*<Button*/}
            {/*onClick={() => {*/}
            {/*alert('Your custom action');*/}
            {/*}}*/}
            {/*label="Show calendar"*/}
            {/*>*/}
            {/*<IconEvent/>*/}
            {/*</Button>*/}
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

            <div>
                {/*{filterValues.status === 'cart' && (*/}
                <ListContextProvider
                    value={{...listContext, ids: cart}}
                >
                    {isSmall ? (
                        <SimpleList
                            primaryText={record => <div>
                                <div className={"d-dfgfd"}>
                                    <span >
                                    <SimpleImageField label={t("resources.lesson.image")}/>
                                    </span>
                                    <span className={'gap-10'}>
                                           <div className={"categories"}>
                                                   {record.lessonCategory && record.lessonCategory.map((item, it) =>
                                                       <div>
                                                           <ChipField source={"lessonCategory[" + it + "].slug"}
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
                                            label={t("resources.lesson.title")}
                                            sortable={false}/>
                                    <br/>
                                    <TextField source={"slug"}/>

                                 </div>
                                <div className="ph">
                                    <div className={'d-flex'}>
                                        <div  className={'d-flex-child'}>
                                            <Link
                                                className={"link-with-icon"}
                                                rel="noopener noreferrer"
                                                to={'/lesson/' + record._id}>
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
                                                    API.post('/lesson/copy/' + record._id, null)
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
                                                    '"%7D&order=ASC&lesson=1&perPage=10&sort=id/'
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
                        <FunctionField label={t("resources.lesson.title")}
                                       render={record => {
                                           return <>
                                               <TextField source={"title.fa"}/>

                                               <br/>
                                               <TextField source={"secondTitle.fa"}/>
                                           </>;
                                       }}/>

                        <FunctionField label={t("resources.lesson.date")}
                                       render={record => (
                                           <div className='theDate'>
                                               <div>
                                                   {t("resources.lesson.createdAt") + ": " + `${dateFormat(record.createdAt)}`}
                                               </div>
                                               <div>
                                                   {t("resources.lesson.updatedAt") + ": " + `${dateFormat(record.updatedAt)}`}
                                               </div>

                                               {record.views && <div>
                                                   {t("resources.lesson.viewsCount") + ": " + `${(record.views.length)}`}
                                               </div>}
                                           </div>
                                       )}/>

                        <FunctionField label={t("resources.lesson.edit")}
                                       render={record => (
                                           <>
                                               <div>
                                                   <EditButton label={"resources.lesson.edit"}/>
                                               </div>
                                               {/*<EditButton label={"resources.lesson.content"} key={'11'}/>,*/}
                                               {/*<ShowButton label={"resources.lesson.analytics"} key={'22'}/>,*/}
                                               <div>
                                                   <Button
                                                       color="primary"
                                                       size="small"
                                                       onClick={() => {
                                                           // console.log('data', record._id);
                                                           API.post("/lesson/copy/" + record._id, null)
                                                               .then(({data = {}}) => {
                                                                   // console.log('data', data._id);
                                                                   props.history.push("/lesson/" + data._id);
                                                                   // ale/rt('done');
                                                               })
                                                               .catch((err) => {
                                                                   console.log("error", err);
                                                               });
                                                       }}>
                                                       <ContentCopyIcon/><span
                                                       className={"ml-2 mr-2"}>{t("resources.lesson.copy")}</span>

                                                   </Button>
                                               </div>
                                               {/*<div>*/}
                                                   {/*<a*/}
                                                       {/*href={"/#/action?filter=%7B%22lesson\"%3A\"" + record._id + "\"%7D&order=ASC&page=1&perPage=10&sort=id/"}*/}
                                                       {/*target={"_blank"}*/}
                                                       {/*color="primary"*/}
                                                       {/*size="small"*/}
                                                       {/*onClick={() => {*/}

                                                       {/*}}>*/}
                                                       {/*<PendingActionsIcon/><span*/}
                                                       {/*className={"ml-2 mr-2"}>{t("resources.lesson.activities")}</span>*/}

                                                   {/*</a>*/}
                                               {/*</div>*/}
                                           </>
                                       )}/>

                    </Datagrid>)}

                </ListContextProvider>

            </div>

        </Fragment>
    );
};

const useDatagridStyles = makeStyles({
    total: {fontWeight: "bold"}
});

const tabs = [
    {id: "published", name: "منتشر شده"},
    {id: "processing", name: "در دست بررسی"},
    {id: "draft", name: "پیش نویس"}
];

const list = (props) => {

    // console.log('props', props);
    const t = useTranslate();

    return (

        <List  {...props} filters={<PostFilter/>} pagination={<PostPagination/>} actions={<ListActions/>}
               exporter={exporter}>
            <TabbedDatagrid/>
        </List>
    );
};

export default list;
