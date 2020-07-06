import TimeLine from "../../timeLine";
import * as THREE from "three";

/* SET UP THREEJS ENVIRONMENT */

/**********************************************************************************************************************/
export default (timeline: TimeLine) => {

    /* SCENE */
    /******************************************************************************************************************/
    // create mainScene for the timeline where everything will be rendered inside
    const scene: THREE.Scene = new THREE.Scene();

    /******************************************************************************************************************/

    /* CAMERA */
    /******************************************************************************************************************/
    // camera mainScene
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(timeline.cameraFov, timeline.container.clientWidth / timeline.container.clientHeight, 0.1, 1000);
    camera.position.set(timeline.cameraPositionX, timeline.cameraPositionY, timeline.cameraPositionZ);
    scene.fog = new THREE.FogExp2(timeline.backgroundColor, 0.002);
    camera.lookAt(0, 0, 0);

    /******************************************************************************************************************/

    /* LIGHTS */
    // useful info for lights: https://discoverthreejs.com/book/1-first-steps/5-camera-controls/

    /******************************************************************************************************************/
    // Since I use only Basic Meshes, Lights are not needed. Otherwise implement Lights here.
    /******************************************************************************************************************/

    /* RENDERER */
    /******************************************************************************************************************/
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(timeline.container.clientWidth, timeline.container.clientHeight);
    timeline.container.appendChild(renderer.domElement);
    /******************************************************************************************************************/

    return {
        scene,
        camera,
        renderer
    };
}

/**********************************************************************************************************************/
/* END OF SET UP THREEJS ENVIRONMENT */