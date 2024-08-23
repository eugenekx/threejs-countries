import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, CameraControls, Grid } from "@react-three/drei";
import "./App.css";

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const data = await (
        await fetch("https://restcountries.com/v3.1/all?fields=name,flags")
      ).json();

      // set state when the data received
      setData(data);
    };

    fetchData();
  }, []);

  return (
    <Canvas>
      <PerspectiveCamera makeDefault />
      <CameraControls />
      <Grid />
    </Canvas>
  );
}

export default App;
