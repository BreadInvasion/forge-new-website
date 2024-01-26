import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import prusaModel from "src/assets/Prusa.glb"
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    height: 100%;
`;


const Status = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const setGLTF = (scene: THREE.Scene, data: GLTF) => {
        console.log(data);
        scene.add(data.scene);
    };

    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current;

            // Create a scene
            const scene = new THREE.Scene();

            // Create a renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            // Create a camera
            const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 1000);
            camera.position.set(0.5,0.5,0.5);
            
            const pmremGenerator = new THREE.PMREMGenerator( renderer );
            scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;
            
            const controls = new OrbitControls( camera, renderer.domElement );
            controls.minDistance = 0.01;
            controls.maxDistance = 1;


            // Load the 3D model
            const loader = new GLTFLoader();
            loader.load(prusaModel, (gltf) => setGLTF(scene, gltf));

            // Render the scene
            const animate = () => {
                requestAnimationFrame( animate );
                renderer.render(scene, camera);
            };
            animate();

            // Clean up
            return () => {
                container.removeChild(renderer.domElement);
            };
        }
    }, []);

    return <Container ref={containerRef} />;
};

export default Status;
