import TimeLine from "../timeLine";

/* INTERSECTION LOGIC */
// Raycaster intersection logic with eventPlanes
// conditional logic: if we do not move over obejct, and the resetEventPlaneColor is false we do nothing
// we hit a plane. at beginning object is empty. so we change color and set objet and set recetEventPlaneColor in case we move out of plane again it will reset it
// we move on plane, it is the same object, so it does nothing
// we move to adjustent plane, we reset old plane and set new plane
// we move out of plane again, we reset, and set flag resetEventPlaneColor to false.
/**********************************************************************************************************************/
export default (timeline: TimeLine, raycaster: THREE.Raycaster, resetEventPlaneColor: boolean, eventPlaneColorChanged: THREE.Mesh, copyr: number, copyg: number, copyb: number) => {
    // variables
    let setColors: boolean = false;
    let _copyb = copyb;
    let _copyr = copyr;
    let _copyg = copyg;
    // @ts-ignore
    const intersects: Intersection[] = raycaster.intersectObjects(timeline.eventPlanes);

    // functions
    const tempStoreColor = () => {
        // copy values not reference
        // @ts-ignore the object is a Mesh, then it is a BasicMeshMaterial so all properties are correct
        _copyb = intersects[0].object.material.color.b.valueOf();
        // @ts-ignore the object is a Mesh, then it is a BasicMeshMaterial so all properties are correct
        _copyg = intersects[0].object.material.color.g.valueOf();
        // @ts-ignore the object is a Mesh, then it is a BasicMeshMaterial so all properties are correct
        _copyr = intersects[0].object.material.color.r.valueOf();
    }

    const changePreviousPlaneColorBack = () => {
        // @ts-ignore the object is a Mesh, then it is a BasicMeshMaterial so all properties are correct
        eventPlaneColorChanged.material.color.r = _copyr; // if we move from plane to no plane to change previous plane color back
        // @ts-ignore the object is a Mesh, then it is a BasicMeshMaterial so all properties are correct
        eventPlaneColorChanged.material.color.g = _copyg;
        // @ts-ignore the object is a Mesh, then it is a BasicMeshMaterial so all properties are correct
        eventPlaneColorChanged.material.color.b = _copyb;
    }

    const changeColorOfPlane = () => {
        intersects[0].object.material.color.set(timeline.eventPlaneMoveOverColor); // change color to visualize/indicate interactivity
        resetEventPlaneColor = true; // i set this variable to only reset the color if it has changed, not the whole time
        eventPlaneColorChanged = <THREE.Mesh>intersects[0].object; // load new moved over plane into variable for the comparison
    }

    // logic
    if (intersects.length > 0) {
        if (resetEventPlaneColor) { // is false if not loaded in yet
            if (eventPlaneColorChanged === intersects[0].object) { // if we move on same plane do nothing
            } else { // we changed plane from plane
                changePreviousPlaneColorBack();
                tempStoreColor();
                changeColorOfPlane();
            }
        } else { // if we move mouse on object first time
            tempStoreColor();
            changeColorOfPlane();
            setColors = true;
        }
    } else { // we left object
        if (resetEventPlaneColor) {
            changePreviousPlaneColorBack();
            resetEventPlaneColor = false;
        }
    }


    return {
        copyb: _copyb,
        copyg: _copyg,
        copyr: _copyr,
        resetEventPlaneColor: resetEventPlaneColor,
        eventPlaneColorChanged: eventPlaneColorChanged,
        setColors: setColors,
    };

}

/**********************************************************************************************************************/
/* END OF INTERSECTION LOGIC */