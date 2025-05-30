import { memo } from 'react';
import _get from 'lodash/get';

import ElementForm from '@/components/page-builder/ElementForm';
import Modal from '@/components/global/Modal';

import useStyles from './styles';
import { ItemType } from './types';

const ComponentSetting = ({
                              component = {} as ItemType,
                              open,
                              onClose,
                              onSubmit,
                          }) => {
    const cls = useStyles();
    const defaultStyleFields = {
        margin: '',
        padding: '',
        border: '',
    };
    console.log("component",component)
    const styleSettings = _get(component, 'settings.style', { fields: {} });
    const contentSettings = _get(component, 'settings.content', { fields: {} });

    const mergedStyleFields = { ...defaultStyleFields, ...styleSettings.fields };
    const mergedContentFields = contentSettings.fields || {};
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={component.label}
            className={cls.modal + ' element-setting-form'}
        >
            <div className={cls.container}>
                <ElementForm
                    onSubmit={(updatedSettings) => {
                        console.log("on submit",updatedSettings)
                        // updatedSettings = { style: {...}, content: {...} }
                        onSubmit(component, updatedSettings);
                        onClose();
                    }}
                    styleFields={mergedStyleFields}
                    contentFields={mergedContentFields}
                    componentType={component.type}
                >
                    {component.children}
                </ElementForm>
            </div>
        </Modal>
    );
};

export default memo(ComponentSetting);
