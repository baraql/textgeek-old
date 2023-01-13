import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import initSqlJs from "sql.js";
import Homepage from "./Homepage";

// Required to let webpack 4 know it needs to copy the wasm file to our assets
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";

export default function App() {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);
  const inputFile = useRef(null)

  useEffect(async () => {
    // sql.js needs to fetch its wasm file, so we cannot immediately instantiate the database
    // without any configuration, initSqlJs will fetch the wasm files directly from the same path as the js
    // see ../craco.config.js
    if (inputFile) {
      try {
        const SQL = await initSqlJs({ locateFile: () => sqlWasm });
        setDb(new SQL.Database());
      } catch (err) {
        setError(err);
      }
    }
  }, []);

  const handleFileUpload = (event) => {
    console.log("handleFileUpload");
    inputFile.current = event.target.files[0]; // update the inputFile ref object
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

  // if (error) return <pre>{error.toString()}</pre>;
  // else if (!db) return <pre>Loading...</pre>;
  // else return <SQLRepl db={db} />;
  // return <Homepage />;

  // This should go in its own function
  if (inputFile.current === useRef(null).current) return <ChooseScreen handleFileUpload={handleFileUpload} inputFile={inputFile} />
  else return(
    nice
    );
}

function ChooseScreen({handleFileUpload, inputFile}) {
  return (
    <div className="App">
      <header className="App-header">
        <p>TextGeek</p>
        <p>Choose your chat.db file.</p>
        {/* Change this to react-native-fs instead of file upload */}
        <input type="file" onChange={(event) => handleFileUpload(event)} />

      </header>
    </div>
  );
}

/**
 * A simple SQL read-eval-print-loop
 * @param {{db: import("sql.js").Database}} props
 */
function SQLRepl({ db }) {
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  function exec(sql) {
    try {
      // The sql is executed synchronously on the UI thread.
      // You may want to use a web worker here instead
      setResults(db.exec(sql)); // an array of objects is returned
      setError(null);
    } catch (err) {
      // exec throws an error when the SQL statement is invalid
      setError(err);
      setResults([]);
    }
  }

  return (
    <div className="App">
      <h1>React SQL interpreter</h1>

      <textarea
        onChange={(e) => exec(e.target.value)}
        placeholder="Enter some SQL. No inspiration ? Try “select sqlite_version()”"
      ></textarea>

      <pre className="error">{(error || "").toString()}</pre>

      <pre>
        {
          // results contains one object per select statement in the query
          results.map(({ columns, values }, i) => (
            <ResultsTable key={i} columns={columns} values={values} />
          ))
        }
      </pre>
    </div>
  );
}

/**
 * Renders a single value of the array returned by db.exec(...) as a table
 * @param {import("sql.js").QueryExecResult} props
 */
function ResultsTable({ columns, values }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((columnName, i) => (
            <td key={i}>{columnName}</td>
          ))}
        </tr>
      </thead>

      <tbody>
        {
          // values is an array of arrays representing the results of the query
          values.map((row, i) => (
            <tr key={i}>
              {row.map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
