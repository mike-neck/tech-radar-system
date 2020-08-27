import React from 'react';
import {PageHeader} from "antd";
import './App.css';
import {Radar} from "./radar/radar";
import {RadarConfig} from "./radar/config";
import {Technology, Trend} from "./radar/entry-classification";
import {TechAssessment} from "./radar/tech-assessment";
import {Quadrant} from "./radar/quadrant";

function App() {

    const radarConfig: RadarConfig = {
        area: {
            height: 1000, width: 1450,
        },
        colors: {
            background: "#eee",
            backingText: "#8fc6c7",
            grid: "#5f6068",
            inactive: "#30284c",
            tech: {
                adopt: "#93c47d",
                assess: "#93d2c2",
                hold: "#fbdb84",
                trial: "#efafa9",
            },
        },
        names: {
            leftBottom: "Language",
            leftTop: "Style",
            rightBottom: "Infra",
            rightTop: "Frameworks",
        },
        printLayout: true,
        title: "example tech radar",
    };

    const technologoes: Technology[] = [
        {active: true, assessment: TechAssessment.Adopt, move: Trend.UP, name: "Kotlin", quadrant: Quadrant.Second},
        {active: true, assessment: TechAssessment.Trial, move: Trend.KEEP, name: "Rust", quadrant: Quadrant.Second},
        {active: true, assessment: TechAssessment.Assess, move: Trend.DOWN, name: "KPT", quadrant: Quadrant.First},
    ];

  return (
    <div className="App">
      <PageHeader title="Radar System"/>
        <Radar radarConfig={radarConfig} technologies={technologoes}/>
    </div>
  );
}

export default App;
