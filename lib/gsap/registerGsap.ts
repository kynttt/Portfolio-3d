import gsap from "gsap";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap() {
  if (!registered) {
    gsap.registerPlugin(useGSAP);
    registered = true;
  }

  return gsap;
}
