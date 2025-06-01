import {fields, rules} from './DefaultGeneral';

const DefaultOptions =[
    {
        label: 'Row',
        type: 'row',
        addable: true,
        settings: {
            "style": {
            },
        },
    },
    {
        label: 'Col',
        type: 'col',
        addable: true,
        settings: {
            "style": {
            },
        },
    },
    {
        label: 'Image',
        type: 'image',
        addable: false,
        settings: {
            "style": {
            },
        },
    },
    {
        label: 'Button',
        type: 'button',
        addable: false,
        settings: {
            "style": {
            }
        },
    },
  {
        label: 'ThemeMode',
        type: 'thememode',
        addable: false,
        settings: {

        },
    },
    {
        label: 'Paragraph',
        type: 'paragraph',
        addable: false,
        settings: {
            "style": {
            },
        },
    },
    {
        label: 'Title (H tags)',
        type: 'title',
        addable: false,
        settings: {
            "style": {
            }
        },
    }

]
export default DefaultOptions;
