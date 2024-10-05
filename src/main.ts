import p5 from "p5"
import { sketch } from "./sketch"

window.addEventListener('load',()=>{
  new p5(sketch);
})

window.addEventListener('touchmove',(e)=>{
  e.preventDefault();
})