import React from "react";
import { Svg, Path, Text } from "react-native-svg";

const Hexagon = ({
  color = "currentColor",
  width = 200,
  height = 200,
  style = {},
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={width}
    height={height}
    style={style}
  >
    <Path d="M15 50 L35 75 L65 75 L85 50 L65 25 L35 25 Z" fill={color} />
    <Text
      x="50"
      y="50"
      textAnchor="middle"
      alignmentBaseline="middle"
      fill="white"
    >
      Hellpo asdfna
    </Text>
  </Svg>
);

export default Hexagon;
