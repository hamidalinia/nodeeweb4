import { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Tab, Tabs, CircularProgress, Pagination, Skeleton } from '@mui/material';
import { useInput } from 'react-admin';
import { useWatch } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

import API from '@/functions/API';
import { MainUrl } from '@/functions';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';

const DropzoneUploader = ({ onFileUpload }) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'video/*, image/png, image/jpeg, image/svg+xml',
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileUpload(acceptedFiles[0]);  // Upload the first file
            }
        },
    });

    return (
        <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <p>Drag & drop a media file (image or video), or click to select one</p>
        </div>
    );
};

const UploaderFieldBox = ({ multiple, ...props }) => {
    const { field } = useInput(props);
    const { onChange } = field;

    let fieldValue = useWatch({ name: field.name }) || [];
    const [selectedMedia, setSelectedMedia] = useState(fieldValue);
    const [progress, setProgress] = useState(0);
    const [openMediaList, setOpenMediaList] = useState(false);
    const [tabIndex, setTabIndex] = useState(0); // 0 = Media Library, 1 = Upload
    const [mediaLibrary, setMediaLibrary] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // New state to store total pages

    useEffect(() => {
        if (Array.isArray(fieldValue)) {
            setSelectedMedia(fieldValue);
        }
    }, [fieldValue]);

    useEffect(() => {
        if (openMediaList && tabIndex === 0) {
            setLoading(true);
            const offset = (currentPage - 1) * 20; // Calculate the offset based on the page number

            // Make sure the API call happens only if the values are different than before
            API.get(`/media/${offset}/20`)
                .then((response) => {
                    const { headers, data } = response;
                    const totalCount = headers['x-total-count']; // Get the total count from headers
                    if (data) {
                        setMediaLibrary(data);
                        // Calculate total pages based on x-total-count
                        setTotalPages(Math.ceil(totalCount / 20));
                    }
                })
                .catch(() => setMediaLibrary([]))
                .finally(() => setLoading(false));
        }
    }, [openMediaList, tabIndex, currentPage]); // The effect depends on `openMediaList`, `tabIndex`, and `currentPage`

    const handleUpload = (files) => {
        let file = files[0];
        if (!file) return;

        let formData = new FormData();
        formData.append('file', file);
        formData.append('type', file.type);

        API.post('/media/fileUpload', formData, {
            onUploadProgress: (e) => {
                let p = Math.floor((e.loaded * 100) / e.total);
                setProgress(p);
            },
        })
            .then(({ data = {} }) => {
                if (data.success) {
                    let { url } = data.media;
                    setProgress(0);
                    setMediaLibrary((prev) => [...prev, data.media]); // Add to media library
                }
            })
            .catch(() => setProgress(0));
    };

    const handleOpenMediaList = () => {
        setOpenMediaList(true);
    };

    const handleCloseMediaList = () => {
        setOpenMediaList(false);
    };

    const handleSelectMedia = (mediaUrl) => {
        if (!mediaUrl) return;
        if (multiple) {
            // If multiple is true, add the selected media to the list
            let updatedMedia = [...selectedMedia, mediaUrl];
            setSelectedMedia(updatedMedia);
            onChange(updatedMedia);
        } else {
            // If multiple is false, set the selected media to a single item
            setSelectedMedia([mediaUrl]);
            onChange([mediaUrl]); // Update the form state with a single URL
        }
        setOpenMediaList(false);
    };

    const handleRemoveMedia = (index) => {
        let updatedMedia = [...selectedMedia];
        updatedMedia.splice(index, 1); // Remove the selected media at the given index
        setSelectedMedia(updatedMedia);
        onChange(updatedMedia); // Update the form state
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box>
            {selectedMedia.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    {selectedMedia.map((media, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                            {media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.ogg') ? (
                                <video src={MainUrl + '/' + media} controls width="150" height="100" />
                            ) : (
                                <img src={MainUrl + '/' + media} alt="Uploaded media" width="150" height="100" />
                            )}
                            {/* Remove button */}
                            <Button
                                sx={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    padding: '2px',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    fontSize: '12px',
                                    borderRadius: '50%',
                                }}
                                onClick={() => handleRemoveMedia(index)}
                            >
                                X
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}

            <Button variant="contained" color="primary" onClick={handleOpenMediaList}>
                Open Media Library
            </Button>

            <Dialog open={openMediaList} onClose={handleCloseMediaList} maxWidth="md" fullWidth>
                <DialogTitle>Manage Media</DialogTitle>

                <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
                    <Tab label="Media Library" />
                    <Tab label="Upload Media" />
                </Tabs>

                <DialogContent>
                    {loading ? (
                        <Box sx={{ textAlign: 'center', my: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {tabIndex === 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    {mediaLibrary.map((media, index) => (
                                        <Box
                                            key={index}
                                            style={{
                                                minWidth: '150px',  // Ensure a minimum width for the container
                                                position: 'relative',
                                                height: '150px',  // Set fixed height
                                            }}
                                            sx={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onClick={() => handleSelectMedia(media.url)}
                                        >
                                            {/* Skeleton Loader for Image Preview */}
                                            <Skeleton
                                                variant="rectangular"
                                                width="100%"
                                                height="100%"
                                                sx={{
                                                    borderRadius: '8px',
                                                    backgroundColor: '#f0f0f0',
                                                }}
                                            />
                                            <img
                                                src={MainUrl + '/' + media.url}
                                                alt="Media"
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    opacity: 0,
                                                    transition: 'opacity 0.5s ease',
                                                }}
                                                onLoad={(e) => e.target.style.opacity = 1} // Fade in image once loaded
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {tabIndex === 1 && (
                                <Box sx={{ mb: 2 }}>
                                    <DropzoneUploader onFileUpload={(file) => handleUpload([file])} />
                                    {progress ? <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} /> : null}
                                </Box>
                            )}
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseMediaList} color="secondary">
                        Close
                    </Button>
                </DialogActions>

                {tabIndex === 0 && !loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                            count={totalPages} // Dynamically set based on totalPages
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}
            </Dialog>
        </Box>
    );
};

export default UploaderFieldBox;
