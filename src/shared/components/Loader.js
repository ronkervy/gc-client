import { CircularProgress, withStyles } from '@material-ui/core'
import React,{ useState,useEffect } from 'react'
import useStyles from './Styles'

function Loader(props) {

    const { classes } = props;
    const [progress,setProgress] = useState('Loading');

    return (
        <div className={classes.ProgressWrap}>
            <CircularProgress size={70} />
            <h4
                style={{
                    textAlign : "center",
                    color : "white",
                    letterSpacing : "10px"
                }}
            >{progress}</h4>
        </div>
    )
}

export default withStyles(useStyles)(Loader)
