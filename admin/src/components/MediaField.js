import React, { useState } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useTranslate } from 'react-admin';
import UploaderFieldBox from './UploaderFieldBox'; // Import the media picker

const MediaField = ({ label, value, onChange }) => {
    const translate = useTranslate();
    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleMediaSelect = (mediaUrl) => {
        onChange(mediaUrl); // Pass the selected media URL to parent
        setOpenDialog(false); // Close the dialog after selection
    };

    return (
        <>
            <TextField
                label={label || translate('resources.course.src')}
                value={value ? value : ''} // Ensure that the value is not undefined
                onClick={handleDialogOpen} // Open dialog when clicked
                fullWidth
                variant="outlined"
                style={{ marginBottom: 8 }}
            />

            <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="md">
                <DialogTitle>{translate("resources.course.selectMedia")}</DialogTitle>
                <DialogContent>
                    <UploaderFieldBox
                        multiple={false}
                        onChange={handleMediaSelect} // Handle the selected media URL
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        {translate('action.close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MediaField;
