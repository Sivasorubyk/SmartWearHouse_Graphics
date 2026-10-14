import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import './style.css';
import { createWarehouse, createRobot, createLightRig } from './objects.js';

const scene=new THREE.Scene(); scene.background=new THREE.Color(0x0b1c28); scene.fog=new THREE.Fog(0x0b1c28,24,52);
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
document.querySelector('#app').appendChild(renderer.domElement);

createWarehouse(scene);
const {robot,wheels}=createRobot(); scene.add(robot);
const {rig:lightRig,spot,helper:lightHelper}=createLightRig(scene);
const ambient=new THREE.HemisphereLight(0xb9e5ff,0x1b1710,1.25); scene.add(ambient);
const sun=new THREE.DirectionalLight(0xffffff,2.2); sun.position.set(8,14,6); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left=-18; sun.shadow.camera.right=18; sun.shadow.camera.top=15; sun.shadow.camera.bottom=-15; scene.add(sun);

const aspect=innerWidth/innerHeight;
const perspective=new THREE.PerspectiveCamera(58,aspect,.1,100); perspective.position.set(15,10,17); perspective.lookAt(0,2,0);
const top=new THREE.OrthographicCamera(-16*aspect,16*aspect,16,-16,.1,100); top.position.set(0,30,.01); top.lookAt(0,0,0);
const follow=new THREE.PerspectiveCamera(65,aspect,.1,100);
let activeCamera=perspective, cameraName='Perspective';
const controls=new OrbitControls(perspective,renderer.domElement); controls.enableDamping=true; controls.target.set(0,2,0); controls.maxPolarAngle=Math.PI*.49; controls.minDistance=5; controls.maxDistance=42;

const settings={
  robotMode:'Auto', robotSpeed:2.2, lightSpeed:.55, lightRadius:9, lightHeight:10, lightIntensity:180,
  animation:true, shadows:true, dayMode:true, wireframe:false, showLightHelper:false,
  camera:'Perspective',
  reset(){ resetScene(); }
};
const gui=new GUI({title:'Warehouse Control Panel'});
gui.add(settings,'camera',['Perspective','Top','Follow']).name('Camera').onChange(setCamera);
gui.add(settings,'robotMode',['Auto','Manual']).name('Robot mode');
gui.add(settings,'robotSpeed',.2,5,.1).name('Robot speed');
const lightFolder=gui.addFolder('Moving light');
lightFolder.add(settings,'lightSpeed',0,2,.05).name('Orbit speed'); lightFolder.add(settings,'lightRadius',3,14,.5).name('Radius');
lightFolder.add(settings,'lightHeight',5,15,.5).name('Height'); lightFolder.add(settings,'lightIntensity',20,350,5).name('Intensity');
lightFolder.add(settings,'showLightHelper').name('Show cone');
const renderFolder=gui.addFolder('Rendering'); renderFolder.add(settings,'animation').name('Play animation'); renderFolder.add(settings,'shadows').name('Dynamic shadows'); renderFolder.add(settings,'dayMode').name('Day mode').onChange(applyDayNight); renderFolder.add(settings,'wireframe').name('Wireframe').onChange(applyWireframe);
gui.add(settings,'reset').name('Reset scene');

const keys={}; addEventListener('keydown',e=>{ keys[e.key.toLowerCase()]=true; handleShortcut(e); }); addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function handleShortcut(e){
  if(e.key==='1') setCamera('Perspective'); if(e.key==='2') setCamera('Top'); if(e.key==='3') setCamera('Follow');
  if(e.code==='Space'){e.preventDefault();settings.animation=!settings.animation;gui.controllersRecursive().forEach(c=>c.updateDisplay());}
  if(e.key.toLowerCase()==='n'){settings.dayMode=!settings.dayMode;applyDayNight();}
  if(e.key.toLowerCase()==='f'){settings.wireframe=!settings.wireframe;applyWireframe();}
  if(e.key.toLowerCase()==='r') resetScene(); updateStatus();
}
function setCamera(name){ settings.camera=name; cameraName=name; activeCamera=name==='Top'?top:name==='Follow'?follow:perspective; controls.enabled=name==='Perspective'; updateStatus(); }
function applyDayNight(){ scene.background.set(settings.dayMode?0x0b1c28:0x02050b); scene.fog.color.copy(scene.background); ambient.intensity=settings.dayMode?1.25:.2; sun.intensity=settings.dayMode?2.2:.08; renderer.toneMappingExposure=settings.dayMode?1.05:.82; gui.controllersRecursive().forEach(c=>c.updateDisplay()); updateStatus(); }
function applyWireframe(){ scene.traverse(o=>{if(o.isMesh && o.material && !o.material.isMeshBasicMaterial)o.material.wireframe=settings.wireframe;}); gui.controllersRecursive().forEach(c=>c.updateDisplay()); }
function resetScene(){ robot.position.set(-7,0,1.8); robot.rotation.set(0,0,0); settings.animation=true; settings.robotMode='Auto'; settings.dayMode=true; settings.wireframe=false; setCamera('Perspective'); applyDayNight(); applyWireframe(); gui.controllersRecursive().forEach(c=>c.updateDisplay()); }
function updateStatus(){ document.querySelector('#status').textContent=`Camera: ${cameraName} | Robot: ${settings.robotMode} | ${settings.dayMode?'Day':'Night'} | ${settings.animation?'Running':'Paused'}`; }

const clock=new THREE.Clock(); let elapsed=0, autoDirection=1;
function updateRobot(dt){
  let distance=0;
  if(settings.robotMode==='Auto'){
    distance=settings.robotSpeed*dt*autoDirection; robot.position.x+=distance;
    if(robot.position.x>7){robot.position.x=7;autoDirection=-1;robot.rotation.y=Math.PI;}
    if(robot.position.x<-7){robot.position.x=-7;autoDirection=1;robot.rotation.y=0;}
  } else {
    const turn=1.7*dt; if(keys.a)robot.rotation.y+=turn;if(keys.d)robot.rotation.y-=turn;
    if(keys.w)distance=-settings.robotSpeed*dt;if(keys.s)distance=settings.robotSpeed*dt;
    robot.translateZ(distance); robot.position.x=THREE.MathUtils.clamp(robot.position.x,-15,15); robot.position.z=THREE.MathUtils.clamp(robot.position.z,-10,10);
  }
  wheels.forEach(w=>w.rotation.x-=distance*3.1);
}
function updateLight(dt){ elapsed+=dt*settings.lightSpeed; lightRig.position.set(Math.cos(elapsed)*settings.lightRadius,settings.lightHeight,Math.sin(elapsed)*settings.lightRadius); spot.intensity=settings.lightIntensity; spot.castShadow=settings.shadows; lightHelper.visible=settings.showLightHelper; lightHelper.update(); }
function updateFollow(){ const offset=new THREE.Vector3(0,4.2,6.5).applyQuaternion(robot.quaternion); follow.position.lerp(robot.position.clone().add(offset),.08); const target=robot.position.clone().add(new THREE.Vector3(0,.8,0)); follow.lookAt(target); }
function animate(){ requestAnimationFrame(animate); const dt=Math.min(clock.getDelta(),.05); if(settings.animation){updateRobot(dt);updateLight(dt);} updateFollow(); controls.update(); renderer.render(scene,activeCamera); }
animate(); updateStatus();

addEventListener('resize',()=>{ const a=innerWidth/innerHeight; perspective.aspect=a; perspective.updateProjectionMatrix(); follow.aspect=a; follow.updateProjectionMatrix(); top.left=-16*a;top.right=16*a;top.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight); });
