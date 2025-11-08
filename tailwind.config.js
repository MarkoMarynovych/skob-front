import { nextui } from "@nextui-org/react";
import {Config} from "tailwindcss";

const config = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  darkMode: "class",
  plugins: [nextui()]
};
export default config;
