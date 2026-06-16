/* eslint-disable react/no-unknown-property */
"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";


import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

// replace with your own imports, see the usage snippet for details
const cardGLB = "/assets/lanyard/card.glb";
const lanyard = "/assets/lanyard/lanyard.png";

extend({ MeshLineGeometry, MeshLineMaterial });

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
}: LanyardProps) {
  return (
    <div className="relative z-0 w-full h-full flex justify-center items-center transform scale-100 origin-center" style={{ background: "#0a0a0f" }}>

      {/* ── Layer 0: Starfield dot grid ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.6,
        }}
      />

      {/* ── Layer 1: Aurora gradient orbs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top-left violet orb */}
        <div
          className="absolute rounded-full"
          style={{
            width: "340px",
            height: "340px",
            top: "-60px",
            left: "-80px",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.55) 0%, transparent 70%)",
            filter: "blur(48px)",
            animation: "orbFloat1 9s ease-in-out infinite alternate",
          }}
        />
        {/* Bottom-right indigo orb */}
        <div
          className="absolute rounded-full"
          style={{
            width: "300px",
            height: "300px",
            bottom: "-40px",
            right: "-60px",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)",
            filter: "blur(52px)",
            animation: "orbFloat2 11s ease-in-out infinite alternate",
          }}
        />
        {/* Center-top teal accent orb */}
        <div
          className="absolute rounded-full"
          style={{
            width: "200px",
            height: "200px",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(circle, rgba(45,212,191,0.35) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "orbFloat3 13s ease-in-out infinite alternate",
          }}
        />
        {/* Bottom-left pink micro orb */}
        <div
          className="absolute rounded-full"
          style={{
            width: "180px",
            height: "180px",
            bottom: "20%",
            left: "5%",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)",
            filter: "blur(36px)",
            animation: "orbFloat4 8s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* ── Layer 2: Concentric pulse rings ── */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: `${i * 130}px`,
              height: `${i * 130}px`,
              borderColor: `rgba(124,58,237,${0.15 - i * 0.03})`,
              animation: `pulseRing ${3 + i}s ease-in-out ${i * 0.7}s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* ── Keyframe styles injected ── */}
      <style>{`
        @keyframes orbFloat1 {
          0%   { transform: translate(0px,  0px)  scale(1);   }
          100% { transform: translate(30px, 40px) scale(1.12); }
        }
        @keyframes orbFloat2 {
          0%   { transform: translate(0px,  0px)  scale(1);    }
          100% { transform: translate(-35px, -30px) scale(1.1); }
        }
        @keyframes orbFloat3 {
          0%   { transform: translateX(-50%) translateY(0px)  scale(1);   }
          100% { transform: translateX(-50%) translateY(25px) scale(1.08); }
        }
        @keyframes orbFloat4 {
          0%   { transform: translate(0px,  0px)  scale(1);   }
          100% { transform: translate(20px, -25px) scale(1.1); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(0.85); opacity: 0;    }
          40%  { opacity: 1; }
          100% { transform: scale(1.6);  opacity: 0;    }
        }
      `}</style>

      {/* ── Layer 3: Vignette overlay ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,10,15,0.75) 100%)",
        }}
      />

      {/* ── Layer 4: Three.js Canvas (lanyard) ── */}
      <Canvas
        className="absolute inset-0 z-[2]"
        camera={{ position, fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), 0)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 60}>
          <Suspense fallback={null}>
            <Band />
          </Suspense>
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
}

function Band({ maxSpeed = 50, minSpeed = 0 }: BandProps) {
  // Using "any" for refs since the exact types depend on Rapier's internals
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: any = {
    type: "dynamic" as RigidBodyProps["type"],
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyard);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  const [isSmall, setIsSmall] = useState<boolean>(false);

  useEffect(() => {
    // Set initial value
    setIsSmall(window.innerWidth < 1024);

    // Add resize listener
    const handleResize = (): void => {
      setIsSmall(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody
          ref={fixed}
          {...segmentProps}
          type={"fixed" as RigidBodyProps["type"]}
        />
        <RigidBody
          position={[0.5, 0, 0]}
          ref={j1}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1, 0, 0]}
          ref={j2}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, 0, 0]}
          ref={j3}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={
            dragged
              ? ("kinematicPosition" as RigidBodyProps["type"])
              : ("dynamic" as RigidBodyProps["type"])
          }
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isSmall ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
