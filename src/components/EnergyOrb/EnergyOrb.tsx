import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./EnergyOrb.scss";

type Props = {
  size?: number;
  particleCount?: number;
};

export default function EnergyOrb({
  size = 520,
  particleCount = 12000,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;


  const vertex =  `
    varying vec2 vUv;
    varying vec3 v_color;
    varying vec3 v_normal;
    uniform float u_time;
    uniform float u_progress;
    uniform vec3 u_hoverPos;     // локальная позиция в пространстве модели
    uniform float u_hoverPower;  // сила эффекта (0..1)

    // hsv helper
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    // snoise omitted for brevity (same as before)...
    vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0 / 7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      float noise = snoise(position * u_progress + u_time / 10.0);

      // базовое смещение от шума
      vec3 newPos = position * (noise + 0.7);

      // hover-effect: вздутие вокруг u_hoverPos (в локальных координатах)
      float d = length(position - u_hoverPos);
      // gaussian-ish attenuation: сильнее ближе к центру
      float bump = u_hoverPower * exp(-d * 6.0) * (0.6 + 0.4 * sin(u_time * 6.0 + d * 12.0));
      // направляем смещение по нормали (мягкий выпуклый эффект)
      vec3 n = normalize(normal);
      newPos += n * bump;

      v_color = hsv2rgb(vec3(noise * 0.08 + 0.03 + u_hoverPower * 0.06, .78, 0.78));
      v_normal = normal; // нормали в шейдере-фрагменте для ламбертова освещения
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `;

  const fragment = `
    varying vec2 vUv;
    varying vec3 v_color;
    varying vec3 v_normal;

    void main() {
      vec3 light = vec3(0.0);
      vec3 skyColor = vec3(1.000, 1.000, 0.547);
      vec3 groundColor = vec3(0.562, 0.275, 0.111);
      vec3 lightDirection = normalize(vec3(0.0, -1.0, -1.0));
      float ld = dot(lightDirection, v_normal);
      ld = clamp(ld * 0.5 + 0.5, 0.0, 1.0);
      light = mix(skyColor, groundColor, ld);
      gl_FragColor = vec4(light * v_color, 1.0);
    }
  `;

  const particleVertex =`
    uniform float u_time;
    void main() {
      vec3 p = position;
      p.y += 0.25*(sin(p.y * 5.0 + u_time) * 0.5 + 0.5);
      p.z += 0.05*(sin(p.y * 10.0 + u_time) * 0.5 + 0.5);
      vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
      gl_PointSize = 10.0 * (1.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  const particleFragment = `
    uniform float u_progress;
    void main() {
      gl_FragColor = vec4(0.4, 0.4, 0.4, u_progress);
    }
  `;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;


    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(size, size, false);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.background = "transparent";
    renderer.domElement.style.display = "block";

    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 10000);
    camera.position.set(0, 0, 10);


    const clock = new THREE.Clock();

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: 0 },
        u_progress: { value: 0 },
        u_hoverPos: { value: new THREE.Vector3(0, 0, 10) }, 
        u_hoverPower: { value: 0 },
      },
      side: THREE.DoubleSide,
      transparent: false,
    });


    const pointsMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: {
        u_time: { value: 0 },
        u_progress: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });


    const geometry = new THREE.SphereGeometry(1, 162, 162);
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);


    const N = Math.max(0, Math.min(30000, particleCount));
    const position = new Float32Array(N * 3);
    let inc = Math.PI * (3 - Math.sqrt(5));
    let offset = 2 / N;
    let radius = 2;
    for (let i = 0; i < N; i++) {
      let y = i * offset - 1 + offset / 2;
      let r = Math.sqrt(1 - y * y);
      let phi = i * inc;
      position[3 * i] = radius * Math.cos(phi) * r;
      position[3 * i + 1] = radius * y;
      position[3 * i + 2] = radius * Math.sin(phi) * r;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
    const points = new THREE.Points(particleGeometry, pointsMaterial);
    scene.add(points);


    const canvasBlur = document.createElement("canvas");
    canvasBlur.width = canvasBlur.height = 128;
    const ctx = canvasBlur.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,0.12)");
    g.addColorStop(1, "rgba(0,0,0,0.0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(canvasBlur);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.5, 3.5),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.08 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -1.5, 0);
    scene.add(shadow);


    const root = new THREE.Group();
    root.add(sphere);
    root.add(points);
    scene.add(root);

  
    let dragging = false;
    let lastPointer = new THREE.Vector2();
    let rotationVelocity = new THREE.Vector2(0, 0);
    let lastTime = performance.now();


    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();


    function setPointerFromEvent(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointer.set(x, y);
    }


    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastPointer.set(e.clientX, e.clientY);
      renderer.domElement.setPointerCapture(e.pointerId);
      renderer.domElement.style.cursor = "grabbing";
      rotationVelocity.set(0, 0);
    };

    const onPointerMove = (e: PointerEvent) => {
      setPointerFromEvent(e);


      if (dragging) {
        const now = performance.now();
        const dt = Math.max((now - lastTime) / 1000, 1e-3);
        const dx = e.clientX - lastPointer.x;
        const dy = e.clientY - lastPointer.y;

        const sens = 0.005;
        root.rotation.y += dx * sens;
        root.rotation.x += dy * sens;

        rotationVelocity.x = (dx / dt) * 0.0008;
        rotationVelocity.y = (dy / dt) * 0.0008;
        lastPointer.set(e.clientX, e.clientY);
        lastTime = now;
      } else {
     
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObject(sphere, false);
        if (hits.length > 0) {
          const hit = hits[0];
      
          const local = sphere.worldToLocal(hit.point.clone());
       
          (material.uniforms.u_hoverPos.value as THREE.Vector3).lerp(local, 0.35);
          material.uniforms.u_hoverPower.value = Math.min(
            1,
            material.uniforms.u_hoverPower.value + 0.06
          );
        } else {
          const far = new THREE.Vector3(0, 0, 10);
          (material.uniforms.u_hoverPos.value as THREE.Vector3).lerp(far, 0.12);
          material.uniforms.u_hoverPower.value = Math.max(
            0,
            material.uniforms.u_hoverPower.value - 0.03
          );
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {}
      renderer.domElement.style.cursor = "grab";
    };

 
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    if (!prefersReduced) renderer.domElement.style.cursor = "grab";

    const handleResize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    let rafId = 0;
    const tick = () => {
      const t = clock.getElapsedTime();

      root.rotation.y += rotationVelocity.x;
      root.rotation.x += rotationVelocity.y;
    
      rotationVelocity.multiplyScalar(0.94);

      
      root.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, root.rotation.x));

      
      material.uniforms.u_time.value = t;
  
      const prog = 0.5 + 0.5 * Math.sin(t * 0.6);
      material.uniforms.u_progress.value = 0.6 + prog * 0.8;
      pointsMaterial.uniforms.u_time.value = t;
      pointsMaterial.uniforms.u_progress.value = 0.2 + 0.4 * Math.abs(Math.sin(t * 0.6));

 
      points.rotation.y = t * 0.06;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    if (!prefersReduced) tick();


    return () => {
      cancelAnimationFrame(rafId);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);

      geometry.dispose();
      particleGeometry.dispose();
      material.dispose();
      pointsMaterial.dispose();
      tex.dispose();
      renderer.dispose();
    };
  }, [size, particleCount, prefersReduced]);

  return (
    <div
      className="energyorb-wrap interactive"
      style={{ width: size, height: size }}
      ref={mountRef}
      aria-hidden={prefersReduced}
    />
  );
}
