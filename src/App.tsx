import React, {useEffect} from 'react';
import * as d3 from "d3";
import {PageHeader} from "antd";
import './App.css';

function App() {

  useEffect(() => {
    const element = d3.select(".d3");
    element.append("h2").html("Using D3");
  });

  return (
    <div className="App">
      <PageHeader title="Radar System"/>
      <article className="d3">
      </article>
    </div>
  );
}

export default App;
