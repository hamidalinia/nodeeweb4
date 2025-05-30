import { memo } from 'react';
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
  SimpleFormIterator,
  TextInput,
  Toolbar,
  useNotify,
  useRedirect,
  useTranslate,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';
import { Typography, Box } from '@mui/material';

import API from '@/functions/API';
import {
  AtrRefField,
  Combinations,
  EditOptions,
  ProductType,
  SimpleForm,
  StockStatus,
  UploaderField,
} from '@/components';
import { Val } from '@/Utils';

let combs = [];

let valuess = { photos: [], files: [], thumbnail: '', combinations: [] };

function setPhotos(values) {
  // let {values} = useFormState();
  valuess['photos'] = values;
  // setV(!v);
  // this.forceUpdate();
}

function onCreateCombinations(options) {
  let combCount = 1;
  let combinationsTemp = [];
  let combinations = [];
  let counter = 0;
  options.forEach((opt, key) => {
    let optemp = {};
    let theVals = [];
    opt.values.forEach((val, key2) => {
      theVals.push({ [opt.name]: val.name });
    });
    combinationsTemp.push(theVals);
  });

  let ttt = cartesian(combinationsTemp);

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
      quantity: 0,
    });
  });
  // (id, path, rowRecord) => form.change('combinations', combinations)
  combs = combinations;
  return combinations;
}

function cartesian(args) {
  let r = [],
    max = args.length - 1;

  function helper(arr, i) {
    for (let j = 0, l = args[i].length; j < l; j++) {
      let a = arr.slice(0); // clone arr
      a.push(args[i][j]);
      if (i === max) r.push(a);
      else helper(a, i + 1);
    }
  }

  helper([], 0);
  return r;
}

function thel(values) {
  return new Promise((resolve) => {
    valuess['photos'] = values;
    resolve(values);
  });
}

function theP(values) {
  valuess['thumbnail'] = values;
}

function OptsUpdater(datas) {
  valuess['options'] = datas;
}

const CustomToolbar = (props) => {
  const transform = (data, { previousData }) => {
    const values = data;
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

    return values;
  };

  return (
    <Toolbar>
      <SaveButton alwaysEnable transform={transform} />
      <DeleteButton mutationMode="pessimistic" />
    </Toolbar>
  );
};

// interface Props {
//   Resource_Name?: any;
//   record?: an;
//   children: React.ReactNode;
// }

function Form({ children = undefined, record, Resource_Name }) {
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();

  if (record && record.photos) valuess.photos = record.photos;
  if (record && record.thumbnail) valuess.thumbnail = record.thumbnail;

  function save(values) {
    if (valuess.firstCategory) values.firstCategory = valuess.firstCategory;
    if (valuess.secondCategory) values.secondCategory = valuess.secondCategory;
    if (valuess.thirdCategory) values.thirdCategory = valuess.thirdCategory;
    if (valuess.thumbnail) values.thumbnail = valuess.thumbnail;
    if (valuess.photos) values.photos = valuess.photos;
    if (valuess.requireWarranty)
      values.requireWarranty = valuess.requireWarranty;

    if (record?._id?.length > 0) {
      // delete values.photos;
      delete values.questions;
      delete values.nextproduct;
      delete values.category;
      delete values.catChoosed;
      delete values.files;
      API.put(`/${Resource_Name}/${record._id}`, JSON.stringify({ ...values }))
        .then(({ data = {} }) => {
          notify('saved');
          if (data) {
            values = [];
            // @ts-ignore
            valuess = {};
            redirect(`/${Resource_Name}`);
          }
        })
        .catch((err) => {
          console.log('error', err);
        });
    } else {
      if (valuess.photos) values.photos = valuess.photos;
      if (valuess.files) values.files = valuess.files;
      if (!values.status) values.status = 'draft';
      if (valuess.requireWarranty)
        values.requireWarranty = valuess.requireWarranty;

      API.post(`/${Resource_Name}`, JSON.stringify({ ...values }))
        .then(({ data = {} }) => {
          if (data) redirect(`/${Resource_Name}`);
        })
        .catch((err) => {
          console.log('error', err);
        });
    }
  }
  const ST = StockStatus().map((i) => ({
    id: i.value,
    name: i.label,
  }));

  return (
    <SimpleForm
      onSubmit={(v) => save(v)}
      toolbar={<CustomToolbar record={record} />}>
      {children}

      <TextInput
        source={'title.' + translate('lan')}
        label={translate('resources.product.title')}
        className="mb-20"
        validate={Val.req}
        fullWidth
      />

      <TextInput
        source="slug"
        label={translate('resources.product.slug')}
        className="mb-20 ltr"
        fullWidth
      />
      <TextInput
        fullWidth
        source={'metatitle.' + translate('lan')}
        label={translate('resources.product.metatitle')}
      />
      <TextInput
        multiline
        fullWidth
        source={'metadescription.' + translate('lan')}
        label={translate('resources.product.metadescription')}
      />

      <TextInput
        multiline
        fullWidth
        source={'excerpt.' + translate('lan')}
        label={translate('resources.product.excerpt')}
      />
      <RichTextInput
        fullWidth
        source={'description.' + translate('lan')}
        label={translate('resources.product.description')}
      />
      {Resource_Name === 'add' && (
        <Box sx={{ my: 2 }}>
          <Typography>کاربر:</Typography>
          <TextInput
            source={'customer.firstName'}
            label={translate('resources.customers.firstName')}
          />
          <TextInput
            source={'customer.lastName'}
            label={translate('resources.customers.lastName')}
          />
          <TextInput
            source={'customer.phoneNumber'}
            label={translate('resources.customers.phoneNumber')}
          />
        </Box>
      )}

      <BooleanInput
        source="story"
        label={translate('resources.product.story')}
      />
      <BooleanInput
        source="requireWarranty"
        label={translate('resources.product.requireWarranty')}
      />
      <TextInput
        source={'miniTitle.' + translate('lan')}
        label={translate('resources.product.miniTitle')}
      />
      <TextInput
        source="extra_button"
        label={translate('resources.product.extra_button')}
      />

      {/*<CatRefField label={translate("resources.product.firstCategory")} returnToHome={returnToHome}*/}
      {/*returnCatsValues={returnCatsValues}*/}
      {/*// record={record}*/}
      {/*source="firstCategory"*/}
      {/*reference="category"*/}
      {/*url={"/category/f/0/1000"} surl={"/category/s"}/>*/}

      <ReferenceArrayInput
        label={translate('resources.product.productCategory')}
        perPage={100}
        source="productCategory"
        reference="productCategory">
        <SelectArrayInput optionText="name.fa" />
      </ReferenceArrayInput>
      {/*<ReferenceArrayInput*/}
      {/*label={translate("resources.product.attributes")}*/}
      {/*source="attributes" reference="attributes">*/}
      {/*<SelectArrayInput optionText="name.fa" optionValue="_id"/>*/}
      {/*</ReferenceArrayInput>*/}

      <AtrRefField
        label={translate('resources.product.attributes')}
        source="attributes"
        reference="attributes"
        url="/attributes/0/1000"
        surl="/attributes"
      />

      <SelectInput
        label={translate('resources.product.type')}
        fullWidth
        className="mb-20"
        source="type"
        choices={ProductType()}
      />

      <FormDataConsumer>
        {({ formData = {}, ...rest }) => {
          if (formData.type === 'variable')
            return (
              <>
                <EditOptions
                  source="options"
                  record={formData}
                  onCreateCombinations={onCreateCombinations}
                  formData={formData}
                  type={formData.type}
                  updater={OptsUpdater}
                />
                <Combinations
                  record={formData}
                  theST={ST}
                  source="combinations"
                  updater={() => {}}
                />
              </>
            );
          else if (formData.type === 'normal')
            return (
              <>
                <div className="row mb-20">
                  <div className="col-md-4">
                    <SelectInput
                      fullWidth
                      label={translate('resources.product.stock')}
                      source="in_stock"
                      choices={ST}
                    />
                  </div>
                  <div className="col-md-4">
                    <NumberInput
                      fullWidth
                      source="quantity"
                      label={translate('resources.product.quantity')}
                    />
                  </div>
                  <div className="col-md-4">
                    <NumberInput
                      fullWidth
                      source="weight"
                      label={translate('resources.product.weight')}
                    />
                  </div>
                </div>
                <div className="row mb-20">
                  <div className="col-md-6">
                    <TextInput
                      fullWidth
                      source="price"
                      className="ltr"
                      label={translate('resources.product.price')}
                      format={(v) => {
                        if (!v) return '';

                        return v
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                      }}
                      parse={(v) => {
                        if (!v) return '';

                        return v.toString().replace(/,/g, '');
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <TextInput
                      fullWidth
                      source="salePrice"
                      className="ltr"
                      label={translate('resources.product.salePrice')}
                      format={(v) => {
                        if (!v) return '';

                        return v
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                      }}
                      parse={(v) => {
                        if (!v) return '';

                        return v.toString().replace(/,/g, '');
                      }}
                    />
                  </div>
                </div>
                <div className="row mb-20">
                  <div className="col-md-3">
                    <TextInput
                      fullWidth
                      source="source"
                      className="ltr"
                      label={translate('resources.product.source')}
                    />
                  </div>
                  <div className="col-md-3">
                    <TextInput
                      fullWidth
                      source="minPrice"
                      className="ltr"
                      label={translate('resources.product.minPrice')}
                      format={(v) => {
                        if (!v) return;

                        return v
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                      }}
                      parse={(v) => {
                        if (!v) return;

                        return v.toString().replace(/,/g, '');
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <TextInput
                      fullWidth
                      source="maxPrice"
                      className="ltr"
                      label={translate('resources.product.maxPrice')}
                      format={(v) => {
                        if (!v) return;

                        return v
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                      }}
                      parse={(v) => {
                        if (!v) return;

                        return v.toString().replace(/,/g, '');
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <TextInput
                      fullWidth
                      source="formula"
                      className="ltr"
                      label={translate('resources.product.formula')}
                    />
                  </div>
                </div>
              </>
            );
        }}
      </FormDataConsumer>

      {/*<EditOptions*/}
      {/*// record={record}*/}
      {/*onCreateCombinations={onCreateCombinations} updater={OptsUpdater}/>*/}

      {/*<ShowPictu  <EditOptions ros" thep={theP} setPhotos={setPhotos}/>*/}

      <UploaderField
        label={translate('resources.product.photo')}
        accept="image/*"
        source="photos"
        multiple={true}
        thep={theP}
        setPhotos={setPhotos}
        inReturn={thel}
      />

      <ArrayInput
        source="extra_attr"
        label={translate('resources.product.extra_attr')}>
        <SimpleFormIterator>
          <FormDataConsumer>
            {({ getSource, scopedFormData }) => (
              <>
                <div className="mb-20" />

                <TextInput
                  fullWidth
                  source={getSource('title')}
                  label={translate('resources.product.title')}
                />
                <TextInput
                  fullWidth
                  source={getSource('des')}
                  label={translate('resources.product.description')}
                />
              </>
            )}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="labels" label={translate('resources.product.labels')}>
        <SimpleFormIterator>
          <FormDataConsumer>
            {({ getSource, scopedFormData }) => (
              <TextInput
                fullWidth
                source={getSource('title')}
                label={translate('resources.product.title')}
              />
            )}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>

      <SelectInput
        label={translate('resources.product.status')}
        source="status"
        choices={[
          { id: 'published', name: translate('resources.product.published') },
          { id: 'processing', name: translate('resources.product.processing') },
          { id: 'draft', name: translate('resources.product.draft') },
          { id: 'deleted', name: translate('resources.product.deleted') },
        ]}
      />
      <SelectInput
        label={translate('resources.page.access')}
        defaultValue="public"
        source="access"
        choices={[
          { id: 'public', name: translate('resources.page.public') },
          { id: 'private', name: translate('resources.page.private') },
        ]}
      />
    </SimpleForm>
  );
}

export default memo(Form);
