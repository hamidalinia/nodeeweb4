import {
  TextField,
  useTranslate,
  Show,
  SimpleShowLayout,
  useRecordContext,
  BooleanField,
  SingleFieldList,
  ArrayField,
  Link,
  SelectField,
  FunctionField,
  ChipField,
} from 'react-admin';

import { Row } from './components';

const CustomImageField = ({ source, label }) => {
  const { photos } = useRecordContext();

  let items = Array.isArray(photos) ? photos : [photos];

  return (
    <Row>
      {items.map((i, idx) => (
        <a href={i.url} target="_blank" rel="noreferrer" key={idx}>
          <img loading="lazy" alt="img" src={i.url} />
        </a>
      ))}
    </Row>
  );
};

export default function ShowComponent(props) {
  const t = useTranslate();
  const lan = t('lan');

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="_id" label="_id" />
        <FunctionField
          source="customer"
          label="resources.action.user"
          render={(r) => (
            <a
              target="_blank"
              rel="noreferrer"
              href={`/add/${r.slug}`}>
              مشاهده در سایت
            </a>
          )}
        />
        <FunctionField
          source="customer"
          label="resources.action.user"
          render={(r) => {
            const item = r.customer || {};
            return (
              <Link to={`/customer/${item._id}`}>
                {`${item.firstName} ${item.lastName}`}
              </Link>
            );
          }}
        />
        <TextField source={`title.${lan}`} label="resources.post.title" />
        <TextField
          source={`description.${lan}`}
          label="resources.post.description"
        />
        <TextField source="slug" label="resources.product.slug" />
        <TextField source="adNumber" label="resources.advertise.adNumber" />
        <ArrayField label="resources.form.category" source="adscategory">
          <SingleFieldList linkType={false}>
            <ChipField source={`name.${lan}`} size="small" />
          </SingleFieldList>
        </ArrayField>

        <CustomImageField source="photos" label="resources.product.image" />

        <TextField source="likeCount" label="resources.advertise.likeCount" />
        <TextField source="viewCount" label="resources.advertise.viewCount" />
        <BooleanField source="active" label="resources.customers.active" />
        <SelectField
          source="status"
          label="resources.product.status"
          choices={[
            { id: 'published', name: 'resources.product.published' },
            { id: 'processing', name: 'resources.product.processing' },
            { id: 'draft', name: 'resources.product.draft' },
            { id: 'deleted', name: 'resources.product.deleted' },
          ]}
        />
      </SimpleShowLayout>
    </Show>
  );
}
