import {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Box, Card, CardActions, CircularProgress} from '@mui/material';
import {Form, ImageField, ImageInput, SaveButton, TextInput, useNotify, useTranslate,} from 'react-admin';

import API from '@/functions/API';
import {ColorPicker, ShowImageField} from '@/components';

export default function Configuration(props) {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            primaryColor: '#ee811d',
            secondaryColor: '#2d3488',
            textColor: '#000000',
            bgColor: '#ffffff',
            addToCartTextColor: '#ffffff',
            addToCartColor: '#ffffff',
            addToCartHoverColor: '#ffffff',
            footerBgColor: '#ffffff',
        },
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

    const [loading, setLoading] = useState(false);
    // const [color, setColor] = useState({
    //   primaryColor: "#ee811d",
    //   secondaryColor: "#2d3488",
    //   textColor: "#000000",
    //   bgColor: "#ffffff",
    //   footerBgColor: "#ffffff"
    // });

    const [theData, setTheData] = useState(false);
    const translate = useTranslate();
    const notify = useNotify();

    const lan = translate('lan');

    const setTheColor = (t, e) => {
        setValue(t, e);
    };

    const handleNotif = (t, type = 'success') => {
        notify(t, {type: type});
    };
    const handleUpload = (files) => {
        let file = files[0];

        if (!file) return;
        setLoading(true);
        let formData = new FormData();
        formData.append('file', file);
        formData.append('type', file.type);
        API.post('/settings/fileUpload', formData, {
            onUploadProgress: (e) => {
                // let p = Math.floor((e.loaded * 100) / e.total);
                // setProgress(p);
            },
        }).then((p) => {
            setLoading(false);

            window.location.reload();

            handleNotif('resources.settings.logoUploadedSuccessfully');
        });
    };

    const getData = useCallback(() => {
        setLoading(true);

        API.get('/settings/configuration')
            .then(({data = {}}) => {
                Object.keys(data).forEach((d) => {
                    setValue(d, data[d]);
                });

                setTheData(true);
                return data;
            })
            .catch((e) => {
                setTheData(true);
            })
            .finally(() => setLoading(false));
    }, [setValue]);

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // useEffect(() => {
    //   console.log("theData", theData);

    // setCombs(record);
    // }, [theData]);

    const handleChange = (t, value) => {
        setValue(t, value);
    };

    const onSubmit = (theData) => {
        let jso = {
            logo: theData.logo,
            title: theData.title,
            description: theData.description,
            home: theData.home,
            header_last: theData.header_last,
            body_first: theData.body_first,
            primaryColor: theData.primaryColor,
            addToCartTextColor: theData.addToCartTextColor,
            addToCartColor: theData.addToCartColor,
            addToCartHoverColor: theData.addToCartHoverColor,
            secondaryColor: theData.secondaryColor,
            textColor: theData.textColor,
            bgColor: theData.bgColor,
            footerBgColor: theData.footerBgColor,
        };

        API.put('/settings/configuration', JSON.stringify(jso)).then(
            ({data = {}}) => {
                setLoading(false);
                console.log('data', data);
                if (data.success) handleNotif('resources.settings.UpdatedSuccessfully');
                else handleNotif('resources.settings.sthWrong', 'error');

                return data;
            }
        );
    };

    if (!theData) return <></>;

    let {
        _id,
        logo,
        title = {},
        description = {},
        ADMIN_ROUTE,
        BASE_URL,
        SHOP_URL,
        ADMIN_URL,
        home,
        primaryColor,
        addToCartTextColor,
        addToCartColor,
        addToCartHoverColor,
        secondaryColor,
        bgColor,
        textColor,
        footerBgColor,
        ZIBAL_TOKEN,
        header_last,
        body_first,
    } = getValues();

    return (
        <Form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
            <Box>
                <Card sx={{padding: '1em'}}>
                    <Box>
                        <Box>
                            <div className={'row'}>
                                <div className={'col-md-12 posrel image-wrapd'}>
                                    <label className={'the-label2'}>
                                        {translate('resources.settings.currentLogo')}
                                    </label>
                                    {logo && (
                                        <ShowImageField
                                            photo={logo}
                                            className={'width100'}
                                            deleteFunction={false}
                                        />
                                    )}
                                    <ImageInput
                                        className={'the-label2 show-image-uploader fix-position'}
                                        source={'logo'}
                                        label={false}
                                        accept="image/*"
                                        options={{
                                            onDrop: handleUpload,
                                        }}>
                                        <ImageField source="src" title="title"/>
                                    </ImageInput>
                                </div>

                            </div>

                        </Box>

                        {/*<Box>*/}
                        {/*<ReferenceInput*/}
                        {/*perPage={100}*/}
                        {/*label={translate('resources.settings.home')}*/}
                        {/*source="home"*/}
                        {/*reference="page"*/}
                        {/*alwaysOn>*/}
                        {/*<SelectInput*/}
                        {/*optionText={'title.' + lan}*/}
                        {/*defaultValue={home}*/}
                        {/*onChange={(event) => {*/}
                        {/*handleChange('home', event.target.value);*/}
                        {/*}}*/}
                        {/*/>*/}
                        {/*</ReferenceInput>*/}
                        {/**/}
                        {/*</Box>*/}
                        <Box>
                            <TextInput
                                autoFocus
                                source="header_last"
                                className={'ltr'}
                                multiline
                                label={'header_last'}
                                disabled={loading}
                                // validate={required()}
                                fullWidth
                                defaultValue={header_last}
                                onChange={(event) => {
                                    handleChange('header_last', event.target.value);
                                }}
                            />
                        </Box>
                        <Box>
                            <TextInput
                                autoFocus
                                source="body_first"
                                className={'ltr'}
                                multiline
                                label={'body_first'}
                                disabled={loading}
                                // validate={required()}
                                fullWidth
                                defaultValue={body_first}
                                onChange={(event) => {
                                    handleChange('body_first', event.target.value);
                                }}
                            />
                        </Box>
                        <Box>
                            <div className={'row'}>
                                <div className={'col-md-4'}>
                                    <div className={'color-wrapper'}>

                                        <ColorPicker
                                            className={'input-color'}
                                            source={'primaryColor'}
                                            color={primaryColor}
                                            onChangeComplete={(e) => setTheColor('primaryColor', e)}
                                            placement="right"
                                        />
                                        <label className={'the-label2'}>
                                            {translate('resources.settings.primaryColor')}
                                        </label>
                                    </div>
                                </div>
                                <div className={'col-md-4'}>
                                    <div className={'color-wrapper'}>


                                        <ColorPicker
                                            className={'input-color'}
                                            source={'secondaryColor'}
                                            color={secondaryColor}
                                            onChangeComplete={(e) => setTheColor('secondaryColor', e)}
                                            placement="right"
                                        />
                                        <label className={'the-label2'}>
                                            {translate('resources.settings.secondaryColor')}
                                        </label>
                                    </div>
                                </div>
                                <div className={'col-md-4'}>
                                    <div className={'color-wrapper'}>

                                        <ColorPicker
                                            className={'input-color'}
                                            source={'textColor'}
                                            color={textColor}
                                            onChangeComplete={(e) => setTheColor('textColor', e)}
                                            placement="right"
                                        />

                                        <label className={'the-label2'}>
                                            {translate('resources.settings.textColor')}
                                        </label>
                                    </div>
                                </div>

                            </div>
                            <div className={'row'}>

                                <div className={'col-md-4'}>
                                    <div className={'color-wrapper'}>

                                        <ColorPicker
                                            className={'input-color'}
                                            source={'bgColor'}
                                            color={bgColor}
                                            onChangeComplete={(e) => setTheColor('bgColor', e)}
                                            placement="right"
                                        />

                                        <label className={'the-label2'}>
                                            {translate('resources.settings.bgColor')}
                                        </label>
                                    </div>
                                </div>
                                <div className={'col-md-4'}>
                                    <div className={'color-wrapper'}>


                                        <ColorPicker
                                            className={'input-color'}
                                            source={'footerBgColor'}
                                            color={footerBgColor}
                                            onChangeComplete={(e) => setTheColor('footerBgColor', e)}
                                            placement="right"
                                        />
                                        <label className={'the-label2'}>
                                            {translate('resources.settings.footerBgColor')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className={'col-md-4'}>
                                    <div className={'color-wrapper'}>


                                        <ColorPicker
                                            className={'input-color'}
                                            source={'addToCartTextColor'}
                                            color={addToCartTextColor}
                                            onChangeComplete={(e) => setTheColor('addToCartTextColor', e)}
                                            placement="right"
                                        />
                                        <label className={'the-label2'}>
                                            {translate('resources.settings.addToCartTextColor')}
                                        </label>
                                    </div>
                                </div>
                                <div className={'col-md-4'}>
                                    <div className={'color-wrapper'}>


                                        <ColorPicker
                                            className={'input-color'}
                                            source={'addToCartColor'}
                                            color={addToCartColor}
                                            onChangeComplete={(e) => setTheColor('addToCartColor', e)}
                                            placement="right"
                                        /><label className={'the-label2'}>
                                        {translate('resources.settings.addToCartColor')}
                                    </label>
                                    </div>
                                </div>
                                <div className={'col-md-4'}>
                                    <div className={'color-wrapper'}>

                                        <ColorPicker
                                            className={'input-color'}
                                            source={'addToCartHoverColor'}
                                            color={addToCartHoverColor}
                                            onChangeComplete={(e) => setTheColor('addToCartHoverColor', e)}
                                            placement="right"
                                        />
                                        <label className={'the-label2'}>
                                            {translate('resources.settings.addToCartHoverColor')}
                                        </label>
                                    </div>
                                </div>

                            </div>
                        </Box>
                        <Box>
                            <div style={{height: "400px"}}></div>

                        </Box>
                    </Box>
                    <CardActions sx={{padding: '0 1em 1em 1em'}}>
                        <SaveButton
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            alwaysEnable>
                            {loading && <CircularProgress size={25} thickness={2}/>}
                            {translate('resources.settings.save')}
                        </SaveButton>
                    </CardActions>
                </Card>

            </Box>
        </Form>
    );
}
