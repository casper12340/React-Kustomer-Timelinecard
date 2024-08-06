import React, { useState } from 'react';
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
    const [selectedValue, setSelectedValue] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const dropdownOptions = [
        { name: 'Nieuw item; geen artikel(en) retour', value: '365837a0_New_Item_No_Returns' },
        { name: 'Nieuw item; retourlabel', value: 'c4ef7431_New_Item_Free_Returnlabel' },
        { name: 'Nieuw item; PNOV; geen artikel(en) retour', value: 'xfvt70o6_PNOV_No_Returns' },
        { name: 'Nieuw item; PNOV; retourlabel', value: '6yrjzxu1_PNOV_Free_Returnlabel' },
        { name: 'Reparatie; geen ander(e) artikel(en) retour', value: 'a464b11d_Repair_No_Returns' },
        { name: 'Reparatie; ander(e) artikel(en) retour', value: 'b4bb572d_Repair_Paid_Returnlabel' },
        { name: 'Item terugbetalen; geen artikel(en) retour', value: '76a084af_Refund_No_Returns' },
        { name: 'Item terugbetalen; retourlabel', value: '1263f105_Refund_Free_Returnlabel' },
        { name: 'Rejected', value: 'c3885164_Request_Rejected' }
    ];

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const returnless = props.data2?.customContext?.kobject?.data?.returnless?.data || {};
    const returnData = returnless.includes?.return_order_items || [];
    const attachmentsPresent = returnData.some(item =>
        item.answers && item.answers.some(answer => answer?.attachments && answer.attachments.length > 0)
    );

    console.log("Return Request", returnless);

    return (
        <div>
            <p style={{ color: 'red' }}>LET OP!! Deze functie werkt nog niet goed.</p>
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
                                            {(answer?.option?.answer === 'Ik wil het bestelde item ontvangen (mits op voorraad)' || answer?.option?.answer === 'Ik wil het item terugsturen en mijn geld terug') 
                                                && <p style={{ marginBottom: '10px' }}>{answer?.option?.answer}</p>}

                                            {answer?.answer !== null && <p id='smallMarginBottomAndTop'>{answer?.answer}</p>}
                                        </div>
                                    ))
                                ) : (
                                    <p></p>
                                )}
                            </div>
                            <div style={{ justifyContent: 'center !important' }}>
                                {attachmentsPresent && (
                                    <Carousel attachments={item.answers?.flatMap(answer => answer?.attachments || [])} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Styling of the Bottom element */}
            <div style={{ paddingTop: '10px', borderRadius: '8px', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="itemDropdown" style={{ display: 'block', fontSize: '16px', marginBottom: '10px' }}>Notitie toevoegen:</label>
                    <select 
                        id="itemDropdown" 
                        name="itemDropdown" 
                        value={selectedValue} 
                        onChange={handleChange} 
                        style={{ fontSize: '16px', padding: '10px', borderRadius: '4px', width: '100%' }}
                    >
                        <option value="" disabled>--Selecteer een notitie--</option>
                        {dropdownOptions.map(dropdownOption => (
                            <option key={dropdownOption.value} value={dropdownOption.value}>
                                {dropdownOption.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        id="gratisVerzending"
                        style={{ marginRight: '8px', accentColor: '#e3a4c0' }}
                    />
                    <label htmlFor="gratisVerzending" style={{ fontSize: '16px' }}>Gratis Verzending</label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                    <ApproveButton checked={isChecked} noteID={selectedValue} />
                    <ApproveWoShipmentButton noteID={selectedValue} />
                    <RejectButton noteID={selectedValue} />
                </div>
            </div>
        </div>
    );
}
