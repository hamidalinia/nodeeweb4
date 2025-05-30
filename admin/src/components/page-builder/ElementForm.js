import React, { useState } from 'react';



const ElementForm = ({
                         styleFields,
                         contentFields,
                         onSubmit,
                     }) => {
    const [activeTab, setActiveTab] = useState('content');

    // Keep local state for both style and content values (initialize from props)
    const [styleValues, setStyleValues] = useState(styleFields);
    const [contentValues, setContentValues] = useState(contentFields);

    // For adding new field
    const [newFieldName, setNewFieldName] = useState('');

    // Change handlers
    const handleStyleChange = (key, value) => {
        setStyleValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleContentChange = (key, value) => {
        setContentValues((prev) => ({ ...prev, [key]: value }));
    };

    // Add new field to active tab
    const handleAddField = () => {
        if (!newFieldName.trim()) return;

        if (activeTab === 'style') {
            if (!(newFieldName in styleValues)) {
                setStyleValues((prev) => ({ ...prev, [newFieldName]: '' }));
            }
        } else {
            if (!(newFieldName in contentValues)) {
                setContentValues((prev) => ({ ...prev, [newFieldName]: '' }));
            }
        }
        setNewFieldName('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            style: styleValues,
            content: contentValues,
        });
    };

    // Render inputs for fields
    const renderFields = (values, onChange) => {
        return Object.keys(values).map((key) => (
            <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>{key}</label>
                <input
                    type="text"
                    value={values[key] || ''}
                    onChange={(e) => onChange(key, e.target.value)}
                    style={{ width: '100%', padding: 6 }}
                />
            </div>
        ));
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Tabs */}
            <div style={{ display: 'flex', marginBottom: 20 }}>
                <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    style={{
                        flex: 1,
                        padding: 8,
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'content' ? '#ddd' : '#fff',
                        border: '1px solid #ccc',
                        borderBottom: activeTab === 'content' ? 'none' : '1px solid #ccc',
                    }}
                >
                    Content
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('style')}
                    style={{
                        flex: 1,
                        padding: 8,
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'style' ? '#ddd' : '#fff',
                        border: '1px solid #ccc',
                        borderBottom: activeTab === 'style' ? 'none' : '1px solid #ccc',
                    }}
                >
                    Style
                </button>
            </div>

            {/* Tab Content */}
            <div
                style={{
                    border: '1px solid #ccc',
                    padding: 15,
                    borderRadius: 4,
                    minHeight: 150,
                }}
            >
                {activeTab === 'content' && renderFields(contentValues, handleContentChange)}
                {activeTab === 'style' && renderFields(styleValues, handleStyleChange)}
            </div>

            {/* Add new field */}
            <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                <input
                    type="text"
                    placeholder="New field name"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    style={{ flex: 1, padding: 6 }}
                />
                <button type="button" onClick={handleAddField} style={{ padding: '6px 12px' }}>
                    Add Field
                </button>
            </div>

            <button
                type="submit"
                style={{
                    marginTop: 20,
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                }}
            >
                Save
            </button>
        </form>
    );
};

export default ElementForm;
