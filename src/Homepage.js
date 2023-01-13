// import logo from './logo.svg';
// import './App.css';
import React, { useRef, useEffect } from "react";
import initSqlJs from "sql.js";

// import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";

export default function Homepage() {
  const inputFile = useRef(null)

  useEffect(async () => {
    // sql.js needs to fetch its wasm file, so we cannot immediately instantiate the database
    // without any configuration, initSqlJs will fetch the wasm files directly from the same path as the js
    // see ../craco.config.js
    try {
      const SQL = await initSqlJs({ locateFile: () => sqlWasm });
      setDb(new SQL.Database());
    } catch (err) {
      setError(err);
    }
  }, []);


  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  const handleFileUpload = (event) => {
    const reader = new FileReader();
    reader.onload = () => {

      const f = event.target.files[0];
      const r = new FileReader();
      r.onload = function () {
        const Uints = new Uint8Array(r.result);
        const db = new SQL.Database(Uints);
      }
      r.readAsArrayBuffer(f);

    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <p>TextGeek</p>
        <p>Click to upload your chat.db file.</p>
        {/* Change this to react-native-fs instead of file upload */}
        <input type="file" onChange={(event) => this.handleFileUpload(event)} />

      </header>
    </div>
  );
}
