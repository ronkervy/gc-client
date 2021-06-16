import { CircularProgress, withStyles } from '@material-ui/core'
import React from 'react'
import useStyles from './Styles'

function Loader(props) {

    const { classes } = props;

    return (
        <div className={classes.ProgressWrap}>
            <CircularProgress size={70} />
        </div>
    )
}

export default withStyles(useStyles)(Loader)
