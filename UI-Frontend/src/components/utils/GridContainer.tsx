import React from 'react';
import Grid from '@mui/material/Grid';
import type { SxProps, Theme } from '@mui/material/styles';

type GridContainerProps = {
    children: React.ReactNode;
    spacing?: number;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
    sx?: SxProps<Theme>;
};

/**
 * A wrapper for MUI Grid container component for MUI v7+
 */
export const GridContainer: React.FC<GridContainerProps> = ({ 
    children, 
    spacing,
    direction,
    justifyContent,
    alignItems,
    sx,
    ...rest 
}) => {
    return (
        <Grid 
            container 
            spacing={spacing}
            direction={direction}
            justifyContent={justifyContent}
            alignItems={alignItems}
            sx={sx}
            {...rest}
        >
            {children}
        </Grid>
    );
};

export default GridContainer;
