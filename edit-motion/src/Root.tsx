import React from 'react';
import {AbsoluteFill, Composition, Sequence, Img, staticFile, getStaticFiles, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {geoMercator, geoPath} from 'd3-geo';
import type {FeatureCollection, Feature, Geometry} from 'geojson';
import brand from '../../data/brand.json';
import regions from '../../data/regions.json';
import cast from '../../data/cast.json';
import geo from '../public/maps/metro.geo.json';
import './style.css';

const C=brand.colors;
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const metro=geo as FeatureCollection;
const target=metro.features.find(f=>f.properties?.code==='31023') as Feature;
const projection=geoMercator().fitExtent([[80,220],[1030,900]],metro);
const path=geoPath(projection);
const bounds=path.bounds(target);
const cx=(bounds[0][0]+bounds[1][0])/2, cy=(bounds[0][1]+bounds[1][1])/2;
const center=path.centroid(target);

const Header=()=> <div className="header"><span className="logo">{brand.company}</span><span>{brand.service}</span></div>;

export const Pangyo=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();
 const progress=interpolate(frame,[.5*fps,2.3*fps],[0,1],clamp);
 const scale=1+progress*.9;
 const tx=progress*(540-cx*1.9),ty=progress*(565-cy*1.9);
 const count=interpolate(frame,[1.8*fps,3*fps],[0,1],clamp);
 return <AbsoluteFill className="scene"><Header/>
  <div className="map-label">{brand.map.areaNote}</div>
  <svg width="1120" height="1080" style={{position:'absolute',left:0,top:0}}>
   <defs><clipPath id="map-clip"><rect x="50" y="180" width="1030" height="770" rx="30"/></clipPath></defs>
   <g clipPath="url(#map-clip)"><g transform={`translate(${tx} ${ty}) scale(${scale})`}>
    {metro.features.map(f=><path key={String(f.properties?.code)} d={path(f as Feature<Geometry>)??''} fill={f.properties?.code==='31023'?(progress>.2?C.problem:'#566273'):'#192638'} stroke={f.properties?.code==='31023'?'#FFC9CB':'#49546A'} strokeWidth={f.properties?.code==='31023'?2:0.7}/>) }
   </g></g>
   <circle cx={center[0]*scale+tx} cy={center[1]*scale+ty} r="9" fill="#fff"/>
  </svg>
  <div className="map-note">{brand.map.sourceNote}</div>
  <section className="cause-card" style={{opacity:interpolate(frame,[.5*fps,1.2*fps],[0,1],clamp),translate:`0px ${interpolate(frame,[.5*fps,1.2*fps],[36,0],clamp)}px`}}>
   <div className="eyebrow">{regions[2].name}</div><h1>{brand.map.title}</h1>
   <div className="metrics"><div><label>{brand.map.ordersLabel}</label><strong>{Math.round(regions[2].orders*count)}<small>건</small></strong></div><div><label>{brand.map.renewalLabel}</label><strong>{Math.round(regions[2].renewal*count)}<small>%</small></strong></div></div>
   <div className="cause"><svg viewBox="0 0 80 80" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="4"><path d="M10 68V12h42v56M3 68h74M23 25h7m8 0h7M23 40h7m8 0h7M25 68V53h15v15M62 19v22m10-22v22m-10-5h10m-5 5v24"/></svg><span>{regions[2].cause}</span></div>
  </section>
 </AbsoluteFill>;
};

const Silhouette=()=> <svg width="530" height="790" viewBox="0 0 530 790" aria-label="임시 회색 실루엣"><ellipse cx="265" cy="749" rx="180" ry="19" fill="#070E1B"/><circle cx="265" cy="125" r="82" fill="#9CA3AF"/><path d="M187 215Q265 180 343 215L405 440 349 465 316 337 324 562 312 744H254L239 570 220 744H159L167 558 177 337 136 465 80 438Z" fill="#7C8594"/><path d="M220 207l45 75 45-75-22 143h-46Z" fill="#B5BCC5"/><path d="M265 282l-14 30 14 83 14-83Z" fill="#4B5563"/></svg>;

export const Ceo=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const person=cast[4];
 const proud=frame>1.2*fps;
 const assets=getStaticFiles();const pose=proud?'proud':'base';
 const asset=assets.find(a=>a.name===`characters/ceo_${pose}.png`)??assets.find(a=>a.name==='characters/ceo_base.png');
 return <AbsoluteFill className="scene cast-scene" style={{backgroundImage:`repeating-linear-gradient(135deg,transparent,transparent 100px,${person.color}16 100px,${person.color}16 103px)`}}><Header/>
  <div className="portrait" style={{translate:`0px ${(1-spring({frame:frame-.25*fps,fps,config:{damping:17}}))*820}px`,scale:proud?1+Math.sin(Math.min((frame-1.2*fps)/fps,0.3)*Math.PI/.3)*.035:1}}>
   {asset?<Img src={staticFile(asset.name)} style={{height:790,width:530,objectFit:'contain'}}/>:<Silhouette/>}
  </div>
  <div className="cast-content"><h1>{person.role}</h1><div className="actor">{person.actor}</div>
   <div className="cast-line" style={{opacity:interpolate(frame,[.35*fps,.65*fps],[0,1],clamp)}}>{person.line}</div>
   <div className="stats">{person.stats.map(([label,value,level],i)=><div key={String(label)} style={{opacity:interpolate(frame,[(.45+i*.3+(i===2?.3:0))*fps,(.75+i*.3+(i===2?.3:0))*fps],[0,1],clamp)}}><div className="stat-label"><span>{label}</span><b style={{color:i===2?'#FFC53D':'#F8FAFC'}}>{value}</b></div><div className="stat-track"><div style={{background:i===2?'#FFC53D':person.color,width:`${Number(level)*100*interpolate(frame,[(.45+i*.3)*fps,(1+i*.3)*fps],[0,1],clamp)}%`}}/></div></div>)}</div>
   <div className="cast-tag">{person.tag}</div>
  </div>
 </AbsoluteFill>;
};

const Demo=()=>{const {fps}=useVideoConfig();return <><Sequence durationInFrames={11*fps} premountFor={fps}><Pangyo/></Sequence><Sequence from={11*fps} durationInFrames={3*fps} premountFor={fps}><Ceo/></Sequence></>};
export const RemotionRoot:React.FC=()=> <>
 <Composition id="M1-Pangyo" component={Pangyo} width={brand.width} height={brand.height} fps={brand.fps} durationInFrames={11*brand.fps}/>
 <Composition id="I6-CEO" component={Ceo} width={brand.width} height={brand.height} fps={brand.fps} durationInFrames={3*brand.fps}/>
 <Composition id="Demo" component={Demo} width={brand.width} height={brand.height} fps={brand.fps} durationInFrames={14*brand.fps}/>
</>;
