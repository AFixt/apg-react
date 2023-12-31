import React from 'react';
import './App.css';
import Accordion from './Accordion';

function App() {
  const accordionItems = [
    {
      title: 'Section 1',
      content: 'Content for section 1...'
    },
    {
      title: 'Section 2',
      content: 'Content for section 2...'
    },
    // Add more sections as needed
  ];

  return (
    <div className="App">
      <h1>My Accordion</h1>
      <Accordion items={accordionItems} />
    </div>
  );
}

export default App;
