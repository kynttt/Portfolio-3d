import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (!registered) {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
    registered = true;
  }

  return gsap;
}
