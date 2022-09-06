import "./App.css";
import { useState } from "react";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

//brave - http://localhost:45005/api/v0
//const client = create({ url: "http://localhost:45005/api/v0" });

//normal ipfs - http://localhost:5001/api/v0
const client = create({ url: "http://localhost:5001/api/v0" });

const App = () => {
  const [file, setFile] = useState(null);
  const [urlArray, setUrlArray] = useState([]);

  //Use following command to create a random file: head -c 1M </dev/urandom >myfile

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };

    e.preventDefault();
  };

  const uploadFile = async (e) => {
    e.preventDefault();

    try {
      const created = await client.add(file);
      const url = `https://ipfs.io/ipfs/${created.path}`;
      console.log("New file cid:", url);

      setUrlArray((prev) => [...prev, url]);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">IPFS Helper</header>

      <div className="main">
        <form onSubmit={uploadFile}>
          <input type="file" onChange={retrieveFile} />
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>

      <div className="display">
        {urlArray.length !== 0 ? (
          urlArray.map((file, i) => (
            <a href={file} key={i} alt="link">
              {file}
            </a>
          ))
        ) : (
          <h3>Upload a file.</h3>
        )}
      </div>
    </div>
  );
};

export default App;
