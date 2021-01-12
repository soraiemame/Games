let can = document.querySelector("canvas").getContext("2d");
const color = ["#09FF00","#101010","#FF0000"],key = [37,38,39,40];
function put(x,y,c){
  can.fillStyle = c;
  can.fillRect(x + 1,y + 1,B - 2,B - 2);
}
let hi = document.querySelectorAll("p")[0],
    now = document.querySelectorAll("p")[1];
const W = 600,H = 600,B = 15;
const dx = [-1,0,1,0,0],dy = [0,-1,0,1,0];
let nx,ny;
function target(){
  nx = Math.floor(Math.floor(Math.random() * 600) / B) * B;
  ny = Math.floor(Math.floor(Math.random() * 600) / B) * B;
  put(nx,ny,color[2]);
}
class snake{
  constructor(){
    this.x = 0;//頭x
    this.y = 0;//頭y
    this.d = 4;//向き
    this.px = 0;
    this.py = 0;
    //前<->後
    this.tx = [];//頭以外のx
    this.ty = [];//頭以外のy
    this.tl = 0;//頭以外の長さ
    put(this.x,this.y,color[0]);
  }
  show(){
    put(this.px,this.py,color[1]);
    for(let i = 0;i < this.tl;i++){
      put(this.tx[i],this.ty[i],color[0]);
    }
    put(this.x,this.y,color[0]);
  }
  update(){
    //時間経過の処理
    if(this.tl > 0)this.px = this.tx[this.tl - 1],this.py = this.ty[this.tl - 1];
    else this.px = this.x,this.py = this.y;
    for(let i = this.tl - 1;i >= 0;i--)this.tx[i] = this.tx[i - 1],this.ty[i] = this.ty[i - 1];
    this.tx[0] = this.x,this.ty[0] = this.y;
    this.x = (this.x + dx[this.d] * B + H) % H;this.y = (this.y + dy[this.d] * B + W) % W;
    
    //餌の処理
    if(this.x === nx && this.y === ny){
      this.tl++;
      this.tx.unshift(this.x);this.ty.unshift(this.y);
      this.x = nx;this.y = ny;
      put(this.x,this.y,color[0]);
      target();
      now.innerText = `Score:${this.tl}`
      return true;
    }
    return false;
  }
  dead(){
    for(let i = 0;i < this.tl;i++){
      if(this.x === this.tx[i] && this.y === this.ty[i])return true;
    }
    return false;
  }
  dir(d){
    this.d = d;
  }
}

(function main(){
  let got = localStorage.getItem("snake_game_hi_score");
  if(got === null)got = 0;
  hi.innerText += String(got);
  now.innerText += "0";
  let s = new snake();
  target();
  document.addEventListener("keydown",(event) => {
    if(event.keyCode === key[0] && s.d !== 2)s.d = 0;
    else if(event.keyCode === key[1] && s.d !== 3)s.d = 1;
    else if(event.keyCode === key[2] && s.d !== 0)s.d = 2;
    else if(event.keyCode === key[3] && s.d !== 1)s.d = 3;
    else return;
  });
  let game = setInterval(() => {
    let b = s.update();
    s.show();
    if(s.dead() && !b){
      //記録更新
      const final = Number(now.innerText.replace("Score:",""));
      if(final > Number(got))localStorage.setItem("snake_game_hi_score",String(final));
      clearInterval(game);
      alert("GAME OVER!!!")
      location.reload();
    }
  },1000/10);
})();