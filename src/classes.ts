import p5, { Vector } from "p5";
import { state, states } from "./sketch";

export class StateManager{
  state:State;

  constructor(state:State){
    this.state=state;
  }

  set(state:State){
    this.state=state;
  }

  display(){
    this.state.display();
  }

  update(){
    this.state.update();
  }
}

export class State{
  p:p5;

  constructor(p:p5){
    this.p=p;
  }

  display(){}

  update(){}
}

export class Start extends State{
  display(): void {
    this.p.background(30);
    this.p.fill(230);
    this.p.textAlign("center");
    this.p.textSize(50);
    this.p.text("Mini game",this.p.width*0.5,this.p.height*0.5);
    this.p.textSize(20);
    this.p.text("press any key",this.p.width*0.5,this.p.height*0.5+100);
  }

  update(): void {
    if(this.p.mouseIsPressed||this.p.keyIsPressed){
      state.set(states.get("game")!);
    }
  }
}

export class Main extends State{
  player:Player|null=null;
  poles:Pole[]=[];
  index:number=0;
  last:number=500;
  scr:number=0;
  over:boolean=false;
  point:number=0;

  constructor(p:p5){
    super(p);
    window.addEventListener('mousedown',()=>{
      if(this.over)this.init();
    });
    window.addEventListener('touchstart',()=>{
      if(this.over)this.init();
    });
    window.addEventListener('keydown',()=>{
      if(this.over)this.init();
    });
    this.init();
  }

  init(){
    this.player=new Player(this.p);
    this.scr=0;
    this.over=false;
    this.point=0;
    this.index=0;
    this.last=500;
    this.poles=[];
    this.addPole();
  }

  display(): void {
    this.p.background(30);
    this.p.translate(-this.scr,0);
    this.poles.forEach(p=>{
      p.display();
    });
    this.player!.display();
    this.p.resetMatrix();
    this.p.textSize(20);
    this.p.textAlign("center");
    this.p.text(`point: ${this.point}`,this.p.width*0.5,20);
    if(this.over){
      this.p.background(0,50);
      this.p.textSize(50);
      this.p.textAlign("center");
      this.p.text("Game Over",this.p.width*0.5,this.p.height*0.5);
    }
  }

  update(): void {
    if(this.over){
      return;
    }
    this.addPole();
    this.player!.update();
    this.poles.forEach(p=>{
      p.update();
      const h=p.hit(this.player!);
      if(h.over){
        this.over=true;
      }
      if(h.point){
        this.point++;
        this.last=p.x;
      }
    });
    this.scr+=this.player!.vec.x;
    if(this.player!.pos.y>this.p.height||this.last+2000+this.player!.size.x*1.5<this.player!.pos.x){
      this.over=true;
    }
  }

  addPole(){
    if(this.poles.length>0)
    while(this.poles[0].x+50<this.scr){
      this.poles.shift();
    }
    while(this.index<(this.p.width+this.scr)/200){
      this.index++;
      const x=700+this.index*200;
      this.poles.push(new Pole(x,(Math.random()*x/(x+3e3)*0.6+0.2)*this.p.height,this.index%10==9,this.p));
    }
  }
}

class Player{
  size:Vector;
  pos:Vector;
  vec:Vector;
  vx=8;
  p:p5;

  constructor(p:p5){
    this.size=new Vector(50,50);
    this.pos=new Vector(100,p.height*0.5);
    this.vec=new Vector(this.vx,0);
    this.p=p;
  }

  display(){
    this.p.rectMode("center");
    this.p.fill(230);
    this.p.noStroke();
    this.p.rect(this.pos.x,this.pos.y,this.size.x,this.size.y,5);
  }

  update(){
    this.vec.y+=1;
    if(this.p.mouseIsPressed||this.p.keyIsPressed){
      this.vec.y-=2+this.pos.y/this.p.height;
    }
    if(this.pos.y<=0){
      this.pos.y=1;
      this.vec.y=-this.vec.y;
    }
    this.pos.add(this.vec);
    this.vec.x=this.vx;
  }
}

class Pole{
  p:p5;
  x:number;
  h:number;
  point:boolean;
  pHit:boolean=false;

  constructor(x:number,h:number,point:boolean,p:p5){
    this.p=p;
    this.x=x;
    this.h=h;
    this.point=point;
  }

  display(){
    if(this.point){
      this.p.fill(this.pHit?200:230);
    }else{
      this.p.noFill();
    }
    this.p.stroke(230);
    this.p.rect(this.x,this.p.height,100,this.h*2,5);
  }

  update(){

  }

  hit(pl:Player){
    if(Math.abs(pl.pos.x-this.x)<(pl.size.x+100)*0.5&&Math.abs(pl.pos.y-this.p.height)<(pl.size.y*0.5+this.h)){
      if(this.point){
        pl.vec.set(0,0);
        pl.pos.y=this.p.height-this.h-pl.size.y*0.5;
        if(this.pHit){
          this.pHit=true;
          return {over:false,point:false};
        }else{
          this.pHit=true;
          return {over:false,point:true};
        }
      }
      return {over:true,point:false};
    }
    this.pHit=false;
    return {over:false,point:false};
  }
}