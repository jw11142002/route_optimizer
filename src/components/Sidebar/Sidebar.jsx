import React, { useState } from 'react';

const Sidebar = ({ onAddressesChange }) => {
  const [addresses, setAddresses] = useState(['', '']); // Start with two empty addresses

  const handleAddressChange = (index, value) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
    onAddressesChange(newAddresses);
  };

  const addDestination = () => {
    setAddresses([...addresses, '']);
  };

  return (
    <div className="sidebar">
      <h2>Route Planner</h2>
      {addresses.map((address, index) => (
        <input
          key={index}
          type="text"
          value={address}
          onChange={(e) => handleAddressChange(index, e.target.value)}
          placeholder={index === 0 ? "Start Address" : `Destination ${index}`}
        />
      ))}
      <button onClick={addDestination}>Add Destination</button>
    </div>
  );
};

export default Sidebar;