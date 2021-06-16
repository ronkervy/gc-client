import { Grid, Paper, Typography, withStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import Cart from '../../cart/components/Cart';
import ProductsList from '../../products/components/ProductsList';
import Styles from './Styles';


function Dashboard(props) {

    const { ContentBlock,Dashboard,infoBlock } = props.classes;

    return (
        <Grid container className={Dashboard} spacing={2}>
            <Grid direction="column" item container lg={6} sm={6}> 
                <Cart />
            </Grid>    
            <Grid 
                item lg={6} 
                sm={6} 
                className={ContentBlock}
            >
                <ProductsList />
            </Grid>  
        </Grid>
    )
}

export default withStyles(Styles)(Dashboard)
