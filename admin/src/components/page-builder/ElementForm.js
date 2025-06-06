import React, { useState } from "react";

const ElementForm = ({
                       styleFields,
                       contentFields,
                       responsiveFields,
                       onSubmit
                     }) => {
  const [activeTab, setActiveTab] = useState("content");
  const [styleValues, setStyleValues] = useState(styleFields);
  const [contentValues, setContentValues] = useState(contentFields);
  const [responsiveValues, setResponsiveValues] = useState(responsiveFields);
  const [newFieldName, setNewFieldName] = useState("");

  // Change handlers
  const handleStyleChange = (key, value) => {
    setStyleValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleResponsiveChange = (key, value) => {
    setResponsiveValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleContentChange = (key, value) => {
    setContentValues((prev) => ({ ...prev, [key]: value }));
  };

  // Add new field to active tab
  const handleAddField = () => {
    if (!newFieldName.trim()) return;

    if (activeTab === "style") {
      if (!(newFieldName in styleValues)) {
        setStyleValues((prev) => ({ ...prev, [newFieldName]: "" }));
      }
    } else if (activeTab === "responsive") {
      if (!(newFieldName in responsiveValues)) {
        setResponsiveValues((prev) => ({ ...prev, [newFieldName]: "" }));
      }
    } else {
      if (!(newFieldName in contentValues)) {
        setContentValues((prev) => ({ ...prev, [newFieldName]: "" }));
      }
    }
    setNewFieldName("");
  };

  // Remove field from active tab
  const handleRemoveField = (key) => {
    if (activeTab === "style") {
      const { [key]: _, ...rest } = styleValues;
      setStyleValues(rest);
    } else if (activeTab === "responsive") {
      const { [key]: _, ...rest } = responsiveValues;
      setResponsiveValues(rest);
    } else {
      const { [key]: _, ...rest } = contentValues;
      setContentValues(rest);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      style: styleValues,
      content: contentValues,
      responsive: responsiveValues
    });
  };

  // Render inputs for fields with remove buttons
  const renderFields = (values, onChange, tabKey) => {
    if (tabKey === 'responsive') {
      values = {
        showInDesktop: null,
        showInMobile: null,
        ...values
      };
    }

    return Object.keys(values).map((key) => {
      const value = values[key];
      let isBoolean = typeof value === "boolean";

      if (key === "showInDesktop" || key === "showInMobile") {
        isBoolean = true;
      }

      return (
        <div key={key} style={{
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: 4 }}>{key}</label>
            {isBoolean ? (
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(key, e.target.checked)}
              />
            ) : (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(key, e.target.value)}
                style={{ width: "100%", padding: 6 }}
              />
            )}
          </div>

          {/* Only show remove for non-required fields */}
          {!['showInDesktop', 'showInMobile'].includes(key) && (
            <button
              type="button"
              onClick={() => handleRemoveField(key)}
              style={{
                padding: '4px 8px',
                background: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          )}
        </div>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Tabs - unchanged from your original */}
      <div style={{ display: "flex", marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          style={{
            flex: 1,
            padding: 8,
            cursor: "pointer",
            backgroundColor: activeTab === "content" ? "#ddd" : "#fff",
            border: "1px solid #ccc",
            borderBottom: activeTab === "content" ? "none" : "1px solid #ccc"
          }}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("style")}
          style={{
            flex: 1,
            padding: 8,
            cursor: "pointer",
            backgroundColor: activeTab === "style" ? "#ddd" : "#fff",
            border: "1px solid #ccc",
            borderBottom: activeTab === "style" ? "none" : "1px solid #ccc"
          }}
        >
          Style
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("responsive")}
          style={{
            flex: 1,
            padding: 8,
            cursor: "pointer",
            backgroundColor: activeTab === "responsive" ? "#ddd" : "#fff",
            border: "1px solid #ccc",
            borderBottom: activeTab === "responsive" ? "none" : "1px solid #ccc"
          }}
        >
          Responsive
        </button>
      </div>

      {/* Tab Content */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: 15,
          borderRadius: 4,
          minHeight: 150
        }}
      >
        {activeTab === "content" && renderFields(contentValues, handleContentChange, 'content')}
        {activeTab === "style" && renderFields(styleValues, handleStyleChange, 'style')}
        {activeTab === "responsive" && renderFields(responsiveValues, handleResponsiveChange, 'responsive')}
      </div>

      {/* Add new field - unchanged from your original */}
      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="New field name"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
          style={{ flex: 1, padding: 6 }}
        />
        <button type="button" onClick={handleAddField} style={{ padding: "6px 12px" }}>
          Add Field
        </button>
      </div>

      <button
        type="submit"
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        Save
      </button>
    </form>
  );
};

export default ElementForm;