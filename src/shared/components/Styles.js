const useStyles = {
    ProgressWrap : {
        top : 0,
        left : 0,
        display : "flex",
        position: "fixed",
        justifyContent : "center",
        flexDirection : "column",
        alignItems : "center",
        zIndex : 100,
        backgroundColor : "rgba(0, 0, 0, 0.9)",
        height: "700px",
        width : "100%",
        transition : "all 300ms linear",
        borderRadius : '20px'
    },
    HeaderWrap : {
        height : '60px',
        padding : '20px 0px',
        borderRadius : '10px',
        WebkitAppRegion : 'drag'
    }
}

export default useStyles;