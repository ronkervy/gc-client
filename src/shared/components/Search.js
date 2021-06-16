import { Backdrop, Fade, Modal, TextField } from '@material-ui/core'
import React,{useEffect, useState} from 'react'

function Search(props) {

    const [open,setOpen] = useState(false);
    
    const handleClose = ()=>{
        setOpen(false);
    }

    useEffect(()=>{
        setOpen(true);
    },[]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout : 500
            }}
        >
            <Fade
                in={open}
            >
                <div>
                    <TextField 
                        autoFocus
                    />
                </div>
            </Fade>
        </Modal>
    )
}

export default Search
