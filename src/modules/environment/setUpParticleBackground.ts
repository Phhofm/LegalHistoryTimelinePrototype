import * as THREE from 'three';

/* SET UP PARTICLE BACKGROUND */

/**********************************************************************************************************************/
export default (backgroundColor: number, particleColor: number) => {
    const SEPARATION = 100,
        AMOUNTX = 150,
        AMOUNTY = 150;
    let particleContainer;
    let particleCamera, particleScene;
    let particles, particleCount = 0;

    particleContainer = document.createElement('div');
    document.body.appendChild(particleContainer);
    particleCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 8000);
    particleCamera.position.z = 800;
    particleCamera.position.y = 600;
    particleCamera.position.x = 700;
    particleCamera.lookAt(0, 200, 0);
    particleScene = new THREE.Scene();
    // background from parameter
    particleScene.background = new THREE.Color(backgroundColor);
    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);
    let i = 0,
        j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
            positions[i + 1] = 0; // y
            positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z
            scales[j] = 1;
            i += 3;
            j++;
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('scale', new THREE.BufferAttribute(scales, 1));
    // @ts-ignore
    const material: THREE.ShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color: {
                value: new THREE.Color(particleColor)
            },
        },
        // @ts-ignore
        vertexShader: document.getElementById('vertexshader').textContent,
        // @ts-ignore
        fragmentShader: document.getElementById('fragmentshader').textContent
    });
    particles = new THREE.Points(geometry, material);
    particles.name = "particles";
    particleScene.add(particles);

    return {
        particles,
        AMOUNTX,
        AMOUNTY,
        particleCount,
        particleScene,
        particleCamera
    };
}

/**********************************************************************************************************************/
/* END OF SET UP PARTICLE BACKGROUND */