const useStyles = {
    '@global' : {
        body : {
            height : '100%',
            margin : '0px',
            '& #root' : {
                height : '100%',
            },
            overflow : 'hidden',
            position : 'relative'
        },
        html : {
            height : '95%',
            margin : '0px',
            padding : '20px',
        }
    },

    root : {
        height : '100%',
        background : '#EBEBF7',
        padding : "20px",
        borderRadius : '20px',
        position : 'relative'
    },
    
    ContainerWrap : {
        height : 'auto',
        padding : '20px 0px 0px 0px !important',
        position : 'relative'
    }
}

export default useStyles;