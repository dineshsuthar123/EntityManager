import React from 'react';
import Grid from '@mui/material/Grid';
import type { SxProps, Theme } from '@mui/material/styles';

type GridItemProps = {
    children: React.ReactNode;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
    sx?: SxProps<Theme>;
};

/**
 * A wrapper for MUI Grid component that handles responsive sizing
 * Works with MUI v7+ using the size prop syntax
 */
export const GridItem: React.FC<GridItemProps> = ({ 
    children, 
    xs, 
    sm, 
    md, 
    lg, 
    xl,
    sx,
    ...rest 
}) => {
    // Build the size prop for MUI v7
    const sizeProps: Record<string, number | boolean | undefined> = {};
    if (xs !== undefined) sizeProps.xs = xs;
    if (sm !== undefined) sizeProps.sm = sm;
    if (md !== undefined) sizeProps.md = md;
    if (lg !== undefined) sizeProps.lg = lg;
    if (xl !== undefined) sizeProps.xl = xl;

    return (
        <Grid size={sizeProps} sx={sx} {...rest}>
            {children}
        </Grid>
    );
};

export default GridItem;
