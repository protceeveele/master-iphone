const bootEl=document.getElementById("boot"),titleStage=document.getElementById("titleStage"),masterTitle=document.getElementById("masterTitle"),shell=document.getElementById("shell"),greeting=document.getElementById("greeting"),startBtn=document.getElementById("startBtn");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const bootLines=["MASTER SYSTEM INITIALIZATION","Loading display subsystem...","Loading audio feedback modules...","Mounting user environment...","Checking interface state...","Starting graphical shell...","Boot Complete"];
const sounds={stdout:new Audio("sounds/stdout.wav"),granted:new Audio("sounds/granted.wav"),theme:new Audio("sounds/theme.wav"),expand:new Audio("sounds/expand.wav"),keyboard:new Audio("sounds/keyboard.wav")};
Object.values(sounds).forEach(a=>{a.preload="auto";a.volume=.85});
function play(n){const a=sounds[n];if(!a)return;try{a.currentTime=0;a.play().catch(()=>{})}catch{}}
function bootDelay(i,total){if(i===2||i===4)return 210;if(i>4&&i<25)return 12;if(i===25)return 170;if(i===42)return 125;if(i>42&&i<82)return 10;if(i===83)return 10;if(i>=total-2&&i<total)return 125;return Math.max(4,Math.pow(1-(i/1000),3)*11)}
async function runMaster(){
startBtn.classList.add("hidden");bootEl.textContent="";titleStage.classList.add("hidden");shell.classList.add("hidden");shell.classList.remove("open");greeting.classList.remove("visible");document.body.classList.remove("fade-out");
for(let i=0;i<bootLines.length;i++){const line=bootLines[i];play(line==="Boot Complete"?"granted":"stdout");bootEl.textContent+=line+"\n";if(i===1)bootEl.textContent+="MASTER Kernel boot at "+new Date().toString()+"; root:xnu-1699.22.73~1/RELEASE_ARM64\n";await sleep(bootDelay(i+1,bootLines.length))}
await sleep(120);bootEl.textContent="";play("theme");await sleep(400);titleStage.classList.remove("hidden");await sleep(200);document.querySelector(".screen").style.background="var(--main)";masterTitle.style.color="var(--bg)";await sleep(100);document.querySelector(".screen").style.background="";masterTitle.style.color="";await sleep(300);await sleep(100);masterTitle.classList.add("glitch");await sleep(500);masterTitle.classList.remove("glitch");await sleep(1000);titleStage.classList.add("hidden");
await sleep(10);shell.classList.remove("hidden");play("expand");requestAnimationFrame(()=>shell.classList.add("open"));await sleep(500);await sleep(700);await sleep(10);await sleep(270);play("keyboard");greeting.classList.add("visible");await sleep(3000);document.body.classList.add("fade-out");await sleep(600);
window.location.href="shortcuts://run-shortcut?name=MASTER%20END";
}
startBtn.addEventListener("click",runMaster);
window.addEventListener("load",async()=>{startBtn.classList.add("hidden");await sleep(120);runMaster();});