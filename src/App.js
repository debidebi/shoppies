import React from "react";
import MovieApis from "./container/MovieApis.js";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      <a
        href="https://github.com/debidebi"
        target="_blank"
        className="source-code"
      >
        My code
      </a>
      <MovieApis />
    </div>
  );
};

export default App;