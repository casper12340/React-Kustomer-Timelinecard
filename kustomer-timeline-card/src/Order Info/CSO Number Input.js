import React, { useState } from 'react';

export default function QuantityInput({ skuStr, item, onChange }) {
  const [value, setValue] = useState(0);

  const handleIncrement = () => {
    if (value < item.quantityNum) {
      const incrementedValue = value + 1;
      setValue(incrementedValue);
      onChange(skuStr, incrementedValue); // Notify parent component of the change
    }
  };

  const handleDecrement = () => {
    if (value > 0) {
      const decrementedValue = value - 1;
      setValue(decrementedValue);
      onChange(skuStr, decrementedValue); // Notify parent component of the change
    }
  };

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= item.quantityNum) {
      setValue(newValue);
      onChange(skuStr, newValue); // Notify parent component of the change
    }
  };

  return (
    <div id='inputContainer'>
      <button onClick={handleDecrement} id='numberButton'>-</button>
      <input
        type="number"
        min="0"
        max={item.quantityNum}
        value={value}
        onChange={handleChange}
        id='inputBox'
      />
      <button onClick={handleIncrement} id='numberButton'>+</button>
    </div>
  );
}


