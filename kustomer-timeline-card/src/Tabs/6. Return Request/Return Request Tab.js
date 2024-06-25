import React from 'react';
import Carousel from './Image carousel'; // Ensure the import path is correct
import ApproveButton from './Approve Button';
import ApproveWoShipmentButton from './Approve without Shipment Button';
import RejectButton from './Reject Button';

function formatDate(date) {
    const dateObj = new Date(date);
    const padToTwoDigits = num => String(num).padStart(2, '0');
    return `${padToTwoDigits(dateObj.getUTCDate())}-${padToTwoDigits(dateObj.getUTCMonth() + 1)}-${dateObj.getUTCFullYear()} ` +
           `${padToTwoDigits(dateObj.getUTCHours())}:${padToTwoDigits(dateObj.getUTCMinutes())}`;
}

export default function ReturnRequestTab(props) {
    const returnless = props.data2?.customContext?.kobject?.data?.returnless?.data || {};
    const returnData = returnless.includes?.return_order_items || [];
    const attachmentsPresent = returnData.some(item =>
        item.answers && item.answers.some(answer => answer?.attachments && answer.attachments.length > 0)
    );

    console.log("Return Request", returnless);

    return (
        <div>
            <h3 style={{ marginBottom: '0px', marginTop: '2px' }}>Return Request informatie:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                    <p className='bodyItems'><b>Type:</b></p>
                    <p className='bodyItems'>{returnless.state?.charAt(0).toUpperCase() + returnless.state?.slice(1)}</p>
                    <p className='bodyItems'><b>Aangevraagd op:</b></p>
                    <p className='bodyItems'>{formatDate(returnless.created_at)}</p>
                </div>
                <div>
                    <p className='bodyItems'><b>Retour nummer:</b></p>
                    <p className='bodyItems'>{returnless.return_number}</p>
                    <p className='bodyItems'><b>Geüpdatet op:</b></p>
                    <p className='bodyItems'>{formatDate(returnless.updated_at)}</p>
                </div>
            </div>

            <p className='bodyItems'><b>Returnless Url:</b></p>
            <a className='bodyItems' href={returnless.links.panel} target="_blank" rel="noopener noreferrer">{returnless.links.panel}</a>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '10px' }}>
    <span style={{ display: 'flex', gap: '10px' }}>
        <ApproveButton />
        <ApproveWoShipmentButton />
        <RejectButton />
    </span>
</div>


            <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: `2fr 2fr 2fr ${attachmentsPresent ? '1fr' : ''}`, gap: '10px', fontWeight: 'bold' }}>
                        <div>Product</div>
                        <div>Reden</div>
                        <div></div>
                        {attachmentsPresent && <div>Afbeelding klant</div>}
                    </div>
                    {returnData.map(item => (
                        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: `2fr 2fr 2fr ${attachmentsPresent ? '1fr' : ''}`, alignItems: 'center', gap: '0px 10px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                            {/* <div>
                                {item.product?.image_src ? (
                                    <a href={item.product.image_src} target="_blank" rel="noopener noreferrer">
                                        <img src={item.product.image_src} alt="Product" style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', verticalAlign: 'middle' }} />
                                    </a>
                                ) : (
                                    <img
                                        src="https://www.bandenhandel-limburg.nl/website-advanced/theme/BT5006-1-james/img/catalogview/product-master-filter-2/noimage.png"
                                        alt="Not Available"
                                        style={{ maxWidth: '50%', maxHeight: '100px', objectFit: 'contain' }}
                                    />
                                )}
                            </div> */}
                            <div>
                                <p id='smallMarginBottomAndTop'>{item.product?.name || 'Onbekend Item'}</p>
                                <p style={{ color: 'gray' }} id='smallMarginBottomAndTop'>{item.product?.sku || 'Onbekend MJ Nummber'}</p>
                            </div>
                            <div>
                                <p id='smallMarginBottomAndTop'>{item.return_reason?.label || 'N/A'}</p>
                            </div>
                            <div>
                                {item.answers?.length > 0 ? (
                                    item.answers.map(answer => (
                                        <div key={answer.id}>
                                            {/* <p id='smallMarginBottomAndTop'>{answer?.option?.answer}</p>  */}
                                            {(answer?.option?.answer === 'Ik wil het bestelde item ontvangen (mits op voorraad)' || answer?.option?.answer === 'Ik wil het item terugsturen en mijn geld terug') 
                                                && <p style={{marginBottom:'10px'}}>{answer?.option?.answer}</p>}

                                            {answer?.answer !== null && <p id='smallMarginBottomAndTop'>{answer?.answer}</p>}
                                            
                                            
                                        </div>
                                    
                                    ))
                                ) : (
                                    <p></p>
                                )}
                            </div>
                            <div style={{justifyContent:'center !important'}}>
                                {attachmentsPresent && (
                                    <Carousel attachments={item.answers?.flatMap(answer => answer?.attachments || [])} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
