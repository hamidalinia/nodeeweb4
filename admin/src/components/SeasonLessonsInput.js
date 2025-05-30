import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useTranslate } from "react-admin";
import { Autocomplete } from "@mui/material";

import UploaderFieldBox from "./UploaderFieldBox";
import { getLessons } from "@/functions"; // Assuming getLessons is in this path

const SeasonLessonsInput = ({ source }) => {
    const translate = useTranslate();
    const { control, setValue, watch, register } = useFormContext();
    const { fields: seasons, append, remove } = useFieldArray({ control, name: source });

    useEffect(() => {
        if (!Array.isArray(watch(source))) {
            setValue(source, []);
        }
    }, [watch, source, setValue]);

    return (
        <Box className={"season-inputs"}>
            <Typography variant="h6">{translate("resources.course.seasons")}</Typography>

            {seasons.map((season, seasonIndex) => (
                <Box key={season.id} sx={{ border: "1px solid #ddd", borderRadius: 2, padding: 2, marginBottom: 4 }}>
                    {/* Season Title Input */}
                    <TextField
                        label={translate("resources.course.seasonTitle")}
                        fullWidth
                        {...register(`${source}.${seasonIndex}.seasonTitle`)}
                    />

                    {/* Lessons Section */}
                    <LessonsInput source={`${source}.${seasonIndex}.lessons`} />

                    <TextField
                        className={'mt-4'}
                        label={translate("resources.course.score")}
                        fullWidth
                        {...register(`${source}.${seasonIndex}.score`)}
                    />
                    {/* Remove Season Button */}
                    <IconButton onClick={() => remove(seasonIndex)} color="error">
                        <Delete />
                    </IconButton>
                </Box>
            ))}

            {/* Add Season Button */}
            <Button
                onClick={() => append({ seasonTitle: "", lessons: [] })}
                startIcon={<Add />}
                variant="outlined"
            >
                {translate("resources.course.addSeason")}
            </Button>
        </Box>
    );
};

const LessonsInput = ({ source }) => {
    const translate = useTranslate();
    const { control, register, watch, setValue } = useFormContext();
    const { fields: lessons, append, remove } = useFieldArray({ control, name: source });

    const [lessonOptions, setLessonOptions] = useState([]); // List of available lessons

    useEffect(() => {
        // Fetch lessons using the getLessons function
        const fetchLessons = async () => {
            try {
                const lessonsData = await getLessons();

                // Extract and combine both secondTitle.fa and title.fa
                const allLessons = lessonsData.map(item => ({
                    id: item._id, // Lesson ID
                    title: item.title.fa, // First title
                    secondTitle: item.secondTitle.fa // Second title
                }));

                setLessonOptions(allLessons);
            } catch (error) {
                console.error("Failed to fetch lessons:", error);
            }
        };

        fetchLessons();
    }, []);

    return (
        <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1">{translate("resources.course.lessons")}</Typography>

            {lessons.map((lesson, lessonIndex) => {
                const lessonPath = `${source}.${lessonIndex}`;

                return (
                    <Box key={lesson.id} sx={{ border: "1px solid #ccc", padding: 2, borderRadius: 2, marginBottom: 2 }}>

                        {/* Custom Searchable Lesson Selector */}
                        <Autocomplete
                            options={lessonOptions}
                            getOptionLabel={(option) => `${option.title} - ${option.secondTitle}`} // Combining both titles
                            value={lessonOptions.find((lesson) => lesson.id === watch(`${lessonPath}.lessonRef`)) || null} // Set default value based on form value
                            onChange={(event, newValue) => {
                                setValue(`${lessonPath}.lessonRef`, newValue ? newValue.id : null); // Store the selected lesson's ID
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={translate("resources.course.lessonType")}
                                    fullWidth
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.title} - {option.secondTitle}
                                </li>
                            )}
                        />


                        {/* Remove Lesson Button */}
                        <IconButton onClick={() => remove(lessonIndex)} color="error">
                            <Delete />
                        </IconButton>
                    </Box>
                );
            })}

            {/* Add Lesson Button */}
            <Button
                onClick={() => append({ lessonRef: null })}
                startIcon={<Add />}
                variant="outlined"
            >
                {translate("resources.course.addLesson")}
            </Button>
        </Box>
    );
};

export default SeasonLessonsInput;
