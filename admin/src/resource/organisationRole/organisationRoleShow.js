import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
    Create,
    useTranslate,
} from 'react-admin';
import { Card, CardContent, CardHeader, Button, TextField, Select, MenuItem,FormControlLabel,Checkbox } from '@mui/material';
import API from '@/functions/API';

const organisationRoleShow = (props) => {
    const translate = useTranslate();
    const { id } = useParams(); // Category ID
    const [updateType, setUpdateType] = useState('percentage'); // 'percentage' or 'constant'
    const [updateValue, setUpdateValue] = useState('');
    const [operation, setOperation] = useState('add'); // 'add' or 'subtract'
    const [productCount, setProductCount] = useState(0); // State to store product count
    const [isChecked, setIsChecked] = useState(false);

    // Fetch product count when component loads
    useEffect(() => {
        const fetchProductCount = async () => {
            try {
                const response = await API.post(`/productCategory/${id}/product-count`);
                if (response.status === 200 && response.data) {
                    setProductCount(response.data.count || 0); // Assuming API returns { count: number }
                } else {
                    setProductCount(0);
                }
            } catch (error) {
                console.error('Error fetching product count:', error);
                setProductCount(0);
            }
        };

        fetchProductCount();
    }, [id]);

    const handlePriceUpdate = async () => {
        if (!updateValue || isNaN(updateValue)) {
            alert(translate('Invalid value'));
            return;
        }

        try {
            const response = await API.post(`/productCategory/${id}/update-prices`, JSON.stringify({
                updateType,
                value: parseFloat(updateValue),
                operation, // Add operation (add or subtract)
                updateSalePrice:isChecked
            }));

            if (response.status === 200) {
                alert(translate('Prices updated successfully'));
            } else {
                alert(translate('Failed to update prices'));
            }
        } catch (error) {
            console.error('Error updating prices:', error);
            alert(translate('An error occurred'));
        }
    };

    return (
        <Create {...props}>
            <Card className={'update-price-box '+translate('direction')} style={{ marginTop: '20px' }}>
                <CardHeader
                    title={`${translate('resources.product.UpdatePricesForCategory')} (${productCount} ${translate('resources.product.products')})`}
                />
                <CardContent>
                    <Select
                        value={updateType}
                        onChange={(e) => setUpdateType(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '16px' }}
                    >
                        <MenuItem value="percentage">{translate('resources.product.Percentage')}</MenuItem>
                        <MenuItem value="constant">{translate('resources.product.Constant')}</MenuItem>
                    </Select>
                    <TextField
                        type="number"
                        label={translate('Value')}
                        value={updateValue}
                        onChange={(e) => setUpdateValue(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '16px' }}
                    />
                    <Select
                        value={operation}
                        onChange={(e) => setOperation(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '16px' }}
                    >
                        <MenuItem value="add">{translate('resources.product.Add')}</MenuItem>
                        <MenuItem value="subtract">{translate('resources.product.Subtract')}</MenuItem>
                    </Select>
                    {operation === 'subtract' && (
                        <div><FormControlLabel
                            control={
                                <Checkbox
                                    checked={isChecked}
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={translate('resources.product.UpdateSalePriceBasedOnPrice')}
                        /></div>
                    )}
                    <Button variant="contained" color="primary" onClick={handlePriceUpdate}>
                        {translate('resources.product.updatePrices')}
                    </Button>
                </CardContent>
            </Card>
        </Create>
    );
};

export default React.memo(organisationRoleShow);
