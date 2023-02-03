import React from "react";
import { render } from "react-dom";
import vmsg from "vmsg";
import "./App.css";
import axios from 'axios'
 
const recorder = new vmsg.Recorder({
  wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm"
});
 
class App extends React.Component {
  state = {
    isLoading: false,
    isRecording: false,
    recordings: []
  };
  record = async () => {
    this.setState({ isLoading: true });
 
    if (this.state.isRecording) {
      const blob = await recorder.stopRecording();
      this.setState({
        isLoading: false,
        isRecording: false,
        recordings: this.state.recordings.concat(URL.createObjectURL(blob))
      });
    } else {
      try {
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();
        this.setState({ isLoading: false, isRecording: true });
      } catch (e) {
        console.error(e);
        this.setState({ isLoading: false });
      }
    }
  };

  handleClick = async(url) =>{
    const options = {
      method: 'POST',
      url: 'https://pronunciation-assessment1.p.rapidapi.com/pronunciation',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'f0b8004273mshb02590e745b1bfdp19fd20jsn3938f6b23c4f',
        'X-RapidAPI-Host': 'pronunciation-assessment1.p.rapidapi.com'
      },
      data: url
    };
    
    await axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }


  render() {
    const { isLoading, isRecording, recordings } = this.state;
    return (
      <React.Fragment>
        <button disabled={isLoading} onClick={this.record}>
          {isRecording ? "Stop" : "Record"}
        </button>
        
        <ul style={{ listStyle: "none", padding: 0 }}>
          {recordings.map(url => (
            <li key={url}>
              <audio src={url} controls />
              <button onClick={() => this.handleClick(url)}>
                {url}
              </button>
            </li>
          ))}
        </ul>
        <h3>When you click the "blob" button the accuracy of the language is displayed in the console.</h3>
      </React.Fragment>
    );
  }
}
 
render(<App />, document.getElementById("root"));


