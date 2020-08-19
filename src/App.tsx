import React from 'react';
import {PageHeader} from "antd";
import './App.css';
import {Canvas} from "./components/Canvas";

function App() {

  return (
    <div className="App">
      <PageHeader title="Radar System"/>
      <Canvas/>
    </div>
  );
}

export default App;
