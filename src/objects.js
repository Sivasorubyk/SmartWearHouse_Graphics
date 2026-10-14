import * as THREE from 'three';
import { cardboardTexture, concreteTexture, warningTexture } from './textures.js';

const shadow = mesh => { mesh.castShadow = true; mesh.receiveShadow = true; return mesh; };

export function createWarehouse(scene) {
  const floor = shadow(new THREE.Mesh(
    new THREE.PlaneGeometry(34, 24),
    new THREE.MeshStandardMaterial({ map: concreteTexture(), roughness: .88, metalness: .04 })
  ));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x52626d, roughness: .8 });
  const back = shadow(new THREE.Mesh(new THREE.BoxGeometry(34, 8, .3), wallMat));
  back.position.set(0, 4, -12); scene.add(back);
  const side = shadow(new THREE.Mesh(new THREE.BoxGeometry(.3, 8, 24), wallMat));
  side.position.set(-17, 4, 0); scene.add(side);

  const stripe = new THREE.Mesh(new THREE.PlaneGeometry(28, .45), new THREE.MeshStandardMaterial({ map: warningTexture(), roughness: .7 }));
  stripe.rotation.x = -Math.PI/2; stripe.position.set(0, .012, 0); scene.add(stripe);

  [[-10,-7],[-10,5],[10,-7],[10,5]].forEach(([x,z]) => scene.add(createShelf(x,z)));
  addCeilingBeams(scene);
}

function createShelf(x,z) {
  const group = new THREE.Group(); group.position.set(x,0,z);
  const metal = new THREE.MeshStandardMaterial({ color: 0x263c49, metalness: .75, roughness: .3 });
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0x5a7080, metalness: .55, roughness: .4 });
  [-2.5,2.5].forEach(px => [-1.25,1.25].forEach(pz => {
    const post = shadow(new THREE.Mesh(new THREE.BoxGeometry(.18,5.2,.18), metal)); post.position.set(px,2.6,pz); group.add(post);
  }));
  [1.1,2.6,4.1].forEach((y,level) => {
    const board = shadow(new THREE.Mesh(new THREE.BoxGeometry(5.3,.16,2.8), shelfMat)); board.position.y=y; group.add(board);
    for(let i=0;i<3;i++) {
      const box = shadow(new THREE.Mesh(new THREE.BoxGeometry(1.25,.85,1.15), new THREE.MeshStandardMaterial({ map: cardboardTexture(), roughness:.8 })));
      box.position.set(-1.55+i*1.55, y+.5, level%2 ? .45 : -.35); box.rotation.y=(i-1)*.06; group.add(box);
    }
  });
  return group;
}

function addCeilingBeams(scene) {
  const mat = new THREE.MeshStandardMaterial({color:0x24323b,metalness:.8,roughness:.3});
  [-10,0,10].forEach(x=>{ const b=shadow(new THREE.Mesh(new THREE.BoxGeometry(.25,.25,24),mat)); b.position.set(x,7.6,0); scene.add(b); });
}

export function createRobot() {
  const robot = new THREE.Group(); robot.name='AGV Robot';
  const blue = new THREE.MeshStandardMaterial({color:0x087ea4,metalness:.68,roughness:.25});
  const dark = new THREE.MeshStandardMaterial({color:0x101820,metalness:.35,roughness:.55});
  const glow = new THREE.MeshStandardMaterial({color:0x65f6d0,emissive:0x16a884,emissiveIntensity:2});
  const body=shadow(new THREE.Mesh(new THREE.BoxGeometry(2.4,.75,1.7),blue)); body.position.y=.72; robot.add(body);
  const bumper=shadow(new THREE.Mesh(new THREE.BoxGeometry(2.5,.22,1.82),dark)); bumper.position.y=.38; robot.add(bumper);
  const sensor=shadow(new THREE.Mesh(new THREE.CylinderGeometry(.25,.34,.45,32),dark)); sensor.position.y=1.32; robot.add(sensor);
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.11,20,14),glow); eye.position.set(0,1.4,-.28); robot.add(eye);
  const wheels=[];
  [[-1.02,.5],[1.02,.5],[-1.02,-.5],[1.02,-.5]].forEach(([x,z])=>{
    const wheel=shadow(new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.24,24),dark));
    wheel.rotation.z=Math.PI/2; wheel.position.set(x,.35,z); wheels.push(wheel); robot.add(wheel);
  });
  const beacon=new THREE.PointLight(0x35ffd2,1.2,3); beacon.position.set(0,1.65,0); robot.add(beacon);
  robot.position.set(-7,0,1.8); return {robot,wheels,eye};
}

export function createLightRig(scene) {
  const rig=new THREE.Group(); scene.add(rig);
  const lamp=new THREE.Mesh(new THREE.SphereGeometry(.22,20,14),new THREE.MeshBasicMaterial({color:0xffdd88})); rig.add(lamp);
  const spot=new THREE.SpotLight(0xffe0a3,180,30,Math.PI/5,.38,1.2); spot.castShadow=true; spot.shadow.mapSize.set(2048,2048); spot.shadow.camera.near=.5; spot.shadow.camera.far=35;
  rig.add(spot); scene.add(spot.target); spot.target.position.set(0,0,0);
  const helper=new THREE.SpotLightHelper(spot); helper.visible=false; scene.add(helper);
  return {rig,spot,helper};
}
