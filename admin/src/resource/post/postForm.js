import {
  DeleteButton,
  SaveButton,
  SelectInput,
  TextInput,
  Toolbar,
    ReferenceArrayInput,
  useNotify,
  useRedirect,
    SelectArrayInput,
  useTranslate,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

import { SimpleForm, UploaderField } from '@/components';
import { Val } from '@/Utils';
import API from '@/functions/API';

let combs = [];

let valuess = { photos: [], files: [], thumbnail: '', combinations: [] };

function setPhotos(values) {
  valuess['photos'] = values;
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

const CustomToolbar = (props) => {
  return (
    <Toolbar>
      <SaveButton alwaysEnable />
      <DeleteButton mutationMode="pessimistic" />
    </Toolbar>
  );
};

function Form({ children = undefined, record, Resource_Name }) {
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();

  function save(values) {
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
    if (valuess.photos) {
      values.photos = valuess.photos;
      // valuess['photos']
    }
    let initialElements = JSON.parse(localStorage.getItem('initialElements'));
    values.elements = initialElements;

    if (record?._id?.length > 0) {
      // delete values.photos;
      delete values.category;
      delete values.catChoosed;
      delete values.files;
      delete values.elements;

      API.put(`/${Resource_Name}/${record._id}`, JSON.stringify({ ...values }))
        .then(({ data = {} }) => {
          notify('saved');
          if (data) {
            values = [];
            valuess = [];
            redirect(`/${Resource_Name}`);
          }
        })
        .catch((err) => {
          console.log('error', err);
        });
    } else {
      if (valuess.photos) {
        values.photos = valuess.photos;
      }
      if (valuess.files) {
        values.files = valuess.files;
      }

      API.post(`/${Resource_Name}`, JSON.stringify({ ...values }))
        .then(({ data = {} }) => {
          if (data) redirect(`/${Resource_Name}`);
        })
        .catch((err) => {
          console.log('error', err);
        });
    }
  }

  return (
    <SimpleForm
      onSubmit={(v) => save(v)}
      toolbar={<CustomToolbar record={record} />}>
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
        fullWidth
        source={'keywords.' + translate('lan')}
        label={translate('resources.product.keywords')}
      />
      {children}

      <TextInput
        source={'title.' + translate('lan')}
        fullWidth
        label={translate('resources.post.title')}
        className={'mb-20'}
        validate={Val.req}
      />
      <TextInput
        source="slug"
        fullWidth
        label={translate('resources.post.slug')}
        className={'mb-20 ltr'}
      />
        <ReferenceArrayInput
            label={translate("resources.post.postCategory")}
            perPage={100}
            source="postCategory" reference="postCategory">
            <SelectArrayInput optionText="name.fa"/>
        </ReferenceArrayInput>
      <TextInput
        multiline
        fullWidth
        source={'excerpt.' + translate('lan')}
        label={translate('resources.post.excerpt')}
      />
      <RichTextInput
        minHeight={200}
        maxHeight={400}
        height={400}
        fullWidth
        source={'description.' + translate('lan')}
        label={translate('resources.post.description')}
        id="asdfgfds"
      />

      <UploaderField
        label={translate('resources.product.photo')}
        accept="image/*"
        source="photos"
        multiple={true}
        thep={theP}
        setPhotos={setPhotos}
        inReturn={thel}
      />
      <SelectInput
        label={translate('resources.post.kind')}
        defaultValue={'post'}
        source="kind"
        choices={[
          { id: 'post', name: translate('resources.post.post') },
          { id: 'page', name: translate('resources.post.page') },
        ]}
      />
      <SelectInput
        label={translate('resources.post.status')}
        defaultValue={'processing'}
        source="status"
        choices={[
          { id: 'published', name: translate('resources.post.published') },
          { id: 'processing', name: translate('resources.post.processing') },
          { id: 'deleted', name: translate('resources.post.deleted') },
        ]}
      />
    </SimpleForm>
  );
}

export default Form;
