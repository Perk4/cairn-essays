import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadSourceSans3 } from "@remotion/google-fonts/SourceSans3";

const fraunces = loadFraunces("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

const sourceSans = loadSourceSans3("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

export const displayFont = fraunces.fontFamily;
export const bodyFont = sourceSans.fontFamily;
