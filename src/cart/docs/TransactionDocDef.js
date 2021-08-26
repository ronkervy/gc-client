import pdfmake from 'pdfmake/build/pdfmake';
const formatter = new Intl.NumberFormat('en-PH',{
    style : 'currency',
    currency : 'Php'
});

pdfmake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    },
    Charlie_dotted : {
        normal : 'charlie_dotted.ttf',
        bold : 'charlie_dotted.ttf',
        italics : 'charlie_dotted.ttf',
        bolditalics : 'charlie_dotted.ttf'
    },
    DOT_MATRIX : {
        normal : 'DOTMATRI.TTF',
        bold : 'DOTMATRI.TTF',
        italics : 'DOTMATRI.TTF',
        bolditalics : 'DOTMATRI.TTF'
    },
    FAKE_RECEIPT : {
        normal : 'fake receipt.ttf',
        bold : 'fake receipt.ttf',
        italics : 'fake receipt.ttf',
        bolditalics : 'fake receipt.ttf'
    }
}

export default (docs,logoURL)=>{
    let discountArr = [];
    let customer_name,
        transaction_date,
        transaction_type,
        total_amount,
        change_amount,
        cash_amount,
        _id
    ;

    docs.map(doc=>{
        let less = ( doc[4].discount * doc[4].price);
        customer_name = doc[4].customer_name;
        transaction_date = new Date(doc[4].date).toLocaleDateString();
        transaction_type = doc[4].transact_type;
        total_amount = doc[4].total_amount;
        change_amount = doc[4].change_amount;
        cash_amount = doc[4].cash_amount;
        _id = doc[4]._id;
        console.log(typeof(doc[4].total_amount));
        discountArr.push(less);
    });

    let discount = discountArr.reduce((a,b)=>a+b,0);    

    return {
        pageSize : {
            width : 684,
            height : 396
        },
        pageMargins: [ 40, 50, 40, 90 ],
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
                                    text : 'GLORIOCITY \n',
                                    style : 'header'
                                },
                                {
                                    text : 'CONSTRUCTION SUPPLY',
                                    style : 'subheader'
                                }
                            ],
                            margin : [20,12]
                        },
                        {
                            stack : [
                                {
                                    text : '4024 BLOCK 2 LOT 17-18',
                                    color : "#808080"
                                },
                                {
                                    text : 'MONDO STRIP JUBILATION',
                                    color : "#808080"
                                },
                                {
                                    text : 'BRGY.PLATERO',
                                    color : "#808080"
                                }
                            ],
                            alignment : 'right',
                            margin : [20,12],
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
                    stack : [
                        {
                            table : {
                                widths : ['*',150,150],
                                headerRows : 1,
                                body : [
                                    [
                                        {
                                            text : "Prepared by : ",
                                            style : {
                                                fontSize : 9
                                            }
                                        },
                                        {
                                            text : `Discount : ${formatter.format(discount)}`,
                                            style : {
                                                fontSize : 9,
                                                font : 'Roboto'
                                            }
                                        },
                                        {
                                            text : `Amount to pay : ${formatter.format(total_amount)}`,
                                            style : {
                                                fontSize : 9,
                                                font : 'Roboto'
                                            }
                                        }
                                    ],
                                    [ 
                                        { 
                                            text : "", 
                                            border : [false,false,false,false],
                                        },
                                        {
                                            text : [
                                                `Cash : `,
                                                { text : `${cash_amount}`,style : { alignment : "center", font : "Roboto" } }
                                            ]
                                        }, 
                                        { 
                                            text : `Change : ${change_amount}`,
                                            style : {
                                                font : 'Roboto'
                                            }
                                        } 
                                    ]
                                ]                        
                            }
                        },
                        {
                            text : "**** Nothing Follows ****",                            
                            style : {
                                fontSize : 7,        
                                color : "#808080"                     
                            },
                            alignment : "center",
                            margin : [0,7,0,0]
                        },
                        {
                            text : "Received goods in order and prestine condition\n\nby:______________________________________",                            
                            style : {
                                fontSize : 7,                         
                            },
                            alignment : "right",
                            margin : [0,7,0,0]
                        }
                    ],                    
                    margin : [40,0]                 
                }
            }
        },
        content : [
            {
                columns : [
                    { 
                        text : "ORDER SLIP", 
                        style : 
                        { 
                            fontSize : 12,
                            color : "#808080" 
                        } 
                    }
                ],
                alignment : "center"
            },
            {                
                stack : [
                    {
                        columns : [
                            {
                                text : [
                                    'Customer Name : ',
                                    {
                                        text : `${customer_name}`,
                                        italics : true
                                    }
                                ],
                                bold : true,
                                fontSize : 9,
                                margin : [0,5,0,0]
                            },
                            {
                                text : [
                                    'Transaction Date : ',
                                    {
                                        text : `${transaction_date}`,
                                        italics : true
                                    }
                                ],
                                bold : true,
                                fontSize : 9,
                                margin : [0,5,0,0]
                            },
                        ],
                        
                    },
                    {
                        columns : [                            
                            {
                                text : [
                                    'Total Amount : ',
                                    {
                                        text : `Php ${total_amount}`,
                                        font : "Roboto"
                                    },                                
                                ],
                                bold : true,
                                fontSize : 9,
                                margin : [0,5,0,10]
                            },
                            {
                                text : [
                                    'Receipt# : ',
                                    {
                                        text : `${_id}`,
                                        fontSize : 7
                                    }
                                ],                         
                                bold : true,
                                fontSize : 9,
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
                            headerRows: 1,
                            widths: [ 40,40,'*', 80,80],
                            body: [
                                [                                     
                                    {
                                        text : 'QTY',
                                        style : 'tableHeader'
                                    },
                                    {
                                        text : 'UNIT',
                                        style : 'tableHeader'
                                    },
                                    {
                                        text : 'Item Name',
                                        style : 'tableHeader'
                                    },
                                    {
                                        text : 'Unit Price',
                                        style : 'tableHeader'
                                    },
                                    {
                                        text : 'Amount',
                                        style : 'tableHeader'
                                    },                                   
                                ],    
                                ...docs                                                      
                            ]
                        }
                    }                    
                ],                
                margin : [0,10,0,0]
            }
        ],
        styles : {
            header : {
                bold : true,
                color : "#808080"
            },
            subheader : {
                fontSize : 9
            },
            tableHeader : {
                fontSize : 9,
                color : 'white',
                fillColor : 'grey',
                alignment : 'center',
                margin : [0,6],
                border : [true,false,true,false]
            },
            tableItems : {
                alignment : 'center',
                margin : [0,5],
                fontSize : 8,
                color : "#808080"
            },
            tableItemsAmount : {
                alignment : 'center',
                margin : [0,6],
                fontSize : 9,
                font : "Roboto",
                color : "#808080"
            }
        },
        defaultStyle : {
            font : 'FAKE_RECEIPT',
            columnGap : 5,
            color : "#808080",
            fontSize : 9
        }
    }
}