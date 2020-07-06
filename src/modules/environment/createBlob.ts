import * as THREE from 'three';
import eventPlane from '../../classes/eventPlane';
import TimeLine from "../../timeLine";

export default (timeline: TimeLine, eventPlaneObject: eventPlane, timelineLineWidth: number, dateLineSpaceUnit: number, eventTypes: string[]) => {

    const sphere_geometry = new THREE.SphereGeometry(timeline.sphereRadius, timeline.sphereWidthSegments, timeline.sphereHeightSegments);

    // events of same type get same color.
    let color: string | number;
    if (eventTypes.includes(eventPlaneObject.type)) {
        if (timeline.eventPlaneColors.length > eventTypes.indexOf(eventPlaneObject.type)) { // gets a color from the provided color range. first check if there are enough colors provided to not make an out-of-bounds access.
            color = timeline.eventPlaneColors[eventTypes.indexOf(eventPlaneObject.type)]; // is number
        } else { // if not enough colors provided -> random color to prevent out-of-bounds
            color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6); // random color. is string.
        }
    } else { // if we cannot find the type we also give a random color
        color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6); // random color. is string.
    }
    //let material = new THREE.LineBasicMaterial({color: color});
    let material = new THREE.MeshBasicMaterial({
        color: color
    });
    material.wireframe = timeline.eventWireFrame;
    material.wireframeLinewidth = 1.2;

    let sphere = new THREE.Mesh(sphere_geometry, material);

    //  evenly distribute them, if the list is sorted after dates then a rotater should be enough
    let placementX: number = -((timeline.bars - 1) * (timelineLineWidth / 2)) + (timeline.eventPlanePlacementRotater * timelineLineWidth);
    let barsCorrector = 1;

    if (timeline.eventPlanePlacementRotater < timeline.bars - barsCorrector) {
        timeline.eventPlanePlacementRotater++;
    } else {
        timeline.eventPlanePlacementRotater = 0;
    }

    sphere.translateX(placementX); // adjust this to put it on the correct timebar

    // Y placement
    sphere.translateY(2 * timeline.scale + eventPlaneObject.yFighterLevel); // so it is on top

    // Z placement logic
    const planeEventStart = -(dateLineSpaceUnit * eventPlaneObject.startDate);
    sphere.translateZ(planeEventStart); // adjust to put it into the correct timezone

    sphere.rotateX(THREE.Math.degToRad(90)); // for planes, this was to lay them flat on the ground. For spheres, it is so they look more interesting and ligned out.

    sphere.userData = {
        Clicked: false
    };

    return sphere;

}