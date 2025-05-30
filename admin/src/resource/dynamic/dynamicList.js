import { memo } from 'react';
import {
  AutocompleteInput,
  CreateButton,
  Datagrid,
  downloadCSV,
  EditButton,
  ExportButton,
  Filter,
  FunctionField,
  Pagination,
  DeleteButton,
  ReferenceField,
  ReferenceInput,
  TextField,
  TopToolbar,
  useResourceContext,
  useTranslate,
  TextInput,
} from 'react-admin';
import { ImportButton } from 'react-admin-import-csv';

import jsonExport from 'jsonexport/dist';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

import ProductRewriteButton from '@/components/ProductRewriteButton';
import API from '@/functions/API';
import { List, ShowLink } from '@/components';

const PostPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />
);

const PostFilter = (props) => {
  const translate = useTranslate();
  const lan = translate('lan');

  return (
    <Filter {...props}>
      {/*<TextInput label="Search" source="search" alwaysOn/>*/}
      <TextInput source="Search" label="resources.product.search" alwaysOn />
      {/*<ReferenceField label="Category" source="user_id" reference="category">*/}
      {/*<SearchInput source="category" placeholder={translate('resources.product.category')} alwaysOn/>*/}
      {/*</ReferenceField>*/}
      <ReferenceInput
        perPage={1000}
        label="resources.product.category"
        source="category"
        reference="category"
        alwaysOn>
        <AutocompleteInput optionText={'name.' + lan} />
      </ReferenceInput>
      {/*<SearchInput source="firstCategory" placeholder={'نام'} alwaysOn/>*/}
      {/*<SearchInput source="lastName" placeholder={'نام خانوادگی'} alwaysOn/>*/}
      {/*<SelectInput source="firstCategory" label={'دسته بندی اول'}  emptyValue="" choices={typeChoices4}/>*/}
      {/*<SelectInput source="secondCategory" label={'دسته بندی دوم'}  emptyValue="" choices={typeChoices3}/>*/}
      {/*<SelectInput source="thirdCategory" label={'دسته بندی سوم'}  emptyValue="" choices={typeChoices3}/>*/}
    </Filter>
  );
};
const exporter = (posts) => {
  
  let allpros = [];
  let cats = [];

  const postsForExport = posts.map((post, i) => {
    cats = [];
    const { backlinks, author, ...postForExport } = post; // omit backlinks and author
    postForExport._id = post._id; // add a field
    // postForExport.maxResults  = 10000;
    if (post.productCategory) {
      post.productCategory.map((cat, ci) => {
        cats.push(cat.slug);
      });
    }

    if (post.title) postForExport.title = post.title.fa; // add a field
    postForExport.type = post.type; // add a field
    // postForExport.combinations = post.combinations; // add a field
    if (post.type == 'variable') {
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
          options: com.options ? Object.values(com.options).toString() : '',
          combination_id: i + 1,
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
        type: post.type,
      });
    }
  });
  jsonExport(
    allpros,
    {
      headers: [
        '_id',
        'slug',
        'title',
        'description',
        'category',
        'type',
        'price',
        'salePrice',
        'in_stock',
        'quantity',
      ], // order fields in the export
    },
    (err, csv) => {
      const BOM = '\uFEFF';
      downloadCSV(`${BOM} ${csv}`, 'products'); // download as 'posts.csv` file
    }
  );
};

const ListActions = (props) => {
  let { basePath, data, resource } = props;
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
      // let update = [], create = [];
      let array = [];
      const postsForExport = csvRows.map((row) => {
        row._id = row[' _id'];
        if (row._id)
          array.push({
            _id: row._id,
          });
        // else
        // delete row.photos;
        delete row[' _id'];
        delete row['id'];
        delete row.firstCategory_name_ru;
        delete row.secondCategory_name_ru;
        delete row.thirdCategory_name_ru;
        row.title = {
          en: row.title_en,
          fa: row.title_fa,
          ru: row.title_ru,
          uz: row.title_uz,
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

      // API.post('/product/importproductsfromcsv', JSON.stringify(postsForExport))
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
      if (row.id) {
        // throw new Error("AAAA");
      }
    },
    postCommitCallback: (reportItems) => {},
    // Async function to Validate a row, reject the promise if it's not valid
    parseConfig: {
      dynamicTyping: true,
      // complete: function(results, file) {
      //     console.log("Parsing complete:", results, file);
      // },
      // preview:1
    },
  };
  return (
    <TopToolbar>
      {/*<FilterButton/>*/}
      <CreateButton />
      <ExportButton maxResults={3000} />
      {/*<CreateButton basePath={basePath} />*/}
      <ImportButton {...props} {...config} />
      <ProductRewriteButton record={data} />
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

function ListComponent(props) {
  const resource = useResourceContext();

  const translate = useTranslate();

  const lan = translate('lan');

  // @ts-ignore
  const themeData = useSelector((st) => st.themeData);
  let resourceRules = [];

  if (
    themeData &&
    themeData.rules &&
    themeData.rules[resource] &&
    themeData.rules[resource].list &&
    themeData.rules[resource].list.header
  ) {
    resourceRules = themeData.rules[resource].list.header;
  }

  return (
    <List
      {...props}
      filters={<PostFilter />}
      pagination={<PostPagination />}
      actions={<ListActions />}
      exporter={exporter}>
      <Datagrid optimized>
        {resourceRules &&
          resourceRules.map((r, idx) => {
            if (r) {
              if (r.type === 'image') return JSON.stringify(r);
              else if (r.type === 'multiLang')
                return (
                  <FunctionField
                    key={idx}
                    label={r.name}
                    render={(record) => {
                      return (
                        <>
                          <ShowLink base={resource} theSource={r.name} />
                          <br />
                          <TextField source="slug" />
                        </>
                      );
                    }}
                  />
                );
              else if (r.type === 'text')
                return <TextField key={idx} source={r.name} />;
              else if (r.type === 'referenceField')
                return (
                  <ReferenceField
                    key={idx}
                    label={r.name}
                    source={r.name}
                    reference={r.reference}>
                    <TextField source={r.textFieldSource + '.' + lan} />
                  </ReferenceField>
                );
              else if (r.type === 'actions')
                return (
                  <FunctionField
                    key={idx}
                    label={translate('resources.page.actions')}
                    render={(record) => (
                      <div>
                        {r.pageBuilder && (
                          <div>
                            {/*+"?token="+localStorage.getItem('token')*/}
                            <a
                              rel="noopener noreferrer"
                              target="_blank"
                              href={`/admin/#/builder/page/${record._id}`}>
                              <NoteAltIcon />
                              <span className={'ml-2 mr-2'}>
                                {translate('resources.page.pagebuilder')}
                              </span>
                            </a>
                          </div>
                        )}

                        {r.edit && (
                          <div>
                            <EditButton />
                          </div>
                        )}
                        {r.copy && (
                          <div>
                            <Button
                              color="primary"
                              size="small"
                              onClick={() => {
                                API.post('/page/copy/' + record._id, null)
                                  .then(({ data = {} }) => {
                                    props.history.push('/post/' + data._id);
                                    // ale/rt('done');
                                  })
                                  .catch((err) => {
                                    console.log('error', err);
                                  });
                              }}>
                              <ContentCopyIcon />
                              <span className={'ml-2 mr-2'}>
                                {translate('resources.page.copy')}
                              </span>
                            </Button>
                          </div>
                        )}
                        {r.actions && (
                          <div>
                            <a
                              rel="noopener noreferrer"
                              target="_blank"
                              href={
                                '/#/action?filter=%7B%page"%3A"' +
                                record._id +
                                '"%7D&order=ASC&page=1&perPage=10&sort=id/'
                              }>
                              <PendingActionsIcon />
                              <span className={'ml-2 mr-2'}>
                                {translate('resources.page.activities')}
                              </span>
                            </a>
                          </div>
                        )}
                        {r.delete && (
                          <div>
                            <DeleteButton />
                          </div>
                        )}
                      </div>
                    )}
                  />
                );
            }
            return null;
          })}
      </Datagrid>
    </List>
  );
}

export default memo(ListComponent);
