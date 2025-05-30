import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Card, CardActions, CircularProgress } from '@mui/material';
import {
  Form,
  SaveButton,
  SelectInput,
  TextInput,
  useNotify,
  useTranslate,
} from 'react-admin';

import API from '@/functions/API';
import { fDateTime } from '@/helpers/date';

export default function SubmitCustomerStatus(props) {
  const translate = useTranslate();
  const notify = useNotify();

  const { _id, theStatus } = props;

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      title: '',
      status: '',
    },
  });

  const [childs, setChilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theData, setTheData] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    API.get('/settings/customerStatus')
      .then(({ data = {} }) => {
        setChilds(data);
        setTheData(true);
      })
      .catch((e) => {
        setTheData(true);
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (t, value) => {
    setValue(t, value);
  };

  const onSubmit = (theData) => {
    let jso = {
      description: theData.description,
      status: theData.status,
    };

    API.put('/customer/status/' + _id, JSON.stringify(jso)).then(
      ({ data = {} }) => {
        setLoading(false);

        if (data.success) {
          notify('resources.settings.UpdatedSuccessfully', { type: 'success' });
        } else {
          notify('resources.settings.sthWrong', { type: 'error' });
        }
        return data;
      }
    );
  };
  const returnStatus = (st) => {
    let rd = childs.filter((x) => x.slug == st);
    if (rd && rd[0] && rd[0].title) return rd[0].title;
    else return JSON.stringify(st);
  };

  if (!theData) return <></>;

  const { title, status } = getValues();

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
        <Box>
          <Card sx={{ padding: '1em' }}>
            <Box>
              <SelectInput
                source="status"
                onChange={(event) => {
                  console.log('event.target', event);
                  handleChange('status', event.target.value);
                }}
                choices={childs}
                optionText={'title'}
                optionValue={'slug'}
              />
              <TextInput
                fullWidth
                label={translate('resources.settings.description')}
                source={'description'}
                disabled={loading}
                defaultValue={title}
                onChange={(event) => {
                  handleChange('description', event.target.value);
                }}
              />
              {/*<SelectInput optionText={"title."+translate("lan")}*/}
              {/*defaultValue={home}*/}
              {/*onChange={(event) => {*/}
              {/*handleChange("home", event.target.value);*/}
              {/*}}*/}
              {/*/>*/}
            </Box>

            <CardActions sx={{ padding: '0 1em 1em 1em' }}>
              <SaveButton
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                alwaysEnable>
                {loading && <CircularProgress size={25} thickness={2} />}
                {translate('resources.settings.save')}
              </SaveButton>
            </CardActions>
          </Card>
        </Box>
      </Form>
      <div className="item-box-parent">
        {theStatus?.reverse().map((i, idx) => (
          <div key={idx} className="item-boxes">
            <span className="child-item-boxes-f">
              <span className="child-item-boxes-f-c">#{idx + 1}</span>
              <span className="child-item-boxes-f-d">
                {returnStatus(i.status)}
              </span>
            </span>

            <span className="child-item-boxes-t">{i.description}</span>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                fontSize: '0.75rem',
              }}>
              <span style={{ direction: 'ltr' }}>{fDateTime(i.createdAt)}</span>

              <span>{i.user?.username}</span>
            </Box>
          </div>
        ))}
      </div>
    </>
  );
}
