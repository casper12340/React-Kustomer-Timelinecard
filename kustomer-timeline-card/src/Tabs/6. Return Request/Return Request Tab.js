import React from 'react';

// Utility function to format dates
function formatDate(date) {
    const dateObj = new Date(date);
    const padToTwoDigits = num => String(num).padStart(2, '0');
    return `${padToTwoDigits(dateObj.getUTCDate())}-${padToTwoDigits(dateObj.getUTCMonth() + 1)}-${dateObj.getUTCFullYear()} ` +
           `${padToTwoDigits(dateObj.getUTCHours())}:${padToTwoDigits(dateObj.getUTCMinutes())}`;
}

export default function ReturnRequestTab (props) {
    const returnless = props.data2.customContext.kobject.data.returnless.data;
    const returnData = returnless.includes.return_order_items;
    const attachmentsPresent = returnData.some(item => 
        item.answers && item.answers.some(answer => answer.attachments && answer.attachments.length > 0)
    );

    console.log("Return Request", returnless);

    return(
        <div>
            <h3 style={{marginBottom:'0px', marginTop:'2px'}}>Return Request informatie:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {/* Left Column */}
                <div>
                    <p className='bodyItems'><b>Type:</b></p>
                    <p className='bodyItems'>{returnless.state.charAt(0).toUpperCase() + returnless.state.slice(1)}</p>
                    <p className='bodyItems'><b>Aangevraagd op:</b></p>
                    <p className='bodyItems'>{formatDate(returnless.created_at)}</p>
                </div>
                {/* Right Column */}
                <div>
                    <p className='bodyItems'><b>Retour status:</b></p>
                    <p className='bodyItems'>{returnless.includes.sales_order.status}</p>
                    <p className='bodyItems'><b>Geüpdatet op:</b></p>
                    <p className='bodyItems'>{formatDate(returnless.updated_at)}</p>
                </div>
            </div>

            {/* Centered Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '10px' }}>
                <span> 
                    <button id='csoButton'>Approve</button>
                    <button id='csoButton'>Approve w/o Shipment</button>
                    <button id='csoButton'>Reject</button>
                </span>
            </div>

            {/* Products Information */}
            <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gap: '10px' }}>
                    {/* Header Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: `1fr 2fr 2fr 2fr ${attachmentsPresent ? '1fr' : ''}`, gap: '10px', fontWeight: 'bold' }}>
                        <div>Afbeelding</div>
                        <div>Product</div>
                        <div>Reden</div>
                        <div></div>
                        {attachmentsPresent && <div>Afbeelding klant</div>}
                    </div>
                    {/* Product Rows */}
                    {returnData.map(item => (
                        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: `1fr 2fr 2fr 2fr ${attachmentsPresent ? '1fr' : ''}`, alignItems: 'center', gap: '0px 20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <div>
                                {item.product.image_src ? (
                                    <a href={item.product.image_src} target="_blank" rel="noopener noreferrer">
                                        <img src={item.product.image_src} alt="Product" style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', verticalAlign:'middle' }} />
                                    </a>
                                ) : (
                                    <img
                                        src="https://www.bandenhandel-limburg.nl/website-advanced/theme/BT5006-1-james/img/catalogview/product-master-filter-2/noimage.png"
                                        alt="Not Available"
                                        style={{ maxWidth: '50%', maxHeight: '100px', objectFit: 'contain' }}
                                    />
                                )}
                            </div>
                            <div>
                                <p id='smallMarginBottomAndTop'>{item.product.name || 'Onbekend Item'}</p>
                                <p style={{ color: 'gray' }} id='smallMarginBottomAndTop'>{item.product.sku || 'Onbekend MJ Nummber'}</p>
                            </div>
                            <div>
                                <p>{item.return_reason.label || 'N/A'}</p>
                            </div>
                            <div>
                                {item.answers && item.answers.length > 0 && (
                                    <React.Fragment>
                                        {item.answers.map(answer => (
                                            <div key={answer.id} style={{ marginBottom: '10px' }}>
                                                <p>{answer.option.answer}</p>
                                                {answer.attachments && answer.attachments.length > 0 && (
                                                    <div>
                                                        <a href={answer.attachments[0].path} target="_blank" rel="noopener noreferrer">
                                                            <img src={answer.attachments[0].path} alt="Attachment" style={{ maxWidth: '70%' }} />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
