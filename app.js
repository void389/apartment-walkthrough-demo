import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';

const stage=document.querySelector('#stage');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(stage.clientWidth,stage.clientHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
stage.prepend(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0xe8e2d7);scene.fog=new THREE.Fog(0xe8e2d7,40,72);
const camera=new THREE.PerspectiveCamera(42,stage.clientWidth/stage.clientHeight,.1,120);camera.position.set(0,31,30);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=6;controls.maxDistance=62;controls.maxPolarAngle=Math.PI*.49;controls.target.set(0,0,0);
scene.add(new THREE.HemisphereLight(0xfff7e8,0x625a50,2.1));
const sun=new THREE.DirectionalLight(0xfff0d4,3.0);sun.position.set(-10,24,15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=20;sun.shadow.camera.bottom=-20;scene.add(sun);

const M={floor:new THREE.MeshStandardMaterial({color:0xd7d0c2,roughness:.84}),stone:new THREE.MeshStandardMaterial({color:0xc8beae,roughness:.68}),walnut:new THREE.MeshStandardMaterial({color:0x704730,roughness:.62}),dark:new THREE.MeshStandardMaterial({color:0x37332e,roughness:.55}),ivory:new THREE.MeshStandardMaterial({color:0xece5d8,roughness:.9}),taupe:new THREE.MeshStandardMaterial({color:0xa79888,roughness:.9}),glass:new THREE.MeshPhysicalMaterial({color:0xbfd3d3,transmission:.78,transparent:true,opacity:.42,roughness:.15}),green:new THREE.MeshStandardMaterial({color:0x556b58,roughness:.9}),wine:new THREE.MeshStandardMaterial({color:0x5e2027,roughness:.55})};
const apt=new THREE.Group();scene.add(apt);
function box(x,z,w,d,h,mat=M.ivory,y=h/2){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;apt.add(o);return o}
function cyl(x,z,r,h,mat=M.dark,y=h/2){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,24),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;apt.add(o);return o}
function wall(x,z,w,d=0.18,h=1.35,mat=M.ivory){return box(x,z,w,d,h,mat)}
function rug(x,z,w,d,color=0xbeb2a2){const m=new THREE.MeshStandardMaterial({color,roughness:1});return box(x,z,w,d,.035,m,.035)}
function bed(x,z,w=3.1,d=2.1,rot=0){const g=new THREE.Group(),base=new THREE.Mesh(new THREE.BoxGeometry(w,.45,d),M.walnut);base.position.y=.28;const mattress=new THREE.Mesh(new THREE.BoxGeometry(w-.16,.33,d-.12),M.ivory);mattress.position.y=.67;const head=new THREE.Mesh(new THREE.BoxGeometry(w,.95,.16),M.taupe);head.position.set(0,.7,-d/2+.08);g.add(base,mattress,head);g.position.set(x,0,z);g.rotation.y=rot;g.traverse(o=>{o.castShadow=true;o.receiveShadow=true});apt.add(g)}
function sofa(x,z,w=3.2,d=1.1,rot=0){const g=new THREE.Group();const seat=new THREE.Mesh(new THREE.BoxGeometry(w,.42,d),M.taupe);seat.position.y=.42;const back=new THREE.Mesh(new THREE.BoxGeometry(w,.72,.22),M.taupe);back.position.set(0,.72,-d/2+.1);g.add(seat,back);for(const sx of [-w/2+.12,w/2-.12]){const arm=new THREE.Mesh(new THREE.BoxGeometry(.22,.62,d),M.taupe);arm.position.set(sx,.54,0);g.add(arm)}g.position.set(x,0,z);g.rotation.y=rot;g.traverse(o=>o.castShadow=true);apt.add(g)}
function table(x,z,w,d,chairs=0){box(x,z,w,d,.12,M.walnut,.78);for(const dx of [-w/2+.18,w/2-.18])for(const dz of [-d/2+.18,d/2-.18])box(x+dx,z+dz,.09,.09,.72,M.dark,.4);if(chairs){for(let i=0;i<chairs;i++){const side=i<chairs/2?-1:1,idx=i%(chairs/2),cz=z-d/2+(idx+.5)*d/(chairs/2);box(x+side*(w/2+.42),cz,.48,.48,.52,M.taupe,.29)}}}
function plant(x,z){cyl(x,z,.22,.38,M.stone,.2);const crown=new THREE.Mesh(new THREE.SphereGeometry(.48,16,12),M.green);crown.scale.y=1.35;crown.position.set(x,1,z);crown.castShadow=true;apt.add(crown)}

// Overall plan proportions follow the supplied long rectangular Option 06 layout.
box(0,0,32,15,.18,M.floor,-.09);wall(0,-7.5,32);wall(0,7.5,32);wall(-16,0,.18,15);wall(16,0,.18,15);
// Central circulation/core.
wall(0,2.3,8.5,.28,1.75,M.stone);wall(0,-2.4,8.5,.28,1.75,M.stone);wall(-4.2,0,.28,4.9,1.75,M.stone);wall(4.2,0,.28,4.9,1.75,M.stone);
box(0,0,5.6,2.7,.35,M.dark,.18);for(let i=-3;i<=3;i++)box(i*.72,0,.58,2.2,.12,M.stone,.43+Math.abs(i)*.05);
// Master suite + two closets + bath/spa, left wing.
wall(-9.1,2.6,.18,9.8);wall(-13.2,2.2,5.6,.18);wall(-12.1,-1.8,7.2,.18);wall(-12.1,4.2,7.2,.18);
rug(-12.6,4.9,5.2,4.6,0xc7b8a5);bed(-12.5,5.2,3.4,2.25);box(-14.4,6.3,1,.45,.62,M.walnut,.32);plant(-10.1,6.3);
for(let z=-.9;z<1.6;z+=.55){box(-11.3,z,.65,.35,2.15,M.walnut,1.08);box(-14.8,z,.65,.35,2.15,M.walnut,1.08)}
box(-13.3,-4.8,2.8,1.35,.48,M.ivory,.27);cyl(-13.3,-4.8,.5,.5,M.stone,.55);box(-10.4,-4.4,2.1,.85,.12,M.stone,.58);box(-10.4,-4.4,1.2,.45,.22,M.glass,1.12);
// Compact spa zone: timber sauna bench, cold plunge, and glazed shower.
box(-14.7,-6.45,1.7,.48,.52,M.walnut,.3);box(-14.7,-6.95,1.7,.12,1.8,M.walnut,.9);
for(let x=-15.35;x<=-14.05;x+=.22)box(x,-6.86,.11,.08,1.55,M.walnut,.88);
box(-11.8,-6.4,1.15,.9,.7,M.dark,.36);box(-11.8,-6.4,.86,.62,.68,M.glass,.43);
box(-9.85,-6.25,.08,1.75,1.9,M.glass,.95);box(-10.75,-7.04,1.85,.08,1.9,M.glass,.95);
// Baby room and secondary bedroom.
wall(-4.2,4.3,8.4);wall(-.2,4.85,.18,5.3);bed(-6.5,5.6,2.5,1.7);box(-3.4,5.7,1.4,.75,.62,M.ivory,.33);cyl(-3.4,5.7,.32,.18,M.walnut,.72);
wall(4.2,4.2,8.2);wall(.2,4.95,.18,5.1);bed(2.1,5.6,2.55,1.75);box(3.2,3.2,1.8,.38,1.05,M.walnut,.55);
// Living / TV room with operable folding screen.
rug(7.7,4.65,6.2,4.6,0xb9ad9d);sofa(7.3,5.5,3.8,1.05,Math.PI);sofa(9.3,3.8,2.7,1.0,-Math.PI/2);box(7.4,4.25,1.4,.8,.26,M.stone,.16);plant(10.4,6.3);
wall(5.1,2.5,7.6);wall(11.2,0,.18,5.1);rug(7.7,-.1,5.6,4.2,0x8f8274);sofa(7.2,-.4,3.6,1.05);box(9.5,.8,.28,2.8,1.45,M.dark,.76);box(9.33,.8,.07,2.25,1.05,new THREE.MeshStandardMaterial({color:0x171717}),.95);
const doors=[];for(let i=0;i<4;i++){const p=box(5.23+i*1.42,2.4,1.34,.16,2.5,M.walnut,1.25);p.geometry.translate(.67,0,0);p.position.x-=.67;p.userData.baseX=p.position.x;p.userData.index=i;doors.push(p)}
// Dining, kitchen, wine cellar right wing.
wall(11.2,-2.3,9.6);table(13.1,4.6,1.65,4.0,8);box(13.4,1.7,3.8,.72,.95,M.stone,.49);for(let x=12.2;x<=14.6;x+=1.2)cyl(x,1.0,.23,.5,M.dark,.27);
box(13.2,-5.8,5,.75,.95,M.stone,.49);box(15.2,-3.9,.75,3.1,.95,M.stone,.49);table(11.9,-4.2,2.5,1.25,4);
wall(7.7,-4.4,6.8);wall(7.7,-6.2,6.8);wall(4.4,-5.3,.18,1.8);for(let x=5.1;x<10.6;x+=.55){cyl(x,-5.55,.12,.72,M.wine,.5);cyl(x,-4.95,.12,.72,M.wine,.5)}
// Warm perimeter lighting and glazing rhythm.
for(let x=-14.5;x<=14.5;x+=2.6){box(x,7.38,1.65,.04,1.25,M.glass,1.55);box(x,-7.38,1.65,.04,1.25,M.glass,1.55)}
for(const p of [[-14,3],[-8,6],[-2,6],[6,6],[14,5],[14,-4],[-14,-5]]){const l=new THREE.PointLight(0xffd6a3,8,6,2);l.position.set(p[0],2.4,p[1]);scene.add(l)}

const views={
 overview:{p:[0,31,30],t:[0,0,0],n:'Overview',d:'Complete residence · plan-informed concept'},
 master:{p:[-12,10,12],t:[-12,0,4],n:'Master suite',d:'Quiet ivory textiles · walnut joinery · private dressing'},
 spa:{p:[-12,8,-10],t:[-12,0,-5.4],n:'Bath & spa',d:'Pale stone · sauna · cold plunge · glass shower'},
 baby:{p:[-5,9,11],t:[-4.8,0,5.3],n:'Baby room',d:'Soft neutrals · compact nursery composition'},
 bedroom:{p:[2,9,11],t:[2,0,5.1],n:'Secondary room',d:'Integrated storage · warm indirect light'},
 living:{p:[8,10,12],t:[8,0,4.7],n:'Living room',d:'Low rounded seating · panoramic glazing'},
 tv:{p:[8,9,7],t:[8,0,0],n:'TV room',d:'Enclosed lounge · operable folding screen'},
 wine:{p:[7,8,-9],t:[7,0,-5.4],n:'Wine cellar',d:'Dark bronze racks · warm walnut surround'},
 dining:{p:[14,10,11],t:[13,0,1],n:'Dining & kitchen',d:'Entertaining table · stone island · open kitchen'}
};
let desiredP=camera.position.clone(),desiredT=controls.target.clone(),doorOpen=false;
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-view]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const v=views[b.dataset.view];desiredP.set(...v.p);desiredT.set(...v.t);document.querySelector('#view-name').textContent=v.n;document.querySelector('#view-note').textContent=v.d}));
document.querySelector('#door-toggle').addEventListener('click',e=>{doorOpen=!doorOpen;e.currentTarget.textContent=doorOpen?'Close TV room doors':'Open TV room doors'});
document.querySelector('#download').addEventListener('click',()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download=`apartment-${document.querySelector('#view-name').textContent.toLowerCase().replaceAll(' ','-')}.png`;a.href=renderer.domElement.toDataURL('image/png');a.click()});
function resize(){const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}window.addEventListener('resize',resize);
function animate(){requestAnimationFrame(animate);camera.position.lerp(desiredP,.035);controls.target.lerp(desiredT,.04);doors.forEach((d,i)=>{const target=doorOpen?(i%2===0?Math.PI/2:-Math.PI/2):0;d.rotation.y+=(target-d.rotation.y)*.08});controls.update();renderer.render(scene,camera)}
document.querySelector('#loading').remove();animate();
