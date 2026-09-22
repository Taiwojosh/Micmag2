---
name: 3d-room-configurator
description: Expert guidance and automated patterns for building photorealistic 3D interior room configurators, architectural WebGL visualizers, and PBR material customizers using React Three Fiber, Drei, and Three.js.
---

# 3D Room Configurator & Architectural Photorealism Skill

This skill provides comprehensive instructions, patterns, and asset workflows for building photorealistic 3D room virtualizers, architectural visualizers, and paint/material configurators in React Three Fiber (R3F).

---

## 1. Core Architecture Stack

- **Rendering Engine**: Three.js + `@react-three/fiber` (R3F)
- **Helpers & Controls**: `@react-three/drei` (`OrbitControls`, `Environment`, `ContactShadows`, `useGLTF`, `useTexture`)
- **Model-to-JSX Transpiler**: `gltfjsx` (`npx gltfjsx model.glb --transform --types`)
- **Post-Processing**: `@react-three/postprocessing` (`Bloom`, `ToneMapping`, `N8AO` / Screen Space Ambient Occlusion)
- **Color & State Management**: Reactive props or state stores (Valtio / Zustand / React State)

---

## 2. Key Techniques for Photorealism ("Like a Real Photo")

### A. Image-Based Lighting (IBL) with HDRIs
Never rely on flat ambient lights alone. Use 360° HDR environment maps for natural indirect illumination and realistic reflections:
```tsx
import { Environment } from '@react-three/drei';

<Environment preset="apartment" background blur={0.8} />
// Or custom high-res HDR:
<Environment files="/hdr/modern_living_room_1k.hdr" />
```

### B. Physically Based Rendering (PBR) Materials
Use `meshPhysicalMaterial` for architectural finishes:
- **Matte Wall Paint**: `roughness={0.85}`, `metalness={0.0}`, `clearcoat={0}`
- **Silk / Satin Paint**: `roughness={0.35}`, `metalness={0.0}`, `clearcoat={0.2}`, `clearcoatRoughness={0.4}`
- **High Gloss Paint**: `roughness={0.10}`, `metalness={0.0}`, `clearcoat={1.0}`, `clearcoatRoughness={0.1}`
- **Polished Marble / Glass**: `roughness={0.05}`, `transmission={0.9}`, `ior={1.5}`, `thickness={0.5}`

### C. Realistic Contact Shadows & Soft Shadows
Ground all furniture and structural boundaries to eliminate floating:
```tsx
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';

<AccumulativeShadows
  temporal
  frames={100}
  color="#000000"
  colorBlend={2}
  alphaTest={0.85}
  opacity={0.9}
  scale={12}
  position={[0, -0.01, 0]}
>
  <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={1} position={[5, 8, -10]} bias={0.001} />
</AccumulativeShadows>
```

### D. Cinematic Camera & Tone Mapping
Simulate physical camera sensors:
```tsx
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';

<EffectComposer disableNormalPass>
  <Bloom luminanceThreshold={1.0} mipmapBlur intensity={0.5} />
  <ToneMapping mode={ToneMapping.ACESFilmic} />
</EffectComposer>
```

---

## 3. High-Quality Free 3D Asset Sources

When sourcing photorealistic `.glb` / `.gltf` interior room assets:

1. **[Poly Haven](https://polyhaven.com/models)**: 100% CC0 (Public Domain), high-res PBR models with textures.
2. **[Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)**: Official standards-compliant PBR architectural models.
3. **[Sketchfab (CC0 / CC-BY Filter)](https://sketchfab.com/feed)**: Search for "modern interior glb" or "luxury room".
4. **[ambientCG](https://ambientcg.com/)**: CC0 architectural materials, wood floors, and wall textures.

---

## 4. Converting GLB to Interactive React Component

1. Place the model in `public/models/room.glb`.
2. Run in shell:
   ```bash
   npx gltfjsx public/models/room.glb --transform --types
   ```
3. Inspect and assign dynamic color overrides:
   ```tsx
   export function Model({ wallColor, finishRoughness }: Props) {
     const { nodes, materials } = useGLTF('/models/room-transformed.glb');
     return (
       <group dispose={null}>
         <mesh 
           geometry={nodes.MainWall.geometry} 
           material={materials.WallPaint} 
           material-color={wallColor}
           material-roughness={finishRoughness}
         />
       </group>
     );
   }
   ```
