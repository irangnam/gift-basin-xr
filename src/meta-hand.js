/**
 * 퀘스트 스타일 손: 손 안쪽은 비우고(깊이만 씀) 흰 외곽선만, 손목 쪽은 흐려짐.
 * Meta Immersive Web SDK(@iwsdk/xr-input, MIT) 의 AnimatedHand 를 그대로 옮김.
 * 손 모델은 원래 쓰던 WebXR generic-hand(Meta 제공) 그대로.
 *
 * 사용: new XRHandModelFactory(null, applyMetaHandStyle)
 */
import * as THREE from 'three';

export const metaHandStencil = new THREE.ShaderMaterial({
  uniforms: { outlineThickness: { value: 0.0012 } },
  vertexShader: /* glsl */`
    #include <common>
    #include <skinning_pars_vertex>
    uniform float outlineThickness;
    void main() {
      #include <skinbase_vertex>
      #include <beginnormal_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
      vec3 transformed = position - normal * outlineThickness;
      #include <skinning_vertex>
      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }`,
  fragmentShader: /* glsl */`void main() { gl_FragColor = vec4(0.0); }`,
  transparent: true, depthWrite: true, depthTest: true, alphaTest: 0.05, side: THREE.FrontSide,
});

export const metaHandOutline = new THREE.ShaderMaterial({
  uniforms: {
    outlineColor: { value: new THREE.Color(0xffffff) },
    opacityThresholds: { value: new THREE.Vector2(0.03, 0.08) },
  },
  vertexShader: /* glsl */`
    #include <common>
    #include <skinning_pars_vertex>
    attribute float wristDist;
    varying float vWristDist;
    void main() {
      #include <skinbase_vertex>
      #include <beginnormal_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
      vec3 transformed = vec3(position);
      #include <skinning_vertex>
      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      vWristDist = wristDist;
    }`,
  fragmentShader: /* glsl */`
    uniform vec3 outlineColor;
    uniform vec2 opacityThresholds;
    varying float vWristDist;
    void main() {
      gl_FragColor = vec4(outlineColor, clamp(smoothstep(opacityThresholds.x, opacityThresholds.y, vWristDist), 0.0, 1.0));
    }`,
  side: THREE.BackSide, transparent: true, depthWrite: false, depthTest: true,
});

/** XRHandModelFactory 의 onLoad 콜백 (손 모델이 불러와진 뒤 한 번) */
export function applyMetaHandStyle(model) {
  const skinned = model.getObjectByProperty('type', 'SkinnedMesh');
  if (!skinned || skinned.userData.metaHand) return;
  skinned.userData.metaHand = true;
  skinned.frustumCulled = false;
  skinned.parent.scale.multiplyScalar(1.05);
  model.updateMatrixWorld(true);
  const wrist = model.getObjectByName('wrist');
  const geo = skinned.geometry, pos = geo.attributes.position;
  const w = wrist ? skinned.worldToLocal(wrist.getWorldPosition(new THREE.Vector3())) : new THREE.Vector3();
  const d = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) d[i] = Math.hypot(pos.getX(i) - w.x, pos.getY(i) - w.y, pos.getZ(i) - w.z);
  geo.setAttribute('wristDist', new THREE.BufferAttribute(d, 1));
  skinned.material = metaHandStencil;
  const outline = skinned.clone();
  outline.material = metaHandOutline;
  outline.renderOrder = 999;
  skinned.parent.add(outline);
}
