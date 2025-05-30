import React, { useEffect } from 'react';
import { TextField, IconButton, Box, Typography } from '@mui/material';
import { useTranslate } from 'react-admin';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormContext } from 'react-hook-form';
// import MediaField from './MediaField';
const VideoArrayInput = ({ label, source }) => {
    const translate = useTranslate();
    const { getValues, setValue, watch } = useFormContext(); // watch to track form state
    const videos = getValues(source) || [];

    // Watch the source field for changes and trigger re-render
    const watchedVideos = watch(source);

    const handleAddVideo = () => {
        const newVideos = [...videos, { title: '', src: '' }];
        setValue(source, newVideos); // Update the form data using setValue
    };

    const handleRemoveVideo = (index) => {
        const newVideos = [...videos];
        newVideos.splice(index, 1);
        setValue(source, newVideos); // Update the form data using setValue
    };

    const handleFieldChange = (index, field, newValue) => {
        const newVideos = [...videos];
        newVideos[index] = { ...newVideos[index], [field]: newValue };
        setValue(source, newVideos); // Update the form data using setValue
    };

    useEffect(() => {
        // This will ensure that the form re-renders when `videos` changes
    }, [watchedVideos]); // Watch for changes in the videos array

    return (
        <Box className={'video-array-input'}>
            <label className={'video-array-input-label'}>{label}</label>
            <Box className={'video-array-input-inside'}>
                {watchedVideos.map((video, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                        <Box display="flex" flexDirection="column" flex={1} mr={2}>
                            <TextField
                                label={translate("resources.course.title")}
                                value={video.title}
                                onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                                fullWidth
                                variant="outlined"
                                style={{ marginBottom: 8 }}
                            />
                            <TextField
                                label={translate("resources.course.src")}
                                value={video.src}
                                onChange={(e) => handleFieldChange(index, 'src', e.target.value)}
                                fullWidth
                                variant="outlined"
                                style={{ marginBottom: 8 }}
                            />
                            {/*<MediaField*/}
                                {/*label={translate("resources.course.src")}*/}
                                {/*value={video.src}*/}
                                {/*onChange={(newSrc) => handleFieldChange(index, 'src', newSrc)}*/}
                            {/*/>*/}
                        </Box>
                        <IconButton color="secondary" onClick={() => handleRemoveVideo(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
                <IconButton color="primary" onClick={handleAddVideo}>
                    <AddCircleIcon />
                </IconButton>
                <Typography variant="body1" ml={1}>
                    {translate("resources.course.addVideo")}
                </Typography>
            </Box>
        </Box>
    );
};

export default VideoArrayInput;
