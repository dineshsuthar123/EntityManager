import React from 'react';
import { Grid } from '@mui/material';
import type { GridBaseProps } from '@mui/material';
import type { SystemProps } from '@mui/system';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

type GridContainerProps = {
    children: React.ReactNode;
    spacing?: number;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
    sx?: SxProps<Theme>;
} & Omit<GridBaseProps & SystemProps<Theme>, 'component'>;

/**
 * A wrapper for MUI Grid container component that automatically adds the component="div" prop
 * to fix the "Property 'component' is missing" TypeScript error in MUI v7+
 */
export const GridContainer: React.FC<GridContainerProps> = ({ children, ...props }) => {
    return (
        <Grid component="div" container {...props}>
            {children}
        </Grid>
    );
};

export default GridContainer;
