const bootEl=document.getElementById("boot");
const titleStage=document.getElementById("titleStage");
const masterTitle=document.getElementById("masterTitle");
const shell=document.getElementById("shell");
const greeting=document.getElementById("greeting");
const tapGate=document.getElementById("tapGate");
const endStage=document.getElementById("endStage");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

const bootLines=[
  "FROZE-NEX SYSTEM INITIALIZATION",
  "Loading FNX display subsystem...",
  "Loading audio feedback modules...",
  "Mounting user environment...",
  "Checking interface state...",
  "Starting FNX graphical shell...",
  "Authentication granted."
];

const sounds={
  stdout:new Audio("sounds/stdout.wav"),
  granted:new Audio("sounds/granted.wav"),
  theme:new Audio("sounds/theme.wav"),
  expand:new Audio("sounds/expand.wav"),
  keyboard:new Audio("sounds/keyboard.wav")
};

Object.values(sounds).forEach(a=>{
  a.preload="auto";
  a.volume=.9;
});

function play(name){
  const a=sounds[name];
  if(!a)return;
  try{
    a.currentTime=0;
    a.play().catch(()=>{});
  }catch(e){}
}

function bootDelay(i,total){
  if(i===2||i===4)return 210;
  if(i>4&&i<25)return 12;
  if(i===25)return 170;
  if(i===42)return 125;
  if(i>42&&i<82)return 10;
  if(i===83)return 10;
  if(i>=total-2&&i<total)return 125;
  return Math.max(4,Math.pow(1-(i/1000),3)*11);
}

async function unlockAudio(){
  for(const a of Object.values(sounds)){
    try{
      a.muted=true;
      await a.play();
      a.pause();
      a.currentTime=0;
      a.muted=false;
    }catch(e){}
  }
}

async function runFNX(){
  tapGate.classList.add("hidden");
  bootEl.textContent="";
  titleStage.classList.add("hidden");
  shell.classList.add("hidden");
  shell.classList.remove("open");
  greeting.classList.remove("visible");
  endStage.classList.add("hidden");
  endStage.classList.remove("visible");
  document.body.classList.remove("fade-out");

  for(let i=0;i<bootLines.length;i++){
    const line=bootLines[i];
    play(line==="Authentication granted."?"granted":"stdout");
    bootEl.textContent+=line+"\n";
    if(i===1){
      bootEl.textContent+="FNX Kernel boot at "+new Date().toString()+"; root:xnu-1699.22.73~1/RELEASE_ARM64\n";
    }
    await sleep(bootDelay(i+1,bootLines.length));
  }

  await sleep(120);
  bootEl.textContent="";
  play("theme");
  await sleep(400);

  titleStage.classList.remove("hidden");
  await sleep(200);

  document.querySelector(".screen").style.background="var(--main)";
  masterTitle.style.color="var(--bg)";
  await sleep(100);

  document.querySelector(".screen").style.background="";
  masterTitle.style.color="";
  await sleep(300);
  await sleep(100);

  masterTitle.classList.add("glitch");
  await sleep(500);

  masterTitle.classList.remove("glitch");
  await sleep(1000);

  titleStage.classList.add("hidden");

  await sleep(10);
  shell.classList.remove("hidden");
  play("expand");
  requestAnimationFrame(()=>shell.classList.add("open"));

  await sleep(500);
  await sleep(700);
  await sleep(10);
  await sleep(270);

  play("keyboard");
  greeting.classList.add("visible");

  await sleep(3000);

  // No deep-link to Shortcuts anymore.
  // Fade the whole FNX UI out.
  document.body.classList.add("fade-out");
  await sleep(600);

  // Brief clean status screen.
  shell.classList.add("hidden");
  greeting.classList.remove("visible");
  document.body.classList.remove("fade-out");
  document.querySelector(".screen").classList.add("final-black");
  endStage.classList.remove("hidden");
  requestAnimationFrame(()=>endStage.classList.add("visible"));

  await sleep(650);

  endStage.classList.remove("visible");
  await sleep(220);
  endStage.classList.add("hidden");

  // Remain on a pure black screen. User can swipe Home naturally.
}

let started=false;
async function begin(e){
  if(started)return;
  started=true;
  if(e)e.preventDefault();
  await unlockAudio();
  runFNX();
}

tapGate.addEventListener("click",begin,{once:true});
tapGate.addEventListener("touchend",begin,{once:true,passive:false});
