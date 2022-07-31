import React from 'react';

type TCFDAccountDisplayProps = {
    type: 'real' | 'demo';
};

const CFDAccountDisplay = ({ type }: TCFDAccountDisplayProps) => {
    return (
        // <CFDAccountCard />
        <>Account Card Display: {type}</>
    );
};

export default CFDAccountDisplay;
