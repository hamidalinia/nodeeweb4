import {
  DeleteButton,
  SaveButton,
  SelectInput,
  TextInput,
  Toolbar,
  useNotify,
  useRedirect,
  useTranslate,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

import { SimpleForm } from '@/components';
import { Val } from '@/Utils';
import API from '@/functions/API';

const CustomToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton alwaysEnable />
    <DeleteButton mutationMode="pessimistic" />
  </Toolbar>
);

const Form = ({ children, record }) => {
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <SimpleForm>
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
        source="path"
        fullWidth
        label={translate('resources.accounting.path')}
        className={'mb-20 ltr'}
      />
      <TextInput
        source={'title.' + translate('lan')}
        fullWidth
        label={translate('resources.accounting.title')}
        className={'mb-20'}
        validate={Val.req}
      />
      <TextInput
        source="slug"
        fullWidth
        label={translate('resources.accounting.slug')}
        className={'mb-20 ltr'}
      />
      <div className={'mb-20'}></div>
      <div className={'mb-20'}></div>
      <TextInput
        multiline
        fullWidth
        source={'excerpt.' + translate('lan')}
        label={translate('resources.accounting.excerpt')}
      />
      <RichTextInput
        fullWidth
        source={'description.' + translate('lan')}
        label={translate('resources.accounting.description')}
      />
      <div className={'mb-20'}></div>
      <TextInput
        source="kind"
        fullWidth
        label={translate('kind')}
        className={'mb-20 ltr'}
      />
      <TextInput
        source="maxWidth"
        fullWidth
        label={translate('maxWidth')}
        className={'mb-20 ltr'}
      />
      <TextInput
        source="classes"
        fullWidth
        label={translate('classes')}
        className={'mb-20 ltr'}
      />
      <TextInput
        source="padding"
        fullWidth
        label={translate('padding')}
        className={'mb-20 ltr'}
      />
      <TextInput
        source="margin"
        fullWidth
        label={translate('margin')}
        className={'mb-20 ltr'}
      />
      <TextInput
        source="backgroundColor"
        fullWidth
        label={translate('backgroundColor')}
        className={'mb-20 ltr'}
      />
      <SelectInput
        label={translate('resources.accounting.status')}
        defaultValue={'processing'}
        source="status"
        choices={[
          { id: 'published', name: translate('resources.accounting.published') },
          { id: 'processing', name: translate('resources.accounting.processing') },
          { id: 'deleted', name: translate('resources.accounting.deleted') },
        ]}
      />{' '}
      <SelectInput
        label={translate('resources.accounting.access')}
        defaultValue={'public'}
        source="access"
        choices={[
          { id: 'public', name: translate('resources.accounting.public') },
          { id: 'private', name: translate('resources.accounting.private') },
        ]}
      />
    </SimpleForm>
  );
};

export default Form;
