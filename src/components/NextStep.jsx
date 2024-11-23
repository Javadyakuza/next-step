import React, { useState } from 'react';
import '../styles/NextStep.css';

const NextStep = () => {
  const [inputValue, setInputValue] = useState('');  // For input field value
  const [displayText, setDisplayText] = useState(''); // For displayed text
  const [systemOrder, setSystemOrder] = useState('Write Down what you wanna do');

  const updateTask = () => {
    if (inputValue.trim()) {  // Only update if input is not empty
      console.log(`User dropped this dopeness: ${inputValue}`);
      setSystemOrder('JUST DO');
      setDisplayText(inputValue);  // Update the display text
      setInputValue('');  // Clear the input field
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      updateTask();
    }
  };

  return (
    <div className="retro-container">
      <h1 className="retro-title">
        <span className="system-order">{systemOrder}</span>
        <br /><br />
        <span className="user-text">
          {displayText}  {/* Show the committed text here */}
        </span>
      </h1>

      <input
        type="text"
        className="retro-input"
        onChange={(e) => setInputValue(e.target.value)}  // Only update input value
        onKeyDown={handleKeyDown}
        value={inputValue}
      />

      <button
        className="retro-button"
        onClick={updateTask}
      >
        Change the purpose
      </button>
    </div>
  );
};

export default NextStep;