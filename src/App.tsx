import React, {useEffect} from 'react';
import * as d3 from "d3";

function App() {

  useEffect(() => {
    const element = d3.select(".d3");
    element.append("h2").html("Using D3");
  });

  return (
    <div className="App">
      <h1>Radar System</h1>
      <article className="d3">
      </article>
    </div>
  );
}

export default App;
