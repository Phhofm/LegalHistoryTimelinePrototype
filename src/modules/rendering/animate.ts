import update from '../environment/updateBlobs';
import render from './render';

/* ANIMATE LOOP */
// loop that causes renderer to draw scene every time screen is refreshed (around 60 times per second). Pauses when user navigates to another browser tab, hence not wasting processing power and battery life.
/**********************************************************************************************************************/

//@ts-ignore
export function animate(timeline: TimeLine, __retSetUp: {
    renderer: THREE.WebGLRenderer;camera: THREE.PerspectiveCamera;scene: THREE.Scene;
}, controls: any, __retParticleBackground ? : {
    particleScene: any;particleCamera: any;AMOUNTY: number;AMOUNTX: number;particles: any;particleCount: number
}) {


    if (timeline.twitching && !timeline.twitchingOnlyActiveObject) { //this option depents on geometries but very non-performant if many operations needed
        //counter with modulo because otherwise it is way too hectic and non-performant
        if (timeline.blobUpdateCounter % 10 == 0) {
            if (timeline.eventPlanes) {
                if (timeline.objectActive) {
                    update(timeline.activeObject, timeline)
                } else {
                    for (let i: number = 0; i < timeline.eventPlanes.length; i++) {
                        if (timeline.eventPlanes[i] && timeline.eventPlanes[i].visible) {
                            update(timeline.eventPlanes[i], timeline);
                        }
                    }
                }
            }
        }
        timeline.blobUpdateCounter += 1;
    } else if (timeline.twitchingOnlyActiveObject) {
        if (timeline.blobUpdateCounter % 6 == 0) {
            if (timeline.objectActive) {
                update(timeline.activeObject, timeline);
            }
        }
        timeline.blobUpdateCounter += 1;
    }

    if (__retParticleBackground) {
        timeline.animationFrame = requestAnimationFrame(() => animate(timeline, __retSetUp, controls, __retParticleBackground));

        controls.update();

        render(timeline, __retSetUp, __retParticleBackground);
    } else {
        requestAnimationFrame(() => animate(timeline, __retSetUp, controls));

        controls.update();

        render(timeline, __retSetUp);
    }
}

/**********************************************************************************************************************/
/* END OF ANIMATE LOOP */