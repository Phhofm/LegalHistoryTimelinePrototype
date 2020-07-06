import eventPlane from '../classes/eventPlane';
import onChangeEpoch from './onChangeEpoch';
import drawCurve from '../modules/environment/drawCurve';
import TimeLine from "../timeLine";
import toRGBAColor from '../modules/helper/toRGBAColor';

/* ON CLICK LOGIC METHOD */
// Calls the method provided by the user when event is clicked and also shows a shadow that visualizes the duration of the event on the timeline if applicable
// Behaviors: It will just enlarge the active object. If alternativeOnClickBehavior is chosen, it will make all others smaller at the same time and colorchanged, and when dismissed normalize/reset everything (size and color).
// If alternativeOnClickBehavior and wireframe and twitchingActive is chosen (the combination), it will enlarge active, make all others smaller and colorchanged, at the end normalize except already clicked elements will stay same size as to indicate which nodes were visited by user already
/**********************************************************************************************************************/

// @ts-ignore
export default (timeline: TimeLine, scene: THREE.Scene, raycaster: THREE.Raycaster, timelineLineWidth: number, dateLineSpaceUnit: number, eventPlaneObjects: eventPlane[], currentChapterEpoch: string) => {

    // variables
    let correspondingEventObject: eventPlane;
    let correspondingSphere: THREE.Mesh;
    const intersects: THREE.Intersection[] = raycaster.intersectObjects(timeline.eventPlanes); // check for intersection

    // functions
    // @ts-ignore
    const normalizeSize = (object: any) => {
        object.scale.x = 1;
        object.scale.y = 1;
        object.scale.z = 1;
    }

    const setInactiveSize = (object: any) => {
        object.scale.x = timeline.inactiveSize;
        object.scale.y = timeline.inactiveSize;
        object.scale.z = timeline.inactiveSize;
    }

    const setActiveEvent = () => {

        // function
        const findCorrespondingEventObjectById = (id: number) => {
            for (let i = 0; i < eventPlaneObjects.length; i++) {
                if (eventPlaneObjects[i]._id === id) {
                    return eventPlaneObjects[i];
                }
            }
            return new eventPlane(0, 'empty', 0, 0, 'empty', 'empty', 'empty', 'empty', [], 0, 0, 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', []);
        }

        // transform -  we make it bigger
        correspondingSphere.scale.x = timeline.clickedSize;
        correspondingSphere.scale.z = timeline.clickedSize;
        correspondingSphere.scale.y = timeline.clickedSize;

        // reset Size
        if (timeline.activeObject && timeline.alternativeOnClickBehavior) {
            setInactiveSize(timeline.activeObject);
        }

        if (timeline.alternativeOnClickBehavior) {
            for (let i = 0; i < timeline.eventPlanes.length; i++) {
                if (correspondingSphere.uuid !== timeline.eventPlanes[i].uuid) {
                    // set all other dots background alike, let them vanish.
                    //@ts-ignore
                    timeline.eventPlanes[i].material.color.b = 1;
                    //@ts-ignore
                    timeline.eventPlanes[i].material.color.g = 1;
                    //@ts-ignore
                    timeline.eventPlanes[i].material.color.r = 0;

                    // if the combination is chosen of alternativeOnClickBehavior and activeTwitching and wireframe, we do actually not reset the size of already clicked, for the user to visually see already visited nodes
                    if (timeline.twitchingOnlyActiveObject && timeline.eventWireFrame) {
                        if (!(timeline.eventPlanes[i].scale.x === timeline.clickedSize && timeline.clickedSize !== 1)) {
                            setInactiveSize(timeline.eventPlanes[i]);
                        }
                    } else { // if not controller combination, we reset size of active element too
                        setInactiveSize(timeline.eventPlanes[i]);
                    }
                }
            }
        }

        correspondingSphere.userData.Clicked = true; // set flag on new clicked sphere
        timeline.objectActive = true; // set global variable
        timeline.activeObject = correspondingSphere; // store current clicked sphere
        //let firstParagraph = correspondingEventObject.html.substring(correspondingEventObject.html.indexOf('<p'), correspondingEventObject.html.indexOf('</p>')); // extract title for infoText
        //let contentOfFirstParagraph = firstParagraph.substring(firstParagraph.indexOf('>') + 1, firstParagraph.length); // extract content for infoText (summary)
        let contentOfFirstParagraph = correspondingEventObject.description;
        const infoTextelement = document.getElementById('infoText');
        if (contentOfFirstParagraph == "none") {
            contentOfFirstParagraph = "";
        }
        if (infoTextelement) { // not null (or undefined/NaN/''/0/false) check
            infoTextelement.innerHTML = correspondingEventObject.title + "<br>" + contentOfFirstParagraph +
                "<br><button type=\"button\" class=\"btn info\" id=\"moreClick\" value=\"Click\">More</button>" +
                "<button type=\"button\" class=\"btn warning\" id=\"dismissClick\" value=\"Dismiss\" style=\"margin-left:2em\">Dismiss</button>";
            infoTextelement.style.color = toRGBAColor(timeline.timelineColor);
        }
        if (typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1) { // if mobile react to ontouch event
            const moreClickElement = document.getElementById("moreClick");
            if (moreClickElement) { // not null (or undefined/NaN/''/0/false) check
                moreClickElement.ontouchstart = () => {
                    alert("More information currently not available. Please define, implement and pass an onClick function parameter for the API.");
                };
            }
            const dismissClickElement = document.getElementById("moreClick");
            if (dismissClickElement) { // not null (or undefined/NaN/''/0/false) check
                dismissClickElement.ontouchstart = () => {
                    //dismiss();                                                                                                                                               // dismiss current active object
                };
            }
            if (!timeline.onClickOverwrite) { // overwrite alert if onClick function was provided thorugh parameters
                const moreClickElement = document.getElementById("moreClick");
                if (moreClickElement) { // not null (or undefined/NaN/''/0/false) check
                    moreClickElement.ontouchstart = () => {
                        timeline.onClick(correspondingEventObject);
                    };
                }
            }
        } else { // if desktop react to onclick event
            const moreClickElement = document.getElementById("moreClick");
            if (moreClickElement) { // not null (or undefined/NaN/''/0/false) check
                moreClickElement.onclick = () => {
                    alert("More information currently not available. Please define, implement and pass an onClick function parameter for the API.");
                };
            }
            const dismissClickElement = document.getElementById("dismissClick");
            if (dismissClickElement) { // not null (or undefined/NaN/''/0/false) check
                dismissClickElement.onclick = () => {
                    //dismiss();    //dismiss is automatically called by the '// click event but not on an event object' part of the logic. We do not want to call it twice
                };
            }
            if (!timeline.onClickOverwrite) { // overwrite alert if onClick function was provided thorugh parameters
                const moreClickElement = document.getElementById("moreClick");
                if (moreClickElement) { // not null (or undefined/NaN/''/0/false) check
                    moreClickElement.onclick = () => {
                        timeline.onClick(correspondingEventObject);
                    };
                }
            }
        }
        const infoTextElement = document.getElementById("infoText");
        if (infoTextElement) { // not null (or undefined/NaN/''/0/false) check
            infoTextElement.style.display = 'block'; // this is neede to display the infoText
        }


        // this was a request. Show a notification if timeperiod changed when event gets clicked and it belongs to a different timeperiod ???
        // I think visualization through colorplane is better and enough. But Ill just implement it, this can be removed if not necessary later on
        // @ts-ignore
        if (currentChapterEpoch !== correspondingEventObject.defaultChapter) {
            onChangeEpoch(correspondingEventObject);
            // @ts-ignore
            currentChapterEpoch = correspondingEventObject.defaultChapter;
        }

        // draw related events curves
        for (let i = 0; i < correspondingEventObject._related.length; i++) {
            let relatedObject: eventPlane = findCorrespondingEventObjectById(correspondingEventObject._related[i]);
            if (relatedObject.title === 'empty') {
                console.log("Did not find related eventobject to draw curve");
            } else {
                drawCurve(correspondingEventObject._correspondingMesh, relatedObject._correspondingMesh, correspondingEventObject, scene, relatedObject.title);
            }
        }

    }

    const dismiss = () => {
        if (timeline.activeObject) {
            timeline.activeObject.userData.Clicked = false;
        }

        //remove related curves
        const activeObject = timeline.activeObject;
        if (activeObject) { // not null (or undefined/NaN/''/0/false) check
            const object = eventPlaneObjects.find(object => object.uri === activeObject.name);
            if (object) { // not null (or undefined/NaN/''/0/false) check
                correspondingEventObject = object;
            }
        }

        for (let i = 0; i < correspondingEventObject._relatedCurves.length; i++) {
            scene.remove(correspondingEventObject._relatedCurves[i]); //remove curves from scene
        }
        correspondingEventObject._relatedCurves = []; //empty relatedCurves

        // reset flag on sphere
        timeline.objectActive = false; // reset global variable
        timeline.activeObject = null; // reset object
        const infoTextElement = document.getElementById("infoText");
        if (infoTextElement) { // not null (or undefined/NaN/''/0/false) check
            infoTextElement.style.display = 'none'; // dismiss infoText
        }

        if (timeline.alternativeOnClickBehavior) {
            //reset colors on eventPlanes
            for (let i = 0; i < timeline.eventPlanes.length; i++) {
                // set all other dots background alike, let them vanish.
                //@ts-ignore
                timeline.eventPlanes[i].material.color.b = timeline.eventPlanesOriginalColor[i].b;
                //@ts-ignore
                timeline.eventPlanes[i].material.color.g = timeline.eventPlanesOriginalColor[i].g;
                //@ts-ignore
                timeline.eventPlanes[i].material.color.r = timeline.eventPlanesOriginalColor[i].r;

                // if combincation had been chosen, we do reset all to normal size when dismissed except already visited nodes
                if (timeline.twitchingOnlyActiveObject && timeline.eventWireFrame) {
                    if (!(timeline.eventPlanes[i].scale.x === timeline.clickedSize && timeline.clickedSize !== 1)) {
                        normalizeSize(timeline.eventPlanes[i]);
                    }
                } else { // reset size of all eventPlanes to normal size when dismissed
                    normalizeSize(timeline.eventPlanes[i]);
                }
            }
        }
    }

    // logic
    if (intersects.length > 0) {
        // an event objects has been clicked, meaning there is an intersection (not empty)
        const object = eventPlaneObjects.find(object => object.uri === intersects[0].object.name); // find corresponding event object from intersect return
        if (object) { // not null (or undefined/NaN/''/0/false) check
            correspondingEventObject = object;
        }
        // @ts-ignore
        correspondingSphere = timeline.eventPlanes.find((object: {
            name: string;
        }) => object.name === intersects[0].object.name); // find corresponding sphere, need it for transformations / twitching / and to set the user defined clicked flag

        if (correspondingSphere.userData.Clicked) {
            //reset Size of active Object unless we chose the combination of alternativeOnClickBehavior, twitching active and wireframe
            if (timeline.twitchingOnlyActiveObject && timeline.eventWireFrame && timeline.alternativeOnClickBehavior) { } else if (timeline.activeObject && timeline.alternativeOnClickBehavior) { // if the corresponding sphere is the one that had been prevoiusly clicked (active object)
                setInactiveSize(timeline.activeObject);
            }

            // click event on the currently active Event happened
            // we dismiss it
            dismiss();
        } else if (!correspondingSphere.userData.Clicked && timeline.objectActive) {
            // click event on a currently non-active event happened while there is a currently active event
            // we dismiss old active event
            const activeObject = timeline.activeObject;
            if (activeObject) { // not null (or undefined/NaN/''/0/false) check
                activeObject.userData.Clicked = false; // reset clicked flag on previously clicked sphere

                //remove related curves from previous object/event that had been active
                let previousObject = eventPlaneObjects.find(object => object.uri === activeObject.name);

                if (previousObject) { // not null (or undefined/NaN/''/0/false) check
                    for (let i = 0; i < previousObject._relatedCurves.length; i++) {
                        scene.remove(previousObject._relatedCurves[i]); //remove curves from scene
                    }
                    previousObject._relatedCurves = []; //empty relatedCurves

                    // we set new clicked event as active
                    setActiveEvent();
                }
            }

        } else if (!correspondingSphere.userData.Clicked && !timeline.objectActive) {
            // click on an event and there is currently no active event
            // we set clicked event as active
            setActiveEvent();
        }
    } else {
        // click event but not on an event object
        if (timeline.activeObject) {
            setInactiveSize(timeline.activeObject);
            // a click event happened and there is currently an active event
            // so we dismiss it
            dismiss();
        } else {
            // a click event happened but currently no event active
        }
    }
    return {
        currentChapterEpoch
    };
}

/**********************************************************************************************************************/
/* END OF ON CLICK LOGIC METHOD */