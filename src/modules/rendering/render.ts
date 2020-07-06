/* RENDER METHOD */

/**********************************************************************************************************************/
import TimeLine from "../../timeLine";

export default (timeline: TimeLine, __retSetUp: {
    renderer: THREE.WebGLRenderer;camera: THREE.PerspectiveCamera;scene: THREE.Scene;
}, __retParticleBackground ? : {
    particleScene: any;particleCamera: any;AMOUNTY: number;AMOUNTX: number;particles: any;particleCount: number
}) => {

    if (timeline.finishedLoading) {
        if (__retParticleBackground) {

            //particle Background
            let i = 0,
                j = 0;
            for (let ix = 0; ix < __retParticleBackground.AMOUNTX; ix++) {
                for (let iy = 0; iy < __retParticleBackground.AMOUNTY; iy++) {
                    __retParticleBackground.particles.geometry.attributes.position.array[i + 1] = (Math.sin((ix + __retParticleBackground.particleCount) * 0.3) * 50) +
                        (Math.sin((iy + __retParticleBackground.particleCount) * 0.5) * 50);
                    __retParticleBackground.particles.geometry.attributes.scale.array[j] = (Math.sin((ix + __retParticleBackground.particleCount) * 0.3) + 1) * 8 +
                        (Math.sin((iy + __retParticleBackground.particleCount) * 0.5) + 1) * 8;
                    i += 3;
                    j++;
                }
            }
            __retParticleBackground.particles.geometry.attributes.position.needsUpdate = true;
            __retParticleBackground.particles.geometry.attributes.scale.needsUpdate = true;
            __retParticleBackground.particleCount += 0.1;

            // render both scenes in a way that the timeline is on top
            __retSetUp.renderer.autoClear = false;
            __retSetUp.renderer.clear();
            __retSetUp.renderer.render(__retParticleBackground.particleScene, __retParticleBackground.particleCamera);
            __retSetUp.renderer.clearDepth();
        }

        __retSetUp.renderer.render(__retSetUp.scene, __retSetUp.camera);

    }
}

/**********************************************************************************************************************/
/* END OF RENDER METHOD */