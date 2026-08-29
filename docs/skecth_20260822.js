//=============
//音楽関連
//=============
let bgPC
let bgSP
let bgImg

function preload(){
 bgPC = loadImage("../img/pc_bg.jpg");
 bgSP = loadImage("../img/sp_bg.jpg");
}

let song;
let amplitude;

let stars = [];

let t =0.01;

let baseRadius = 200;

function setup() {
    createCanvas(windowWidth, windowHeight);

    amplitude = new p5.Amplitude();

    selectBackground();

    let select = document.getElementById("musicSelect");


   select.addEventListener("change" , changeMusic);//次はここから！！８月15日
}

function draw() {
   drawBackground();

    let volume = 0;

    if (song){
        volume = amplitude.getLevel();
    }

    let centerX = width/2 + sin(frameCount * 0.01) * 20

    let centerY=height/2 + sin(frameCount * 0.008) * 20

    let distrtion = map(
        volume,
        0,
        0.3,
        10,
        120
    );
    push();

    translate(centerX,centerY);

    //fill(255,200,255,255);

    //noStroke();
    noFill();
    stroke(255,200,255,255)
    strokeWeight(20);
    beginShape();

    for (let angle = 0; angle <  TWO_PI; angle +=0.1){
        
        let r = baseRadius + noise(cos(angle) + t, sin(angle) + t)*distrtion;

        let x = cos(angle) * r;
        let y = sin(angle) * r;

        vertex(x,y);

        
    }
    endShape(CLOSE);

    pop();
    
    t += 0.01;

    for (let i = stars.length - 1; i >= 0; i--){

        stars[i].update();
        stars[i].show();

        if (stars[i].finished()){
            stars.splice(i,1);
        }
    }
}
function changeMusic(event){
    if (song){
        song.stop();
    }
    let path = event.target.value;

    if (path == "")return;

    loadSound(
        path,
        function(sound){
            song = sound;
            song.play();
            amplitude.setInput(song);
        }
    );
}
/*
function loadMusic(event){
    if (song){
        song.stop();
    }

    let file = event.target.files[0];

    if (!file) return;

    let url = URL.createObjectURL(file);

    loadSound(
        url,
        function (sound){
            song = sound;

            song.play();

            amplitude.setInput(song);
        }
    );  
    
}
*/
function selectBackground(){

    if(windowWidth >=768){
        bgImg = bgPC;
    }else{
        bgImg = bgSP;
    }
}
function drawBackground(){

    let canvasRatio=width/height;

    let imgRatio=bgImg.width/bgImg.height;

    let sx,sy,sw,sh;

    if(imgRatio > canvasRatio){

        sh=bgImg.height

        sw=sh*canvasRatio;

        sx=(bgImg.width-sw)/2;

        sy=0;

    }else{

        sw = bgImg.width;

        sh = sw/canvasRatio;

        sx = 0;

        sy = (bgImg.height-sh)/2;

    }

    image(bgImg,0,0,width,height,sx,sy,sw,sh);
}
function windowResized(){

    resizeCanvas(windowWidth,windowHeight);

    selectBackground()
}
function mousePressed() {

    createStarEffect(mouseX,mouseY);

}
function touchStarted() {

    createStarEffect(mouseX,mouseY);

    return false;

}
function createStarEffect(x,y){

    for(let i = 0; i < 100; i++){
        stars.push(new StarParticle(x,y));
    }
}

class StarParticle{

    constructor(x,y){

        this.x = x;
        this.y = y;

        let angle = random(TWO_PI);
        let speed = random(3,10);

        this.vx = cos(angle) * speed;
        this.vy = sin(angle) * speed;

        this.size = random(8,18);

        this.life = 255;

        this.rotate = random(TWO_PI);
        this.rotateSpeed = random(-0.2,0.2);

        this.color = color(
            random(220,255),
            random(220,255),
            random(150,255)
        );
    }

    update(){

        this.x += this.vx;
        this.y += this.vy;

        this.vy += 0.08;

        this.rotate += this.rotateSpeed;

        this.life -= 5;

        this.size *= 0.98;
    }

    show(){

        push();

        translate(this.x,this.y);

        rotate(this.rotate);

        noStroke();

        fill(
            red(this.color),
            green(this.color),
            blue(this.color),
            this.life
        );
        beginShape();
        
        for (let i = 0; i < 10; i++) {

            let angle = TWO_PI / 10 * i;
            
            let r;

            if(i % 2 == 0){
                r = this.size;
            }else{
                r = this.size * 0.4
            }
            vertex(
                cos(angle) * r,
                sin(angle) * r
            );
        }
        endShape(CLOSE);

        pop();
    }
    finished(){
        return this.life <= 0;
    }
}
