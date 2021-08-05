export default (docs,logoURL)=>{

    let customer_name,transaction_date,transaction_type,total_amount;

    docs.map(doc=>{
        customer_name = doc[5].customer_name;
        transaction_date = new Date(doc[5].date).toLocaleDateString();
        transaction_type = doc[5].transact_type;
        total_amount = doc[5].total_amount;
        console.log(doc[5].total_amount);
    });

    return {
        pageSize : {
            width : 684,
            height : 396
        },
        pageMargins: [ 40, 50, 40, 60 ],
        header : (currentPage)=>{
            if( currentPage === 1 ){
                return {
                    columns : [
                        {
                            image : `data:image/png;base64,${logoURL}`,
                            width : 40,
                            height : 40,
                            margin : [20,3,0,0]
                        },
                        {
                            stack : [
                                {
                                    text : 'Glorious Cocolumber \n',
                                    style : 'header'
                                },
                                {
                                    text : 'and Construction Supply',
                                    style : 'subheader'
                                }
                            ],
                            margin : [20,12]
                        },
                        {
                            text : '4024 Old National Highway\nBrgy. San Antonio Biñan, Laguna\nCalabarzon, Philippines',                            
                            alignment : 'right',
                            margin : [0,12,20,12],
                            fontSize : 8             
                        }    
                    ],
                    margin : [20,8],
                    width : '*',
                }
            }
        },
        footer : (currentPage,pageCount)=>{
            if( currentPage === pageCount ){
                return {
                    columns : [
                        {
                            text : "\n_________________________ \n \n Prepared By",                            
                            alignment : 'left',
                            fontSize : 9
                        }, 
                        {
                            text : "\n_____________________________________ \n \n Signiture over printed name",                            
                            fontSize : 9,
                        },
                        {
                            text : [
                                { text : `Php. ${total_amount}\n`,alignment : 'center' },
                                `_________________________ \n \n`,
                                { text : 'Total Amount Purchased', alignment : 'center' }
                            ],
                            alignment : 'center',
                            fontSize : 9
                        }
                    ],
                    alignment : "center",
                    margin : [40,10,40,0],
                    width : '*'
                }
            }
        },
        content : [
            {                
                stack : [
                    {
                        columns : [
                            {
                                text : [
                                    'Customer Name : ',
                                    {
                                        text : `${customer_name}`,
                                        color : 'maroon',
                                        italics : true
                                    }
                                ],
                                bold : true,
                                fontSize : 11,
                                margin : [0,5,0,0]
                            },
                            {
                                text : [
                                    'Transaction Date : ',
                                    {
                                        text : `${transaction_date}`,
                                        color : 'maroon',
                                        italics : true
                                    }
                                ],
                                bold : true,
                                fontSize : 11,
                                alignment : 'right',
                                margin : [0,5,0,0]
                            },
                        ],
                        
                    },
                    {
                        columns : [
                            {
                                text : [
                                    'Payment Type : ',
                                    {
                                        text : `${transaction_type}`,
                                        color : transaction_type == 'full' ? 'green' : 'maroon',
                                        italics : true
                                    }
                                ],
                                bold : true,
                                fontSize : 11,
                                margin : [0,5,0,10]
                            }
                        ]
                    },
                    {
                        layout : {
                            hLineWidth : (i,node)=>{
                                return (i === 0 || i === node.table.body.length) ? 1 : 0;
                            },
                            hLineHeight : (i,node)=>{
                                return (i === 1) ? 0 : 1;
                            },
                            paddingBottom: (i, node, colIndex) => {
                                const DEFAULT_PADDING = 2;
                                // Calculate padding for the last element of the table.
                                if (i === node.table.body.length - 1) {
                                    const currentPosition = node.positions[node.positions.length - 1];
                                    const totalPageHeight = currentPosition.pageInnerHeight;
                                    const currentHeight = currentPosition.top;
                                    const paddingBottom = totalPageHeight - currentHeight;
                                    
                                    if( paddingBottom < 0 ){
                                        return DEFAULT_PADDING;
                                    }else{
                                        return paddingBottom;
                                    }                                    
                                } else {
                                    return DEFAULT_PADDING;
                                }
                            }
                        },
                        table : {
                            dontBreakRows : false,
                            headerRows: 1,
                            widths: [ '*','*', 40, 50,'*', '*'],
                            body: [
                                [
                                    {
                                        text : 'Item Name',
                                        style : 'tableHeader'
                                    }, 
                                    {
                                        text : 'Supplier',
                                        style : 'tableHeader'
                                    },
                                    {
                                        text : 'Quantity',
                                        style : 'tableHeader'
                                    },
                                    {
                                        text : 'Price',
                                        style : 'tableHeader'
                                    },
                                    {
                                        text : 'Total Qty Price',
                                        style : 'tableHeader'
                                    },
                                    {
                                        text : 'Discount',
                                        style : 'tableHeader'
                                    },                                    
                                ],    
                                ...docs                                                      
                            ]
                        }
                    }                    
                ],                
                margin : [0,20,0,0]
            }
        ],
        styles : {
            header : {
                bold : true,
            },
            subheader : {
                fontSize : 9
            },
            tableHeader : {
                fontSize : 10,
                color : 'white',
                fillColor : 'grey',
                alignment : 'center',
                margin : [0,6],
                border : [true,false,true,false]
            },
            tableItems : {
                alignment : 'center',
                margin : [0,6],
                fontSize : 9
            }
        },
        defaultStyle : {
            font : 'Roboto',
            columnGap : 5
        }
    }
}