import React from 'react';

// Utility function to format dates
function formatDate(date) {
    const dateObj = new Date(date);
    const padToTwoDigits = num => String(num).padStart(2, '0');
    return `${padToTwoDigits(dateObj.getUTCDate())}-${padToTwoDigits(dateObj.getUTCMonth() + 1)}-${dateObj.getUTCFullYear()} ` +
           `${padToTwoDigits(dateObj.getUTCHours())}:${padToTwoDigits(dateObj.getUTCMinutes())}`;
}

export default function Returned(props) {
    const { returnData } = props;

    if (!returnData) return <p>Aan het laden...</p>;

    // Determine if attachments are present
    const attachmentsPresent = returnData.includes.return_order_items.some(item => (
        item.answers && item.answers.length > 0 && item.answers.some(answer => answer.attachments && answer.attachments.length > 0)
    ));

    return (
        <div>
            <h3 style={{marginBottom:'0px', marginTop:'2px'}}>Retour informatie:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {/* Left Column */}
                <div>
                    <p className='bodyItems'><b>Type:</b></p>
                    <p className='bodyItems'>{returnData.state.charAt(0).toUpperCase() + returnData.state.slice(1)}</p>
                    <p className='bodyItems'><b>Aangemaakt op:</b></p>
                    <p className='bodyItems'>{formatDate(returnData.created_at)}</p>
                </div>
                {/* Right Column */}
                <div>
                    <p className='bodyItems'><b>Retour status:</b></p>
                    <p className='bodyItems'>{returnData.includes.sales_order.status}</p>
                    <p className='bodyItems'><b>Geüpdatet op:</b></p>
                    <p className='bodyItems'>{formatDate(returnData.updated_at)}</p>
                </div>
                
            </div>
            <p className='bodyItems'><b>Return url:</b></p>
            <a href={returnData.links.panel} target="_blank" rel="noopener noreferrer">{returnData.links.panel}</a>
            {/* Conditional Button Rendering */}
            {returnData.state === 'request' && <button style={{ marginTop: '10px' }}>Request Button</button>}

            {/* Product List */}
            <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gap: '10px' }}>
                    {/* Header Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: `1fr 2fr 2fr ${attachmentsPresent ? '1fr' : ''}`, gap: '10px', fontWeight: 'bold' }}>
                        <div>Afbeelding</div>
                        <div>Product</div>
                        <div>Reden</div>
                        {attachmentsPresent && <div>Afbeelding klant</div>}
                    </div>
                    {/* Product Rows */}
                    {returnData.includes.return_order_items.map(item => (
                        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: `1fr 2fr 2fr ${attachmentsPresent ? '1fr' : ''}`, alignItems: 'center', gap: '0px 20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <div>
                                {item.product.image_src ? (
                                    <a href={item.product.image_src} target="_blank" rel="noopener noreferrer">
                                        <img src={item.product.image_src} alt="Product" style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', verticalAlign:'middle'}} />
                                    </a>
                                ) : (
                                    <img
                                        src="https://www.bandenhandel-limburg.nl/website-advanced/theme/BT5006-1-james/img/catalogview/product-master-filter-2/noimage.png"
                                        alt="Not Available"
                                        style={{ maxWidth: '50%', maxHeight: '100px', objectFit: 'contain'}}
                                    />
                                )}
                            </div>
                            <div>
                                <p>{item.product.name || 'Unknown Product'}</p>
                            </div>
                            <div>
                                <p>{item.return_reason.label || 'N/A'}</p>
                            </div>
                            <div>
                            {/* Loop through answers */}
                            {item.answers && item.answers.length > 0 && (
                                <React.Fragment>
                                    {/* Ensure each answer is displayed in a grid row */}
                                    {item.answers.map(answer => (
                                        <div key={answer.id}>
                                            <div>{/* Placeholder for Answer Text */}</div>
                                            <div>{/* Placeholder for Answer Reason */}</div>
                                            <div>{/* Placeholder for Answer Image */}</div>
                                            {answer.attachments && answer.attachments.length > 0 && (
                                                <div>
                                                    <a href={answer.attachments[0].path} target="_blank" rel="noopener noreferrer">
                                                        <img src={answer.attachments[0].path} alt="Attachment" style={{ maxWidth: '70%'}} />
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
