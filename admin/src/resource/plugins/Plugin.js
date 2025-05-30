import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Box, Card, CardActions, CircularProgress } from '@mui/material';
import {
  Form,
  SaveButton,
  TextInput,
  useNotify,
  useRefresh,
  useTranslate,
} from 'react-admin';

import API from '@/functions/API';

export default function Plugin(props) {
  const refresh = useRefresh();
  const params = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {},
  });

  const [loading, setLoading] = useState(false);

  const [theData, setTheData] = useState([]);
  const translate = useTranslate();
  const notify = useNotify();

  const handleNotif = (t, type = 'success') => {
    notify(t, { type: type });
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
      console.log(p);
      window.location.reload();
      // refresh();/
      // setCounter(counter++);
      // setTheData({...theData})
      handleNotif('resources.settings.logoUploadedSuccessfully');
    });
  };
  const getData = useCallback(() => {
    setLoading(true);
    API.get('/settings/plugins/rules/' + params.name)
      .then(({ data = {} }) => {
        let { fields } = data;
        fields.forEach((d) => {
          setValue(d.name, d.value);
        });
        setTheData(fields);
        return data;
      })
      .catch((e) => {
        setTheData([]);
      })
      .finally(() => setLoading(false));
  }, [params.name, setValue]);

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (t, value) => {
    console.log('t', t, 'value', value);
    setValue(t, value);
  };

  const onSubmit = (g) => {
    console.log('onSubmit', g);
    API.put('/settings/plugins/rules/' + params.name, JSON.stringify(g)).then(
      ({ data = {} }) => {
        setLoading(false);
        if (data.success) handleNotif('resources.settings.UpdatedSuccessfully');
        else handleNotif('resources.settings.sthWrong', 'error');

        return data;
      }
    );
  };

  if (!theData) return <></>;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
      <Box>
        <Card sx={{ padding: '1em' }}>
          {/*{JSON.stringify(theData)}*/}

          {theData &&
            theData.map((item) => {
              if (!item.type)
                return (
                  <Box>
                    <TextInput
                      autoFocus
                      fullWidth
                      label={item.label || item.name}
                      source={item.name}
                      disabled={loading}
                      defaultValue={item.value}
                      onChange={(event) => {
                        handleChange(item.name, event.target.value);
                      }}
                    />
                  </Box>
                );

              if (item.type == 'textarea')
                return (
                  <Box>
                    <TextInput
                      multiline
                      autoFocus
                      fullWidth
                      label={item.label || item.name}
                      source={item.name}
                      disabled={loading}
                      defaultValue={item.value}
                      onChange={(event) => {
                        handleChange(item.name, event.target.value);
                      }}
                    />
                  </Box>
                );
            })}

          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <SaveButton
              variant="contained"
              type="submit"
              color="primary"
              disabled={loading}
              alwaysEnable

              // saving={onSubmit}
            >
              {loading && <CircularProgress size={25} thickness={2} />}
              {translate('resources.settings.save')}
            </SaveButton>
          </CardActions>
        </Card>
      </Box>
    </Form>
  );
}
