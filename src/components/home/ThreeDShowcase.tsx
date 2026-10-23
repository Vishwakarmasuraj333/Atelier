'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Sparkles, Compass, Eye, ShieldCheck, ArrowRight } from 'lucide-react';

export function ThreeDShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<'watch' | 'perfume' | 'jewel'>('watch');
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 4.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe8cfa8, 3.5); // Champagne key light
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb83b5e, 2.0); // Rose fill light
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const topLight = new THREE.PointLight(0xffffff, 2.0, 10);
    topLight.position.set(0, 4, 0);
    scene.add(topLight);

    // Group for objects
    const productGroup = new THREE.Group();
    scene.add(productGroup);

    // Materials
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E8CFA8'),
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    });

    const burgundyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#641C32'),
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 0.8,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      metalness: 0.0,
      roughness: 0.05,
      transmission: 0.95,
      ior: 1.52,
      transparent: true,
      opacity: 0.9,
    });

    const dialMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#17151A'),
      metalness: 0.8,
      roughness: 0.2,
    });

    // Create 3D Meshes based on activeModel
    function buildMesh(type: 'watch' | 'perfume' | 'jewel') {
      while (productGroup.children.length > 0) {
        productGroup.remove(productGroup.children[0]);
      }

      if (type === 'watch') {
        // Watch Case (Cylinder)
        const caseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 48);
        const caseMesh = new THREE.Mesh(caseGeo, goldMaterial);
        caseMesh.rotation.x = Math.PI / 6;
        productGroup.add(caseMesh);

        // Dial (Inner Cylinder)
        const dialGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.32, 48);
        const dialMesh = new THREE.Mesh(dialGeo, dialMaterial);
        dialMesh.rotation.x = Math.PI / 6;
        productGroup.add(dialMesh);

        // Crystal Glass
        const crystalGeo = new THREE.CylinderGeometry(1.08, 1.08, 0.35, 48);
        const crystalMesh = new THREE.Mesh(crystalGeo, glassMaterial);
        crystalMesh.rotation.x = Math.PI / 6;
        productGroup.add(crystalMesh);

        // Crown
        const crownGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16);
        const crownMesh = new THREE.Mesh(crownGeo, goldMaterial);
        crownMesh.position.set(1.25, 0.1, 0);
        crownMesh.rotation.z = Math.PI / 2;
        productGroup.add(crownMesh);

        // Leather Straps
        const strapGeo = new THREE.BoxGeometry(0.85, 2.4, 0.1);
        const strapMesh = new THREE.Mesh(strapGeo, burgundyMaterial);
        strapMesh.position.set(0, 0, -0.1);
        productGroup.add(strapMesh);
      } else if (type === 'perfume') {
        // Perfume Crystal Flacon
        const bottleGeo = new THREE.BoxGeometry(1.3, 1.8, 0.8);
        const bottleMesh = new THREE.Mesh(bottleGeo, glassMaterial);
        productGroup.add(bottleMesh);

        // Liquid Core
        const coreGeo = new THREE.BoxGeometry(1.1, 1.5, 0.6);
        const coreMesh = new THREE.Mesh(coreGeo, burgundyMaterial);
        productGroup.add(coreMesh);

        // Gold Atomizer Neck & Cap
        const capGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.7, 32);
        const capMesh = new THREE.Mesh(capGeo, goldMaterial);
        capMesh.position.set(0, 1.2, 0);
        productGroup.add(capMesh);
      } else {
        // Haute Jewel (Octahedron Diamond)
        const gemGeo = new THREE.OctahedronGeometry(1.4, 1);
        const gemMesh = new THREE.Mesh(gemGeo, glassMaterial);
        productGroup.add(gemMesh);

        // Gold Ring Base
        const ringGeo = new THREE.TorusGeometry(1.2, 0.15, 24, 48);
        const ringMesh = new THREE.Mesh(ringGeo, goldMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.set(0, -0.4, 0);
        productGroup.add(ringMesh);
      }
    }

    buildMesh(activeModel);

    // Floating Particles
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 6;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xe8cfa8,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Interaction & Animation
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let prevMouseX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        productGroup.rotation.y += deltaX * 0.01;
        prevMouseX = e.clientX;
      }
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = containerRef.current;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        productGroup.rotation.y += 0.007;
      }

      // Gentle floating physics
      productGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.1;
      productGroup.rotation.x = mouseY * 0.2;

      particleSystem.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [activeModel, isRotating]);

  return (
    <section className="py-20 bg-[#17151A] text-[#FFF9F3] relative overflow-hidden border-y border-[#E8CFA8]/30">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#641C32]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E8CFA8]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#641C32]/50 border border-[#E8CFA8]/40 text-[#E8CFA8] text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive 3D Horology & Flacon</span>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl font-normal leading-tight">
              SCULPTED IN <span className="gold-gradient-text italic font-serif">18K ROSE GOLD</span> & CRYSTAL
            </h2>

            <p className="text-sm text-[#FFF9F3]/70 leading-relaxed">
              Experience the pinnacle of Swiss horology and French perfumery. Rotate, inspect every hand-burnished bezel, exhibition caseback, and precision facet in true real-time 3D rendering.
            </p>

            {/* Model Selectors */}
            <div className="flex gap-2 pt-2">
              {[
                { id: 'watch', label: 'Chronographe Imperial' },
                { id: 'perfume', label: 'Nuit Velours Flacon' },
                { id: 'jewel', label: 'Aura Solitaire' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveModel(m.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider transition-all ${
                    activeModel === m.id
                      ? 'bg-[#E8CFA8] text-[#17151A] font-bold shadow-lg shadow-[#E8CFA8]/20'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Feature Points */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#E8CFA8]" />
                <span>Drag to Rotate 360°</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E8CFA8]" />
                <span>Swiss Certified Calibre</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/products?category=electronics-watches"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#641C32] hover:bg-[#B83B5E] text-[#FFF9F3] text-xs font-bold uppercase tracking-widest rounded-2xl transition-all shadow-lg"
              >
                Inspect Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right 3D Canvas Showcase */}
          <div className="lg:col-span-7 relative h-[460px] md:h-[540px] rounded-3xl bg-radial from-[#241F2B] to-[#121015] border border-[#E8CFA8]/30 shadow-2xl overflow-hidden flex items-center justify-center">
            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Interactive Badge */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs text-[#E8CFA8]">
              <Eye className="w-3.5 h-3.5 animate-pulse" />
              <span>Click & Drag to Inspect Material Finishes</span>
            </div>

            {/* Auto-rotate Toggle */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="absolute top-6 right-6 z-10 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-[11px] text-white/80 transition-colors uppercase tracking-wider"
            >
              {isRotating ? 'Pause Spin' : 'Auto Spin'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
