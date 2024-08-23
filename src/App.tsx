import { useState, useEffect, memo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Grid,
  Center,
  GizmoHelper,
  GizmoViewport,
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
  Environment,
  useGLTF,
  Svg,
  Text,
} from "@react-three/drei";
import { useControls } from "leva";
import "./App.css";

type TCountriesResponse = {
  flags: {
    png: string;
    svg: string;
  };
  name: {
    common: string;
    official: string;
    nativeName: string;
  };
}[];

function App() {
  const [data, setData] = useState([] as TCountriesResponse);

  useEffect(() => {
    const fetchData = async () => {
      const data = (await (
        await fetch("https://restcountries.com/v3.1/all?fields=name,flags")
      ).json()) as TCountriesResponse;

      setData(data.slice(0, 30));
    };

    fetchData();
  }, []);

  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: "#9d4b4b",
    fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  });

  console.log(data);

  return (
    <Canvas shadows camera={{ position: [10, 12, 12], fov: 25 }}>
      <group position={[0, -0.5, 0]}>
        <Shadows />
        <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
      </group>
      <OrbitControls makeDefault />
      <Environment preset="city" />
      {data.map((country, i) => (
        <Country name={country.name.common} key={i} y={i} />
      ))}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>
    </Canvas>
  );
}

const Shadows = memo(() => (
  <AccumulativeShadows
    temporal
    frames={100}
    color="#9d4b4b"
    colorBlend={0.5}
    alphaTest={0.9}
    scale={20}
  >
    <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
  </AccumulativeShadows>
));

function Suzi(props) {
  const { nodes } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/suzanne-high-poly/model.gltf"
  );
  return (
    <mesh castShadow receiveShadow geometry={nodes.Suzanne.geometry} {...props}>
      <meshStandardMaterial color="#9d4b4b" />
    </mesh>
  );
}

function Country(props) {
  console.log("Country");
  return (
    <Text
      color="black"
      anchorX="center"
      anchorY="middle"
      position={[0, props.y, 0]}
    >
      {props.name}
    </Text>
  );
}

export default App;
