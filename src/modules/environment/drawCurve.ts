import * as THREE from 'three';
import eventPlane from '../../classes/eventPlane';

/* DRAW CURVES */
// shows connectivity of Events by connecting them with curved lines. This can be used for example then an Event is clicked to show connected events
// or if there is a topic selection to show all Events belonging to this topic. Depends on the data and on the usecase.
/**********************************************************************************************************************/

export default (sphere1: any, sphere2: any, relatedObject: eventPlane, scene: any, title: string) => {

    let yPosition = 10; // how high the curve will go. mid1 and mid2 are the intermediate points, functioning like the middle points in the CubicBezierCurve3

    // sphere1 positions
    let sphere1PositionX = sphere1.position.x;
    let sphere1PositionY = sphere1.position.y;
    let sphere1PositionZ = sphere1.position.z;

    // sphere2 positions
    let sphere2PositionX = sphere2.position.x;
    let sphere2PositionY = sphere2.position.y;
    let sphere2PositionZ = sphere2.position.z;

    // mid1 positions
    let mid1PositionX = sphere1PositionX - (sphere1PositionX - sphere2PositionX) / 3;
    let mid1PositionY = yPosition;
    let mid1PositionZ = sphere1PositionZ - (sphere1PositionZ - sphere2PositionZ) / 3;

    //mid2 positions
    let mid2PositionX = mid1PositionX - (sphere1PositionX - sphere2PositionX) / 3;
    let mid2PositionY = yPosition;
    let mid2PositionZ = mid1PositionZ - (sphere1PositionZ - sphere2PositionZ) / 3;

    let curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sphere1PositionX, sphere1PositionY, sphere1PositionZ),
        new THREE.Vector3(mid1PositionX, mid1PositionY, mid1PositionZ),
        new THREE.Vector3(mid2PositionX, mid2PositionY, mid2PositionZ),
        new THREE.Vector3(sphere2PositionX, sphere2PositionY, sphere2PositionZ)
    ]);
    let points = curve.getPoints(500);
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let material = new THREE.LineBasicMaterial({
        color: 0xff0000
    });

    console.log("get middle point");
    console.log(curve.getPointAt(0.5));
    console.log(title);
    // Create the final object to add to the scene
    let curveObject = new THREE.Line(geometry, material);
    relatedObject._relatedCurves.push(curveObject); //we add it to the object so we can set lines invisible when dismissed in scene
    scene.add(curveObject); // TODO add to group, add group to scene, when removing a line remove it from the group, or add it to the group. For example when clicking event we can clean/empty the whole Group and add all curves to the Group. Or have all lines in the Group and simply change the visible status
}

/**********************************************************************************************************************/
/* END OF DRAW CURVES */