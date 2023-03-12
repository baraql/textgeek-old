import React, { useState, useEffect, useRef } from 'react';
import initSqlJs from 'sql.js';
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";

export default function App() {
    // State variables
    const [db, setDb] = useState(null);
    const [error, setError] = useState(null);
    const [selectResult, setSelectResult] = useState(null);
    // State or Ref for input file
    const inputFile = useRef(null);

    // function to handle file upload
    const handleFileUpload = async (event) => {
        console.log("handleFileUpload");
        inputFile.current = await event.target.files[0];
        try {
            const SQL = await initSqlJs({ locateFile: () => sqlWasm });
            if (inputFile && inputFile.current) {
                // load the file and create a new database
                const file = inputFile.current;
                const fileReader = new FileReader();
                fileReader.onload = function () {
                    const Uints = new Uint8Array(this.result);
                    setDb(new SQL.Database(Uints));
                }.bind(setDb);
                fileReader.readAsArrayBuffer(file);

                handleSelect();
                console.log(selectResult);
            }
        } catch (err) {
            // if err.toString() == ""
            setError(err);
        }
    };

    // function to handle select statement
    const handleSelect = () => {
        // e.preventDefault();
        if (db) {
            console.log("handleSelect");
            // perform a select statement
            const selectResult = db.exec("SELECT * FROM chat;");
            setSelectResult(selectResult);
        }
    }

    // render the component
    if (error) return <pre>{error.toString()}</pre>;
    else if (!db) {
        return (
            <div>
                <p>Choose a .db file:</p>
                <input type="file" onChange={handleFileUpload} accept=".db" />
            </div>
        );
    }
}
