import p5 from "p5";
import { Main, Start, State, StateManager } from "./classes";

export let state:StateManager;
export let states:Map<string,State>=new Map();

export const sketch=(p:p5)=>{
  p.setup=()=>{
    p.createCanvas(innerWidth,innerHeight,"p2d");
    p.frameRate(60);
    states.set("start",new Start(p));
    states.set("game",new Main(p));
    state=new StateManager(states.get("start")!);
  }
  p.draw=()=>{
    state.display();
    state.update();
  }
}