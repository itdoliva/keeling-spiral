import { useMemo, useEffect } from 'react';
import * as THREE from 'three'
import { rgbeLoader } from '@/lib/loaders';
import ATMSampleSphere from './ATMSampleSphere';
import { useAssets } from '@/ui/context/assetsContext';

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

  const assets = useAssets()

  useEffect(() => {
    if (!assets) return
    sphere.bubble.material.envMap = assets.cylinder.envMap
  }, [ assets ])

  useEffect(() => {
    sphere.ppmExtent = ppmExtent
  }, ppmExtent)

  useEffect(() => {
    sphere.ppmCurrent = ppmCurrent
  }, [ ppmCurrent ])

  return sphere
}