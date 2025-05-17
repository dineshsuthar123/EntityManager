import React from 'react';
import { Grid } from '@mui/material';
import type { GridBaseProps } from '@mui/material';
import type { SystemProps } from '@mui/system';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

type GridItemProps = {
    children: React.ReactNode;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    sx?: SxProps<Theme>;
} & Omit<GridBaseProps & SystemProps<Theme>, 'component'>;

/**
 * A wrapper for MUI Grid component that automatically adds the component="div" prop
 * to fix the "Property 'component' is missing" TypeScript error in MUI v7+
 */
export const GridItem: React.FC<GridItemProps> = ({ children, ...props }) => {
    return (
        <Grid component="div" item {...props}>
            {children}
        </Grid>
    );
};

export default GridItem;
