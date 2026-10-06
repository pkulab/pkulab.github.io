'use client';
import {useEffect,useState} from 'react';
import {ChevronUp} from 'lucide-react';
export function BackToTop(){const[visible,setVisible]=useState(false);useEffect(()=>{const update=()=>setVisible(window.scrollY>600);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);return visible?<button className="back-to-top" aria-label="回到顶部" onClick={()=>window.scrollTo({top:0,behavior:'instant'})}><ChevronUp size={20}/></button>:null}
