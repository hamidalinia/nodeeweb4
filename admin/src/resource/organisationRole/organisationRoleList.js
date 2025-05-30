import {
    BulkDeleteButton,
    Create,
    Datagrid,
    DeleteButton,
    Edit,
    Confirm,


    EditButton,
    Filter,
    FunctionField,
    NumberInput,
    Pagination,
    ReferenceField,
    ReferenceInput,
    ResourceContextProvider,
    SearchInput,
    SelectInput,
    Show,
    ShowButton,
    SimpleShowLayout,
    TopToolbar,
    CreateButton,
    TextField,
    TextInput,
    useResourceContext, useTranslate
} from 'react-admin';
import React, {Fragment,useState} from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import {useParams} from 'react-router';
import {CategoryRounded as Icon, LibraryAdd} from '@mui/icons-material';
import {CustomResetViewsButton, List, SimpleForm} from '@/components';
import useStyles from '@/styles';
import {Val} from '@/Utils';
import API, {BASE_URL} from '@/functions/API';
import {Chip,Button} from '@mui/material';
import {useRefresh} from "react-admin/dist/cjs/index";

var theID = null;
const ResourceName = () => {
    const {resource} = useResourceContext();
    return <>{resource}</>;
}
const PostFilter = (props) => {
    const translate = useTranslate();

    return (
        <Filter {...props}>
            {/*<TextInput label="Search" source="search" alwaysOn/>*/}
            <SearchInput source="Search" placeholder={translate('resources.category.name')} alwaysOn/>
            {/*<SearchInput source="firstCategory" placeholder={'نام'} alwaysOn/>*/}
            {/*<SearchInput source="lastName" placeholder={'نام خانوادگی'} alwaysOn/>*/}
            {/*<SelectInput source="firstCategory" label={'دسته بندی اول'}  emptyValue="" choices={typeChoices4}/>*/}
            {/*<SelectInput source="secondCategory" label={'دسته بندی دوم'}  emptyValue="" choices={typeChoices3}/>*/}
            {/*<SelectInput source="thirdCategory" label={'دسته بندی سوم'}  emptyValue="" choices={typeChoices3}/>*/}

        </Filter>
    );
}
const ListActions = (props) => {
    let {basePath, data, resource, toggleImportModal, importModal, setOpen, open} = props;

    const t = useTranslate();

    return (
        <TopToolbar>
            <CreateButton/>

            <Button
                onClick={() => {
                    setOpen(true)
                }}
                label={t("resources.category.deleteAllProductCategories")}
                size={"small"}
            >
                <DeleteForeverIcon/><span>{t("resources.category.deleteAllProductCategories")}</span>
            </Button>
        </TopToolbar>
    );
};

const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 200, 500]} {...props} />;

const list = (props) => {
    const translate = useTranslate();
    const [open, setOpen] = useState(false);
    const refresh = useRefresh();
    const [isPending, setIsPending] = useState(false);
    const [loadImport, setLoadImport] = useState(false);

    const handleDialogClose = () => {
        setLoadImport(false);
        setOpen(false)
    }
    const handleConfirm = () => {
        console.log("handleConfirm")
        setIsPending(true);

        API.post('/productCategory/deleteAll').then((p) => {
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
        <List {...props}
              actions={<ListActions setOpen={setOpen} open={open}/>}
              filters={<PostFilter/>} pagination={<PostPagination/>}>
            <Datagrid>
                <TextField source={"name."+translate('lan')} label={translate('resources.category.name')}/>
                <TextField source="slug" label={translate('resources.category.slug')}/>
                {/* <TextField source="productCount" label={translate('resources.category.productCount')}/> */}
                {/* <ReferenceField
                    label={translate('resources.category.parent')}
                    source="parent"
                    reference="productCategory">
                    <TextField source={"name."+translate('lan')}/>
                </ReferenceField> */}
                {/*<TextField source="order" label={translate('resources.category.order')}/>*/}
 
                <EditButton/>
                <ShowButton/>
                <DeleteButton/>
            </Datagrid>
        </List>
            <Confirm
                isOpen={open}
                loading={isPending}
                title={translate("resources.category.deleteAllProductCategories")}
                content={translate("resources.product.deleteQuestion")}
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
     </>
    );
}





export default list;
