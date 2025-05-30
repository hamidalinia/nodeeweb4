import {
    DeleteButton,
    SaveButton,
    SelectInput,
    TextInput,
    NumberInput,
    Toolbar,
    ReferenceInput,
    useNotify,
    useRedirect,
    useTranslate,
    TabbedForm,
    FormTab,
    ArrayInput,
    SimpleFormIterator
} from "react-admin";
import API from "@/functions/API";
import { Val } from "@/Utils";
import React, { useState, useEffect } from "react";
import { UploaderField } from "@/components";

let _The_ID = null;
let valuess = { photos: [], files: [], thumbnail: "", combinations: [] };

const CustomToolbar = props => (
    <Toolbar {...props}>
        <SaveButton alwaysEnable />
        <DeleteButton mutationMode="pessimistic" />
    </Toolbar>
);
function theP(values) {
    console.log("change thumbnail field", values);
    valuess["thumbnail"] = values;

}
function setPhotos(values) {

    console.log("setPhotos", values);
    valuess["photos"] = values;
}
function thel(values) {
    console.log("values",values)
    return new Promise(resolve => {


        valuess["photos"] = values;
        resolve(values);
    }, reject => {
        reject(null);
    });


}
const TestForm = ({ children, ...props }) => {
    const { record } = props;
    const notify = useNotify();
    const redirect = useRedirect();
    const translate = useTranslate();

    const [answerMode, setAnswerMode] = useState("normal");

    useEffect(() => {
        if (record && record._id) {
            _The_ID = record._id;
            setAnswerMode(record.answerMode || "normal"); // Set the answerMode based on the record from the server
        }
    }, [record]);

    // Save form data
    const save = values => {
        if (valuess.thumbnail) values.thumbnail = valuess.thumbnail;
        if (valuess.photos) values.photos = valuess.photos;

        const request = _The_ID
            ? API.put(`/test/${_The_ID}`, JSON.stringify({ ...values }))
            : API.post("/test/", JSON.stringify({ ...values }));

        request
            .then(({ data = {} }) => {
                notify("Saved");
                if (data) {
                    valuess = { photos: [], files: [], thumbnail: "", combinations: [] };
                    _The_ID = '';
                    redirect('/test');
                }
            })
            .catch(err => {
                console.log("error", err);
            });
    };

    // Handle answerMode change
    const handleAnswerModeChange = (event) => {
        setAnswerMode(event.target.value);
    };

    return (
        <TabbedForm {...props} onSubmit={v => save(v)} toolbar={<CustomToolbar {...props} />}>
            {/* General Settings Tab */}
            <FormTab label={translate("resources.test.generalSettings")}>
                {children}

                <TextInput
                    source={`title.${translate("lan")}`}
                    fullWidth
                    label={translate("resources.test.title")}
                    className="width100 mb-20"
                    validate={Val.req}
                />
                <TextInput
                    source="slug"
                    fullWidth
                    label={translate("resources.test.slug")}
                    className="width100 mb-20 ltr"
                />
                <TextInput
                    source="classes"
                    fullWidth
                    label={translate("resources.test.classes")}
                    className="width100 mb-20 ltr"
                />
                <TextInput
                    source="practiceText"
                    fullWidth
                    label={translate("resources.test.practiceText")}
                    className="width100 mb-20 ltr"
                />
                <TextInput
                    source="questionWrapperClasses"
                    fullWidth
                    label={translate("resources.test.questionWrapperClasses")}
                    className="width100 mb-20 ltr"
                />
                <TextInput
                    source="sort"
                    fullWidth
                    label={translate("resources.test.sort")}
                    className="width100 mb-20 ltr"
                />
                <NumberInput
                    source="score"
                    fullWidth
                    label={translate("resources.test.score")}
                    className="width100 mb-20 ltr"
                />

                <ReferenceInput
                    label={translate("resources.test.category")}
                    source="category"
                    reference="testCategory"
                    perPage={1000}
                >
                    <SelectInput optionText={`name.${translate("lan")}`} optionValue="id" />
                </ReferenceInput>
                <ReferenceInput
                    label={translate("resources.test.dependency")}
                    source="dependency"
                    reference="test"
                    perPage={1000}
                >
                    <SelectInput optionText={`title.${translate("lan")}`} optionValue="id" />
                </ReferenceInput>
                <SelectInput
                    label={translate("resources.test.status")}
                    defaultValue={"processing"}
                    source="status"
                    choices={[
                        { id: "published", name: translate("resources.test.published") },
                        { id: "processing", name: translate("resources.test.processing") },
                        { id: "deleted", name: translate("resources.test.deleted") },
                    ]}
                />
                <SelectInput
                    label={translate("resources.test.answerMode")}
                    value={answerMode}
                    onChange={handleAnswerModeChange}
                    source="answerMode"
                    choices={[
                        { id: "normal", name: translate("resources.test.normal") },
                        { id: "piano", name: translate("resources.test.piano") }
                    ]}
                />
                <UploaderField
                    label={translate("resources.product.photo")}
                    accept="image/*"
                    source="photos"
                    multiple={true}
                    thep={theP}
                    setPhotos={setPhotos}
                    inReturn={thel}
                />
            </FormTab>

            {/* Questions Tab - Array of Questions */}
            {answerMode === "normal" && (
                <FormTab label={translate("resources.test.questions")}>
                    <ArrayInput source="questions" label={translate("resources.test.questions")}>
                        <SimpleFormIterator>
                            <TextInput
                                source="questionText"
                                label={translate("resources.test.question")}
                                fullWidth
                                className="mb-20"
                            />
                            <SelectInput
                                source="questionType"
                                label={translate("resources.test.questionType")}
                                choices={[
                                    { id: 'text', name: translate("resources.test.text") },
                                    { id: 'multiple-choice', name: translate("resources.test.multipleChoice") },
                                    { id: 'checkbox', name: translate("resources.test.checkbox") }
                                ]}
                                defaultValue="text"
                                className="mb-20"
                            />
                            <ArrayInput source="options" label={translate("resources.test.options")}>
                                <SimpleFormIterator>
                                    <TextInput
                                        source={translate("resources.test.option")}
                                        fullWidth
                                        className="mb-20"
                                    />
                                </SimpleFormIterator>
                            </ArrayInput>

                            <TextInput
                                source="score"
                                label={translate("resources.test.score")}
                                type="number"
                                className="mb-20"
                            />
                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>
            )}

            {answerMode === "piano" && (
                <FormTab label={translate("resources.test.questions")}>
                    <ArrayInput source="questions" label={translate("resources.test.questions")} className={"numbered-question-list"}>

                        <SimpleFormIterator>

                            <TextInput
                                source="classes"
                                label={translate("resources.test.classes")}
                                fullWidth
                                className="mb-20"
                            />
                            <TextInput
                                source="answer"
                                label={translate("resources.test.answer")}
                                type="text"
                                className="mb-20"
                            />
                            <TextInput
                                source="score"
                                label={translate("resources.test.score")}
                                type="number"
                                className="mb-20"
                            />

                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>
            )}
        </TabbedForm>
    );
};

export default TestForm;
