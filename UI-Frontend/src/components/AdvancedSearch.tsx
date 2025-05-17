import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Grid,
    Chip,
    Collapse,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { CustomColumnType } from '../types/MyEntityDTO';
import type { MyEntityDTO } from '../types/MyEntityDTO';

interface SearchCriteria {
    field: string;
    operator: string;
    value: string;
}

interface AdvancedSearchProps {
    onSearch: (criteria: SearchCriteria[]) => void;
    availableFields: { name: string, type: CustomColumnType }[];
    entities?: MyEntityDTO[]; // Making this optional to maintain backward compatibility
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, availableFields, entities = [] }) => {
    const [expanded, setExpanded] = useState(false);
    const [criteria, setCriteria] = useState<SearchCriteria[]>([
        { field: 'name', operator: 'contains', value: '' }
    ]);
    const [filteredEntities, setFilteredEntities] = useState<MyEntityDTO[]>(entities);

    // When entities prop changes, update our filteredEntities state
    useEffect(() => {
        setFilteredEntities(entities);
    }, [entities]);

    const getOperatorsByType = (type: CustomColumnType) => {
        switch (type) {
            case CustomColumnType.NUMBER:
            case CustomColumnType.CURRENCY:
                return [
                    { value: 'equals', label: 'Equals' },
                    { value: 'greater_than', label: 'Greater than' },
                    { value: 'less_than', label: 'Less than' },
                    { value: 'between', label: 'Between' }
                ];
            case CustomColumnType.DATE:
                return [
                    { value: 'equals', label: 'On' },
                    { value: 'after', label: 'After' },
                    { value: 'before', label: 'Before' },
                    { value: 'between', label: 'Between' }
                ];
            case CustomColumnType.BOOLEAN:
                return [
                    { value: 'equals', label: 'Is' }
                ];
            default:
                return [
                    { value: 'contains', label: 'Contains' },
                    { value: 'equals', label: 'Equals' },
                    { value: 'starts_with', label: 'Starts with' },
                    { value: 'ends_with', label: 'Ends with' }
                ];
        }
    };

    const handleAddCriteria = () => {
        setCriteria([...criteria, { field: 'name', operator: 'contains', value: '' }]);
    };

    const handleRemoveCriteria = (index: number) => {
        const newCriteria = [...criteria];
        newCriteria.splice(index, 1);
        setCriteria(newCriteria);
    };

    const handleChangeCriteria = (index: number, field: keyof SearchCriteria, value: string) => {
        const newCriteria = [...criteria];
        newCriteria[index] = { ...newCriteria[index], [field]: value };

        // Reset operator when field changes
        if (field === 'field') {
            const fieldType = availableFields.find(f => f.name === value)?.type || CustomColumnType.TEXT;
            newCriteria[index].operator = getOperatorsByType(fieldType)[0].value;
        }

        setCriteria(newCriteria);
    }; const handleSearch = () => {
        const validCriteria = criteria.filter(c => c.value !== '');

        // Filter entities based on search criteria
        if (validCriteria.length > 0 && entities.length > 0) {
            const filtered = entities.filter(entity => {
                return validCriteria.every(criterion => {
                    const { field, operator, value } = criterion;

                    // Handle standard fields
                    if (field === 'name' || field === 'description') {
                        const entityValue = entity[field as keyof typeof entity];

                        if (typeof entityValue === 'string') {
                            switch (operator) {
                                case 'contains':
                                    return entityValue.toLowerCase().includes(value.toLowerCase());
                                case 'equals':
                                    return entityValue.toLowerCase() === value.toLowerCase();
                                case 'starts_with':
                                    return entityValue.toLowerCase().startsWith(value.toLowerCase());
                                case 'ends_with':
                                    return entityValue.toLowerCase().endsWith(value.toLowerCase());
                                default:
                                    return true;
                            }
                        }
                        return false;
                    }

                    // Handle date fields
                    if (field === 'createdDate' || field === 'lastModifiedDate') {
                        if (!entity[field as keyof typeof entity]) return false;

                        const entityDate = new Date(entity[field as keyof typeof entity] as string);
                        const searchDate = new Date(value);

                        switch (operator) {
                            case 'equals':
                                return entityDate.toDateString() === searchDate.toDateString();
                            case 'after':
                                return entityDate > searchDate;
                            case 'before':
                                return entityDate < searchDate;
                            default:
                                return true;
                        }
                    }

                    // Handle custom columns
                    if (entity.customColumns) {
                        const customColumn = entity.customColumns.find(col => col.name === field);
                        if (customColumn) {
                            const columnValue = customColumn.value;

                            switch (operator) {
                                case 'contains':
                                    return columnValue.toLowerCase().includes(value.toLowerCase());
                                case 'equals':
                                    return columnValue.toLowerCase() === value.toLowerCase();
                                case 'starts_with':
                                    return columnValue.toLowerCase().startsWith(value.toLowerCase());
                                case 'ends_with':
                                    return columnValue.toLowerCase().endsWith(value.toLowerCase());
                                default:
                                    return true;
                            }
                        }
                    }

                    return false;
                });
            });

            setFilteredEntities(filtered);
            onSearch(validCriteria);
        } else {
            setFilteredEntities(entities);
            onSearch(validCriteria);
        }
    };

    const handleClear = () => {
        setCriteria([{ field: 'name', operator: 'contains', value: '' }]);
        setFilteredEntities(entities); // Reset to original entities
    };

    const getFieldType = (fieldName: string): CustomColumnType => {
        return availableFields.find(f => f.name === fieldName)?.type || CustomColumnType.TEXT;
    };

    return (
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Search</Typography>
                </Box>
                <Button
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    startIcon={expanded ? <RemoveIcon /> : <AddIcon />}
                >
                    {expanded ? 'Simple Search' : 'Advanced Search'}
                </Button>
            </Box>

            <Collapse in={!expanded}>
                <TextField
                    fullWidth
                    placeholder="Search by name..."
                    value={criteria[0].value}
                    onChange={(e) => handleChangeCriteria(0, 'value', e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        endAdornment: criteria[0].value && (
                            <IconButton size="small" onClick={() => handleChangeCriteria(0, 'value', '')}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )
                    }}
                    sx={{ mb: 1 }}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    fullWidth
                >
                    Search
                </Button>
            </Collapse>

            <Collapse in={expanded}>
                {criteria.map((criterion, index) => {
                    const fieldType = getFieldType(criterion.field);
                    return (
                        <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Field</InputLabel>
                                    <Select
                                        value={criterion.field}
                                        label="Field"
                                        onChange={(e) => handleChangeCriteria(index, 'field', e.target.value)}
                                    >
                                        {availableFields.map((field) => (
                                            <MenuItem key={field.name} value={field.name}>
                                                {field.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Operator</InputLabel>
                                    <Select
                                        value={criterion.operator}
                                        label="Operator"
                                        onChange={(e) => handleChangeCriteria(index, 'operator', e.target.value)}
                                    >
                                        {getOperatorsByType(fieldType).map((op) => (
                                            <MenuItem key={op.value} value={op.value}>
                                                {op.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                {fieldType === CustomColumnType.BOOLEAN ? (
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Value</InputLabel>
                                        <Select
                                            value={criterion.value}
                                            label="Value"
                                            onChange={(e) => handleChangeCriteria(index, 'value', e.target.value)}
                                        >
                                            <MenuItem value="true">True</MenuItem>
                                            <MenuItem value="false">False</MenuItem>
                                        </Select>
                                    </FormControl>
                                ) : fieldType === CustomColumnType.DATE ? (
                                    <TextField
                                        fullWidth
                                        type="date"
                                        size="small"
                                        value={criterion.value}
                                        onChange={(e) => handleChangeCriteria(index, 'value', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                ) : (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Value"
                                        value={criterion.value}
                                        onChange={(e) => handleChangeCriteria(index, 'value', e.target.value)}
                                        type={fieldType === CustomColumnType.NUMBER || fieldType === CustomColumnType.CURRENCY ? 'number' : 'text'}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <IconButton
                                    color="error"
                                    onClick={() => handleRemoveCriteria(index)}
                                    disabled={criteria.length === 1}
                                    size="small"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    )
                })}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddCriteria}
                        variant="outlined"
                    >
                        Add Condition
                    </Button>
                    <Box>
                        <Button
                            onClick={handleClear}
                            sx={{ mr: 1 }}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            startIcon={<SearchIcon />}
                        >
                            Search
                        </Button>
                    </Box>
                </Box>            </Collapse>

            {/* Display Filtered Results */}
            {criteria.some(c => c.value) && (
                <Box sx={{ mt: 3 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Search Results {filteredEntities.length > 0 && `(${filteredEntities.length})`}
                    </Typography>

                    {filteredEntities.length === 0 ? (
                        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.05)' }}>
                            <Typography color="text.secondary">
                                No entities found matching your search criteria.
                            </Typography>
                        </Paper>
                    ) : (
                        <Box sx={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Name</th>
                                        <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEntities.map((entity) => (
                                        <tr key={entity.id}>
                                            <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>{entity.name}</td>
                                            <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>{entity.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    )}
                </Box>
            )}
        </Paper>
    );
};

export default AdvancedSearch;
