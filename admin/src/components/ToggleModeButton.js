import React, { useState, useEffect } from 'react';
import { ToggleButton } from '@mui/material';
import { ViewList, DeveloperMode } from '@mui/icons-material'; // Icons for modes
import Tooltip from '@mui/material/Tooltip'; // Tooltip component
import { useTheme } from '@mui/material/styles'; // To access the theme
import { useTranslate } from 'react-admin';


export default (props) => {
    const translate = useTranslate()
    const [alignment, setAlignment] = useState(() => {
        return localStorage.getItem('client_mode') || 'advanced'; // Default to advanced mode
    });

    const handleChange = () => {
        const newAlignment = alignment === 'simple' ? 'advanced' : 'simple';
        setAlignment(newAlignment);
        console.log(newAlignment); // Log the selected value for debugging
        localStorage.setItem('client_mode', newAlignment); // Save to localStorage
        window.location.reload();
      };

    useEffect(() => {
        if (!localStorage.getItem('client_mode')) {
            localStorage.setItem('client_mode', 'advanced');
        }
    }, []);

    const theme = useTheme(); // Access theme to get the primary text color
    const isDarkMode = theme.palette.mode === 'dark';
    useEffect(()=>{
      console.log("theme mode", theme)
    },)

    return (
        <Tooltip
            title={translate(`resources.${alignment}Mode`)}
            arrow
            sx={{
                '.MuiTooltip-tooltip': {
                    color: '#ffffff', // Apply primary text color from the theme
                    fontSize: '0.875rem', // Adjust font size (optional)
                    fontWeight: theme.typography.fontWeightRegular, // Match MenuItemLink style
                    backgroundColor: 'rgba(0, 0, 0, 0.87)', // Set background based on theme mode
                }
            }}
        >
            <ToggleButton
                color="primary"
                value={alignment}
                onChange={handleChange}
                aria-label="Client Mode"
                sx={{ border: 'none',
                  color:'#ffffff'
                }}
            >
                {alignment === 'simple' ? <ViewList /> : <DeveloperMode />} 
            </ToggleButton>
        </Tooltip>
    );
};
