import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Paper, Typography, IconButton, Divider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import type { MyEntityDTO, CustomColumn } from '../types/MyEntityDTO';

interface MyEntityFormProps {
    entity: MyEntityDTO;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
}

const MyEntityForm: React.FC<MyEntityFormProps> = ({ entity, onChange, onSubmit, isEdit }) => {
    const [customColumns, setCustomColumns] = useState<CustomColumn[]>(entity.customColumns || []);

    // Update entity.customColumns when customColumns state changes
    useEffect(() => {
        // This effect handles synchronizing our local state with the entity prop
        // We're creating a custom event to handle this without changing component props
        document.dispatchEvent(new CustomEvent('customColumnsChanged', {
            detail: { customColumns }
        }));
    }, [customColumns]);

    const handleAddCustomColumn = () => {
        setCustomColumns([...customColumns, { name: '', value: '' }]);
    };

    const handleRemoveCustomColumn = (index: number) => {
        const newColumns = [...customColumns];
        newColumns.splice(index, 1);
        setCustomColumns(newColumns);
    };

    const handleCustomColumnChange = (index: number, field: 'name' | 'value', value: string) => {
        const newColumns = [...customColumns];
        newColumns[index][field] = value;
        setCustomColumns(newColumns);
    };

    return (
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600, margin: 'auto', borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={600} mb={3} color="primary">
                {isEdit ? 'Edit' : 'Create'} Entity
            </Typography>
            <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
                <TextField
                    label="Name"
                    name="name"
                    value={entity.name || ''}
                    onChange={onChange}
                    fullWidth
                    required
                    margin="normal"
                    inputProps={{ maxLength: 100 }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Description"
                    name="description"
                    value={entity.description || ''}
                    onChange={onChange}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                    inputProps={{ maxLength: 255 }}
                    variant="outlined"
                    sx={{ mb: 3 }}
                />

                {/* Custom Columns Section */}
                <Box sx={{ mt: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} color="primary">
                            Custom Columns
                        </Typography>
                        <Button
                            startIcon={<AddCircleIcon />}
                            onClick={handleAddCustomColumn}
                            variant="outlined"
                            color="primary"
                            size="small"
                        >
                            Add Column
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 2 }} />
                    {customColumns.map((column, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 2, gap: 2 }} alignItems="center">
                            <TextField
                                label="Column Name"
                                fullWidth
                                size="small"
                                value={column.name}
                                onChange={(e) => handleCustomColumnChange(index, 'name', e.target.value)}
                                required
                                sx={{ flex: 5 }}
                            />
                            <TextField
                                label="Column Value"
                                fullWidth
                                size="small"
                                value={column.value}
                                onChange={(e) => handleCustomColumnChange(index, 'value', e.target.value)}
                                sx={{ flex: 5 }}
                            />
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                <IconButton
                                    color="error"
                                    onClick={() => handleRemoveCustomColumn(index)}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}

                    {customColumns.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                            No custom columns added yet. Click the button above to add one.
                        </Typography>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={() => document.dispatchEvent(new CustomEvent('closeDialog'))}
                        sx={{ px: 3 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ px: 3, fontWeight: 600 }}
                    >
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default MyEntityForm;
