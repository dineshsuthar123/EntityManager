import React, { useMemo } from 'react';
import type { MyEntityDTO, CustomColumn } from '../types/MyEntityDTO';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface MyEntityListProps {
    entities: MyEntityDTO[];
    onEdit: (entity: MyEntityDTO) => void;
    onDelete: (id: number) => void;
}

const MyEntityList: React.FC<MyEntityListProps> = ({ entities, onEdit, onDelete }) => {
    // Collect all unique custom column names across all entities
    const customColumnNames = useMemo(() => {
        const columnNames = new Set<string>();
        entities.forEach(entity => {
            entity.customColumns?.forEach(col => {
                if (col.name) {
                    columnNames.add(col.name);
                }
            });
        });
        return Array.from(columnNames);
    }, [entities]);

    // Function to get a custom column value for a specific entity
    const getCustomColumnValue = (entity: MyEntityDTO, columnName: string): string | undefined => {
        return entity.customColumns?.find(col => col.name === columnName)?.value;
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 4, width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.light' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                        {customColumnNames.map(name => (
                            <TableCell key={name} sx={{ fontWeight: 'bold' }}>
                                {name}
                            </TableCell>
                        ))}
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entities.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3 + customColumnNames.length} align="center" sx={{ py: 3 }}>
                                No entities found. Click "Add New Entity" to create one.
                            </TableCell>
                        </TableRow>
                    ) : (
                        entities.map((entity) => (
                            <TableRow key={entity.id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                                <TableCell>{entity.name}</TableCell>
                                <TableCell>{entity.description}</TableCell>
                                {customColumnNames.map(name => (
                                    <TableCell key={name}>
                                        {getCustomColumnValue(entity, name) || '-'}
                                    </TableCell>
                                ))}
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => onEdit(entity)} size="small" sx={{ mr: 1 }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => entity.id && onDelete(entity.id)} size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MyEntityList;
