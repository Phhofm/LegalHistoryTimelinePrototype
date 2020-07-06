import buildWorld from '../environment/buildWorld';
import createBlob from '../environment/createBlob';
import createCookie from '../cookie/createCookie';
import toColor from '../helper/toRGBAColor';
import setUpParticleBackground from '../environment/setUpParticleBackground';
import eventPlane from '../../classes/eventPlane';
import * as THREE from 'three';
import buildBackground from '../environment/buildBackground';
import {
    animate
} from '../rendering/animate';
import TimeLine from "../../timeLine";
import drawCurve from '../environment/drawCurve';

/* SET UP CONTROLLERS */

/******************************************************************************************************************/
export default (__retFetchData: {
    timelineStartDate: number; timelineEndDate: number; eventPlaneObjects: eventPlane[]; gui: any;
}, timeline: TimeLine, __retSetUp: {
    renderer: THREE.WebGLRenderer; camera: THREE.PerspectiveCamera; scene: THREE.Scene;
}, timelineLineWidth: number, dateLineSpace: number, __retParticleBackground: {
    particleScene: any; particleCamera: any; AMOUNTY: number; AMOUNTX: number; particles: any; particleCount: number;
} | null, controls: any, dateLineSpaceUnit: number) => {

    __retFetchData.gui.remember(timeline);
    __retFetchData.gui.remember(timeline.background1);
    __retFetchData.gui.remember(timeline.background2);
    //colors
    let colorFolder = __retFetchData.gui.addFolder('Colors');
    //move over color
    let controller = colorFolder.addColor(timeline, "eventPlaneMoveOverColor")
        .name("Select Color")
        .listen();
    controller.onChange((newValue: any) => {
        timeline.eventPlaneMoveOverColor = newValue;
    });
    controller =
        colorFolder.addColor(timeline, "timelineColor")
            .name("Timeline Color")
            .listen();
    controller.onChange((newValue: any) => {
        timeline.timelineColor = newValue;
        for (let i = 0; i < __retSetUp.scene.children.length; i++) {
            if (__retSetUp.scene.children[i].name === "TimelineFrameGroup") {
                __retSetUp.scene.remove(__retSetUp.scene.children[i]);
            }
        }
        buildWorld(timeline, __retSetUp.scene, timelineLineWidth, timeline.timelineLineHeight, __retFetchData.timelineEndDate, dateLineSpace);
    });
    colorFolder.open();
    let backgroundFolder = __retFetchData.gui.addFolder('Background');
    // backgroudn controller so it stores in remembered values
    controller =
        backgroundFolder.add(timeline, "background", {
            Wave: 0,
            Stars: 1,
            Wires: 2,
            Christmas: 3
        })
            .name("BackgroundSwitcher")
            .listen();
    controller.onChange((newValue: any) => {
        timeline.background = parseInt(newValue);
        timeline.pixelWaveBackground = newValue === 0;
        // Overwrite Cookie so changes values are not lost when user changes background
        // Cookie Functions
        // if we do not show controls it overwrites values of cookie with empty
        // this is the case with the backgrounds parameters (background1 and background2 objects)
        // therefore we copy the cookie values, then replace the empty object values with the correct object and store this as a cookie
        let newCookie = {
            ...__retFetchData.gui.getSaveObject().remembered
        };
        if (Object.keys(newCookie.Demo[1]).length === 0) { // it this is empty because the controls are not displayed we overwrite it before it deletes cookie values
            newCookie.Demo[1] = timeline.background1;
        }
        if (Object.keys(newCookie.Demo[2]).length === 0) { // it this is empty because the controls are not displayed we overwrite it before it deletes cookie values
            newCookie.Demo[2] = timeline.background2;
        }
        createCookie('controllerState', newCookie, 120);
        document.location.reload(); // refresh site so app gets built again with appropriate background
    });
    // particle color
    controller =
        backgroundFolder.addColor(timeline, "particleColor")
            .name("particleColor")
            .listen();
    controller.onChange((newValue: any) => {
        const particleBackground = __retParticleBackground;
        if (particleBackground) { // not null (or undefined/NaN/''/0/false) check
            const particleScene = particleBackground.particleScene;
            timeline.particleColor = newValue;
            if (timeline.background === 0) {
                for (let i = 0; i < particleScene.children.length; i++) {
                    // @ts-ignore
                    if (particleScene.children[i].name === "particles") {
                        particleScene.remove(particleScene.children[i]);
                    }
                }
                particleScene.dispose();
                __retParticleBackground = null;
                timeline.blobUpdateCounter = 0;
                cancelAnimationFrame(timeline.animationFrame);
                __retParticleBackground = setUpParticleBackground(timeline.backgroundColor, newValue);
                animate(timeline, __retSetUp, controls, __retParticleBackground); //needed for particleWave otherwise it will not work when changing particle color of particleWave Background
                particleScene.visible = timeline.pixelWaveBackground; // in case we colorchange while pixelWaveBackground was deactivated so it does not show newly repopulated scene
            } else {
                buildBackground(timeline);
            }
        }
    });
    if (timeline.background === 0) {
        //pixelwave background
        let controller = backgroundFolder.add(timeline, "pixelWaveBackground")
            .name("PixelOcean")
            .listen();
        controller.onChange((newValue: any) => {
            timeline.pixelWaveBackground = newValue;
            const particleBackground = __retParticleBackground;
            if (particleBackground) { // not null (or undefined/NaN/''/0/false) check
                particleBackground.particleScene.visible = timeline.pixelWaveBackground;
            }
        });
        //background color
        controller =
            backgroundFolder.addColor(timeline, "backgroundColor")
                .name("BackgroundColor")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.backgroundColor = newValue;
            const particleBackground = __retParticleBackground;
            if (particleBackground) { // not null (or undefined/NaN/''/0/false) check
                particleBackground.particleScene.background = new THREE.Color(newValue);
            }
            __retSetUp.scene.fog = new THREE.FogExp2(newValue, 0.002);
        });
    } else if (timeline.background === 1) {
        controller =
            backgroundFolder.add(timeline.background1, "backgroundAmount", 100, 1000)
                .name("Amount")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background1.backgroundAmount = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background1, "backgroundDensity", 100, 500)
                .name("Density")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background1.backgroundDensity = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background1, "backgroundOpacity", 0.1, 1)
                .name("Opacity")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background1.backgroundOpacity = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background1, "backgroundOpacityRandom")
                .name("OpacityRandom")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background1.backgroundOpacityRandom = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background1, "backgroundSize", 0.1, 5)
                .name("Size")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background1.backgroundSize = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background1, "backgroundSizeRandom")
                .name("SizeRandom")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background1.backgroundSizeRandom = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background1, "backgroundMoveSpeed", 0.1, 5)
                .name("MoveSpeed")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background1.backgroundMoveSpeed = newValue;
            buildBackground(timeline);
        });

        //background color
        controller =
            backgroundFolder.addColor(timeline, "backgroundColor")
                .name("BackgroundColor")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.backgroundColor = newValue;
            (<HTMLElement>document.getElementsByClassName('particles-js-canvas-el').item(0)).style.backgroundColor = toColor(newValue);
            __retSetUp.scene.fog = new THREE.FogExp2(timeline.backgroundColor, 0.002);
        });
    } else if (timeline.background === 2) {
        controller =
            backgroundFolder.add(timeline.background2, "backgroundAmount", 10, 200)
                .name("Amount")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background2.backgroundAmount = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background2, "backgroundDensity", 300, 500)
                .name("Density")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background2.backgroundDensity = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background2, "backgroundOpacity", 0.1, 1)
                .name("Opacity")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background2.backgroundOpacity = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background2, "backgroundOpacityRandom")
                .name("OpacityRandom")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background2.backgroundOpacityRandom = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background2, "backgroundSize", 0.1, 5)
                .name("Size")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background2.backgroundSize = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background2, "backgroundSizeRandom")
                .name("SizeRandom")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background2.backgroundSizeRandom = newValue;
            buildBackground(timeline);
        });
        controller =
            backgroundFolder.add(timeline.background2, "backgroundMoveSpeed", 0.1, 5)
                .name("MoveSpeed")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.background2.backgroundMoveSpeed = newValue;
            buildBackground(timeline);
        });

        //background color
        controller =
            backgroundFolder.addColor(timeline, "backgroundColor")
                .name("BackgroundColor")
                .listen();
        controller.onChange((newValue: any) => {
            timeline.backgroundColor = newValue;
            __retSetUp.scene.background = new THREE.Color(newValue);
            __retSetUp.scene.fog = new THREE.FogExp2(timeline.backgroundColor, 0.002);
        });
    }
    backgroundFolder.open();
    let behaviorFolder = __retFetchData.gui.addFolder('Behavior');
    controller =
        behaviorFolder.add(timeline, "twitchingOnlyActiveObject")
            .name("Active Twitching")
            .listen();
    controller.onChange((newValue: any) => {
        timeline.twitching = false;
        timeline.twitchingOnlyActiveObject = newValue;
    });
    controller =
        behaviorFolder.add(timeline, "eventWireFrame")
            .name("EventWireFrame")
            .listen();
    controller.onChange((newValue: any) => {
        timeline.eventWireFrame = newValue;
        for (let i: number = 0; i < __retSetUp.scene.children.length; i++) {
            if (__retSetUp.scene.children[i].name === "PlanesGroup") {
                for (let j: number = 0; j < __retSetUp.scene.children[i].children.length; j++) {
                    //@ts-ignore
                    __retSetUp.scene.children[i].children[j].material.wireframe = newValue;
                }
            }
        }
    });
    controller =
        behaviorFolder.add(timeline, "alternativeOnClickBehavior")
            .name("AlternativeOnClickBehavior")
            .listen();
    controller.onChange((newValue: any) => {
        timeline.alternativeOnClickBehavior = newValue;
    });
    controller =
        behaviorFolder.add(timeline, "twitchingExtent", 0.1, 1)
            .name("TwitchingExtent")
            .listen();
    controller.onChange((newValue: any) => {
        timeline.twitchingExtent = newValue;
    });
    behaviorFolder.open();
    let appearanceFolder = __retFetchData.gui.addFolder('Appearance');
    controller =
        appearanceFolder.add(timeline, "clickedSize", 1, 5)
            .name("ScaleClicked")
            .listen();
    controller.onChange((newValue: any) => {
        timeline.clickedSize = newValue;
    });
    controller =
        appearanceFolder.add(timeline, "sphereRadius", 0.5, 5)
            .name("Sphere Radius")
            .listen();
    controller.onChange((newValue: any) => {
        timeline.sphereRadius = newValue;
        for (let i = 0; i < __retSetUp.scene.children.length; i++) {
            if (__retSetUp.scene.children[i].name === "PlanesGroup") {
                // dispose of geometries and materials, improve performance and avoid memory leaks
                for (let j = 0; j < __retSetUp.scene.children[i].children.length; j++) {
                    //@ts-ignore
                    __retSetUp.scene.children[i].children[j].geometry.dispose();
                    //@ts-ignore
                    __retSetUp.scene.children[i].children[j].material.dispose();
                }
                __retSetUp.scene.remove(__retSetUp.scene.children[i]);
            }
        }
        let planesGroup: THREE.Group = new THREE.Group();
        planesGroup.name = "PlanesGroup";
        timeline.eventPlanes = [];
        for (let i: number = 0; i < timeline.eventPlaneLimit; i++) {
            let eventPlane: THREE.Mesh;
            eventPlane = createBlob(timeline, __retFetchData.eventPlaneObjects[i], timelineLineWidth, dateLineSpaceUnit, timeline.eventTypes); // returns sphere
            eventPlane.name = __retFetchData.eventPlaneObjects[i].uri; // identifier. We need this to identify which object belongs to this evenplane since we can only directly call properties on the generated geometry not the object that was used to generate it
            timeline.eventPlanes.push(eventPlane);
            planesGroup.add(eventPlane);
        }
        __retSetUp.scene.add(planesGroup);
    });
    controller =
        appearanceFolder.add(timeline, "sphereWidthSegments", 3, 25, 1)
            .name("Sphere WSeg")
            .listen();
    controller.onChange((newValue: any) => {
        timeline.sphereWidthSegments = newValue;
        for (let i = 0; i < __retSetUp.scene.children.length; i++) {
            if (__retSetUp.scene.children[i].name === "PlanesGroup") {
                // dispose of geometries and materials, improve performance and avoid memory leaks
                for (let j = 0; j < __retSetUp.scene.children[i].children.length; j++) {
                    //@ts-ignore
                    __retSetUp.scene.children[i].children[j].geometry.dispose();
                    //@ts-ignore
                    __retSetUp.scene.children[i].children[j].material.dispose();
                }
                __retSetUp.scene.remove(__retSetUp.scene.children[i]);
            }
        }
        let planesGroup: THREE.Group = new THREE.Group();
        planesGroup.name = "PlanesGroup";
        timeline.eventPlanes = [];
        for (let i: number = 0; i < timeline.eventPlaneLimit; i++) {
            let eventPlane: THREE.Mesh;
            eventPlane = createBlob(timeline, __retFetchData.eventPlaneObjects[i], timelineLineWidth, dateLineSpaceUnit, timeline.eventTypes); // returns sphere
            eventPlane.name = __retFetchData.eventPlaneObjects[i].uri; // identifier. We need this to identify which object belongs to this evenplane since we can only directly call properties on the generated geometry not the object that was used to generate it
            timeline.eventPlanes.push(eventPlane);
            planesGroup.add(eventPlane);
        }
        __retSetUp.scene.add(planesGroup);
    });
    controller =
        appearanceFolder.add(timeline, "sphereHeightSegments", 1, 15, 1)
            .name("Sphere HSeg")
            .listen();
    controller.onChange((newValue: any) => {
        timeline.sphereHeightSegments = newValue;
        timeline.eventPlanes = [];
        for (let i = 0; i < __retSetUp.scene.children.length; i++) {
            if (__retSetUp.scene.children[i].name === "PlanesGroup") {
                // dispose of geometries and materials, improve performance and avoid memory leaks
                for (let j = 0; j < __retSetUp.scene.children[i].children.length; j++) {
                    //@ts-ignore
                    __retSetUp.scene.children[i].children[j].geometry.dispose();
                    //@ts-ignore
                    __retSetUp.scene.children[i].children[j].material.dispose();
                }
                __retSetUp.scene.remove(__retSetUp.scene.children[i]);
            }
        }
        let planesGroup: THREE.Group = new THREE.Group();
        planesGroup.name = "PlanesGroup";
        for (let i: number = 0; i < timeline.eventPlaneLimit; i++) {
            let eventPlane: THREE.Mesh;
            eventPlane = createBlob(timeline, __retFetchData.eventPlaneObjects[i], timelineLineWidth, dateLineSpaceUnit, timeline.eventTypes); // returns sphere
            eventPlane.name = __retFetchData.eventPlaneObjects[i].uri; // identifier. We need this to identify which object belongs to this evenplane since we can only directly call properties on the generated geometry not the object that was used to generate it
            timeline.eventPlanes.push(eventPlane);
            planesGroup.add(eventPlane);
        }
        __retSetUp.scene.add(planesGroup);
    });

    controller =
        appearanceFolder.add(timeline, "_showAllRelatedCurves")
            .name("All References")
            .listen();
    controller.onChange((newValue: any) => {
        if (newValue === true) {
            let referenceToNotExistingObject = 0;
            for (let object of __retFetchData.eventPlaneObjects) { // loop thorugh all object
                if (object._related.length > 0) { // find object that contain a reference
                    for (let reference of object._related) { // loop through references
                        const referencedObject = __retFetchData.eventPlaneObjects.find(object => object._id === reference); // find referenced Object
                        if (referencedObject === undefined) {
                            referenceToNotExistingObject++;
                        } else {
                            drawCurve(object._correspondingMesh, referencedObject._correspondingMesh, object, __retSetUp.scene, referencedObject.title); // draw curve
                        }
                    }
                }
            }
            console.log(" references to ignored objects since no date : " + referenceToNotExistingObject);
        } else { // if clicked again remove all drawn curves
            for (let object of __retFetchData.eventPlaneObjects) { // loop thorugh all object
                if (object._relatedCurves.length > 0) { // that object has curves drawn
                    for (let i = 0; i < object._relatedCurves.length; i++) {
                        __retSetUp.scene.remove(object._relatedCurves[i]); //remove curves from scene for this object
                    }
                    object._relatedCurves = []; //empty relatedCurves
                }
            }
        }
    });
    appearanceFolder.open();

}

/******************************************************************************************************************/
/* END OF SET UP CONTROLLERS */