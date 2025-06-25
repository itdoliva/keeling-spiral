import { useMemo, useEffect } from 'react';
import * as THREE from 'three'
import { rgbeLoader } from '@/lib/loaders';
import ATMSampleSphere from './ATMSampleSphere';

interface Node {
  idx: number;
  position: THREE.Vector3;
  randomness: number;
  visibility: number; // 0 for disappearing, 1 for appearing
  lifetimeStart: number; // uTime when animation begins for this point
}


export function useATMSample({ ppmExtent, ppmCurrent }: {
  ppmExtent: [ number, number ];
  ppmCurrent: number;
}) {

  const sphere = useMemo(() => {
    return new ATMSampleSphere(ppmExtent, ppmCurrent)
  }, [])

  useEffect(() => {
    rgbeLoader.load('/environment-maps/envmap.hdr', (envMap) => {
      envMap.mapping = THREE.EquirectangularReflectionMapping
      envMap.colorSpace = THREE.SRGBColorSpace
      sphere.bubble.material.envMap = envMap
    })
  }, [])

  useEffect(() => {
    sphere.ppmExtent = ppmExtent
  }, ppmExtent)

  useEffect(() => {
    sphere.ppmCurrent = ppmCurrent
  }, [ ppmCurrent ])

  return sphere
}