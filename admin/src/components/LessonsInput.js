import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useTranslate, AutocompleteArrayInput, BooleanInput,SelectInput } from "react-admin";
import { RichTextInput } from "ra-input-rich-text";

import UploaderFieldBox from "./UploaderFieldBox";


import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

const CodeEditor = ({ source }) => {
    const translate = useTranslate();

    const { register, setValue, watch } = useFormContext();
    const code = watch(source); // Watch the value in the form

    return (
        <Box sx={{ mt: 2 }} className={'ltr-code'}>
            <Typography variant="body2">{translate("resources.lesson.practiceCode")}</Typography>
            <MonacoEditor
                height="200px"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(newValue) => setValue(source, newValue)}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
        </Box>
    );
};

const LessonsInput = ({ source }) => {
    const translate = useTranslate();
    const { control, register, watch } = useFormContext();
    const { fields: lessons, append, remove } = useFieldArray({ control, name: source });
    const LESSON_CHOICES = [
        { id: "question", name: translate("resources.lesson.question") },
        { id: "textbook", name: translate("resources.lesson.textbook") },
        { id: "media", name: translate("resources.lesson.media") },
        { id: "practice", name: translate("resources.lesson.practice")   },
    ];
    const PRACTICE_CHOICES = [
        { id: "pythonCode", name: translate("resources.lesson.pythonCode") }
    ];
    return (
        <Box sx={{ mt: 2 }} className="season-inputs">
            <Typography variant="subtitle1">{translate("resources.lesson.lessons")}</Typography>

            {lessons.map((lesson, lessonIndex) => {
                const lessonPath = `${source}.${lessonIndex}`;
                const lessonType = watch(`${lessonPath}.lessonType`);

                return (
                    <Box key={lesson.id} sx={{ border: "1px solid #ccc", p: 2, borderRadius: 2, mb: 2 }}>
                        {/* Lesson Title */}
                        <TextField
                            label={translate("resources.lesson.lessonTitle")}
                            fullWidth
                            {...register(`${lessonPath}.lessonTitle`)}
                        />

                        {/* Lesson Type Selector (Multiple Selection) */}
                        <AutocompleteArrayInput
                            source={`${lessonPath}.lessonType`}
                            label={translate("resources.lesson.lessonType")}
                            choices={LESSON_CHOICES}
                            fullWidth
                        />

                        {/* Conditional Fields Based on Lesson Type */}
                        {lessonType?.includes("textbook") && (
                            <RichTextInput
                                source={`${lessonPath}.textbook`}
                                label={translate("resources.lesson.textbook")}
                                fullWidth
                            />
                        )}

                        {lessonType?.includes("question") && (
                            <Box sx={{ mt: 1 }}>
                                <TextField
                                    label={translate("resources.lesson.questionText")}
                                    fullWidth
                                    {...register(`${lessonPath}.questionText`)}
                                />
                                <OptionsInput source={`${lessonPath}.options`} />
                            </Box>
                        )}
                        {lessonType?.includes("practice") && (
                            <Box sx={{ mt: 1 }}>

                                <RichTextInput
                                    source={`${lessonPath}.practiceText`}
                                    label={translate("resources.lesson.practiceText")}
                                    fullWidth
                                />
                                <SelectInput
                                    source={`${lessonPath}.practiceType`}
                                    label={translate("resources.lesson.practiceType")}
                                    choices={PRACTICE_CHOICES}
                                    fullWidth
                                />
                                <CodeEditor source={`${lessonPath}.practiceCode`} />
                            </Box>
                        )}
                        {lessonType?.includes("media") && (
                            <UploaderFieldBox
                                source={`${lessonPath}.video`}
                                label={translate("resources.lesson.uploadVideo")}
                                accept="video/*"
                                multiple={false}
                            />
                        )}

                        {/* Remove Lesson Button */}
                        <IconButton onClick={() => remove(lessonIndex)} color="error">
                            <Delete />
                        </IconButton>
                    </Box>
                );
            })}

            {/* Add Lesson Button */}
            <Button
                onClick={() => append({ lessonTitle: "", lessonType: [] })}
                startIcon={<Add />}
                variant="outlined"
            >
                {translate("resources.lesson.addLesson")}
            </Button>
        </Box>
    );
};

const OptionsInput = ({ source }) => {
    const { control, register } = useFormContext();
    const { fields: options, append, remove } = useFieldArray({ control, name: source });

    return (
        <Box sx={{ mt: 1 }}>
            {options.map((option, optionIndex) => (
                <Box key={option.id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                        label="Option"
                        fullWidth
                        {...register(`${source}.${optionIndex}.option`)}
                    />
                    <BooleanInput
                        source={`${source}.${optionIndex}.isAnswer`}
                        label="Correct Answer"
                    />
                    <IconButton onClick={() => remove(optionIndex)} color="error">
                        <Delete />
                    </IconButton>
                </Box>
            ))}
            <Button onClick={() => append({ option: "", isAnswer: false })} startIcon={<Add />} variant="outlined">
                Add Option
            </Button>
        </Box>
    );
};

export default LessonsInput;
