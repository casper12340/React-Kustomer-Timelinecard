import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

function Attachment({ attachments }) {
    if (!attachments || attachments.length === 0) {
        return null;
    }

    return (
        <div>
            <div>
                {attachments.length > 1 ? (
                    <Carousel>
                        {attachments.map((attachment, index) => (
                            <div key={index}>
                                <a href={attachment.path} target="_blank" rel="noopener noreferrer">
                                    <img src={attachment.path} alt={`Attachment ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                </a>
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <div>
                        <a href={attachments[0].path} target="_blank" rel="noopener noreferrer">
                            <img src={attachments[0].path} alt="Attachment" style={{ maxWidth: '70%', maxHeight: '300px' }} />
                        </a>

                    </div>
                )}
            </div>
        </div>
    );
}

export default Attachment;
