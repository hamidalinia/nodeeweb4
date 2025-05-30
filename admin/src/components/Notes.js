import { useCallback, useEffect, useState } from 'react';

// import CreateIcon from '@mui/icons-material/Create';
import IconButton from '@mui/material/IconButton';
import {
  Create,
  SimpleForm,
  useDataProvider,
  useShowContext,
  useTranslate,
} from 'react-admin';
import Box from '@mui/material/Box';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { RichTextInput } from 'ra-input-rich-text';

import { NoteShow } from '@/components';

const Notes = () => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const { record } = useShowContext();

  const { _id } = record;
  const [state, setState] = useState({
    enableAddNote: false,
    notes: [],
  });

  const fetchNotes = useCallback(
    (id) => {
      dataProvider.get('note/0/10000?customer=' + id, {}).then(({ data }) => {
        setState((state) => ({
          ...state,
          notes: data,
          enableAddNote: false,
        }));
      });
    },
    [dataProvider]
  );
  useEffect(() => {
    fetchNotes(_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  const addNote = () => {
    setState((state) => ({
      ...state,
      enableAddNote: !state.enableAddNote,
    }));
  };
  const { notes, enableAddNote } = state;

  const transform = (data) => ({
    ...data,
    customer: _id,
  });
  const onSuccess = (data) => {
    fetchNotes();
    // setState(state => ({
    //   ...state,
    //   enableAddNote: false
    //
    // }));
  };
  return (
    <div style={{ padding: '10px' }}>
      <div className={'label-top-table'}>
        <span>{translate('notes')}</span>
        <span>
          <IconButton
            aria-label="create"
            onClick={(e) => {
              addNote();
            }}>
            <NoteAddIcon />
          </IconButton>
        </span>
      </div>
      {!enableAddNote && (
        <div className={'grid-box one-box'}>
          {notes && notes.map((d, key) => <NoteShow key={key} note={d} />)}
          <NoteShow
            add={true}
            onClick={(e) => {
              addNote();
            }}
          />
        </div>
      )}
      {enableAddNote && (
        <Box>
          <Create
            mutationOptions={{ onSuccess }}
            resource="note"
            redirect={'false'}
            transform={transform}>
            <SimpleForm>
              <RichTextInput
                fullWidth
                source={'description.' + translate('lan')}
                toolbar={false}
                label={translate('resources.product.description')}
              />
            </SimpleForm>
          </Create>
        </Box>
      )}
    </div>
  );
};

export default Notes;
