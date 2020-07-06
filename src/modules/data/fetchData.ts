import {
    GUI
} from '../../../js/dat.gui.module.js';
import * as THREE from 'three';
import '../../interfaces/APIItemType';
import buildWorld from '../environment/buildWorld';
import createBlob from '../environment/createBlob';
import eventPlane from '../../classes/eventPlane';
import TimeLine from "../../timeLine";
import processData from './processData';

/* FETCH DATA */
/**********************************************************************************************************************/
export default async (timeline: TimeLine, __retSetUp: {
    renderer: THREE.WebGLRenderer; camera: THREE.PerspectiveCamera; scene: THREE.Scene;
}, timelineLineWidth: number, dateLineSpace: number, dateLineSpaceUnit: number) => {

    console.log("Fetching data ... ");

    let timelineEndDate: number = 1600;
    let timelineStartDate: number = 0;
    let defaultChapterTitle: string = "";
    const eventPlaneObjects: eventPlane[] = [];
    let gui: any = new GUI({
        load: JSON,
        preset: 'Demo'
    });
    // the default overarching events as objects and string titles so we can create a visual indicator which timeperiod we are currently moving in
    let defaultEventObjects: eventPlane[] = [];
    //let defaultEventTitles: string[] = [];

    await fetch(timeline.url)
        .then((resp) => resp.json()) // transform the response/data into json
        .then((data) => { // process the data


            console.log("Scanning data for references ... ");
            console.log("Scanning done. References fetches from API Items.")
            let apiItemsWithReferences: any = [];
            //console.log(apiItemsWithReferences);
            console.log("Creating objects ... ")

            const __retProcessData = processData(timeline, data, defaultChapterTitle, eventPlaneObjects, apiItemsWithReferences);
            timelineEndDate = __retProcessData.timelineEndDate;
            timelineStartDate = __retProcessData.timelineStartDate;
            defaultEventObjects = __retProcessData.defaultEventObjects;
            //defaultEventTitles = __retProcessData.defaultEventTitles;

            console.log("Objects created.")

            // testing references
            console.log("Scanning for references within created objects ... ");

            let objectsThatHaveReferences = 0;
            let referencesTotalCount = 0;

            for (let object of eventPlaneObjects) {
                if (object._related.length > 0) {
                    objectsThatHaveReferences++;
                }
                for (let i = 0; i < object._related.length; i++) {
                    referencesTotalCount++;
                }
            }

            console.log("Scanned for references.")
            console.log(objectsThatHaveReferences + " out of total " + eventPlaneObjects.length + " objects contain references");
            console.log("There are " + referencesTotalCount + " references existing ");

            console.log("Building world ... ");

            // Build whole Timeline
            buildWorld(timeline, __retSetUp.scene, timelineLineWidth, timeline.timelineLineHeight, timelineEndDate, dateLineSpace, defaultEventObjects);

            console.log("World built.")
            console.log("Sorting objets and creating spheres ... ")

            // this needs to be inside here, the fetch function, because the elements will later be loaded into the array, otherwise the array is empty.
            if (timeline.eventPlaneLimit > eventPlaneObjects.length) {
                timeline.eventPlaneLimit = eventPlaneObjects.length; // we set this to not access undefined (outside of array)
            }

            // eventPlaneObjects is a sorted list according to date
            let planesGroup: THREE.Group = new THREE.Group();
            planesGroup.name = "PlanesGroup";

            let labelsGroup: THREE.Group = new THREE.Group();
            labelsGroup.name = "LabelsGroup";

            eventPlaneObjects.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
            for (let i: number = 0; i < timeline.eventPlaneLimit; i++) {
                let eventPlane: THREE.Mesh;
                eventPlane = createBlob(timeline, eventPlaneObjects[i], timelineLineWidth, dateLineSpaceUnit, timeline.eventTypes); // returns sphere
                eventPlane.name = eventPlaneObjects[i].uri; // identifier. We need this to identify which object belongs to this evenplane since we can only directly call properties on the generated geometry not the object that was used to generate it
                eventPlaneObjects[i]._correspondingMesh = eventPlane;
                planesGroup.add(eventPlane);
                // @ts-ignore  because inspector sais we cannot assign Mesh to Mesh[], but we actually do can push, we do not assign here.
                timeline.eventPlanes.push(eventPlane);
            }

            console.log("Spheres created.")
            console.log("Creating text labels for spheres ... ")

            // text labels for spheres
            for (let i: number = 0; i < planesGroup.children.length; i++) {

                // find corresponding object because the mesh does not hold the title
                const correspondingObject = eventPlaneObjects.find(object => object._correspondingMesh.uuid === planesGroup.children[i].uuid);

                // date text elements are created as 3D Objects and need to get placed at the right place in 3D spac
                let color: number;
                color = timeline.timelineColor;

                // load font
                const loader: THREE.FontLoader = new THREE.FontLoader();
                loader.load(timeline.font, (font) => {
                    const matLite: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
                        color: color,
                        transparent: true,
                        side: THREE.DoubleSide
                    });
                    // standard title
                    let message: string = "Standard Label";
                    // nullcheck
                    if (correspondingObject) {
                        message = correspondingObject.title;
                    } else {
                        console.warn("corresponding Object not found to extract label from title");
                    }
                    let shapes: any[] = font.generateShapes(message, 0.3 * timeline.scale, 0);
                    let geometry: THREE.ShapeBufferGeometry = new THREE.ShapeBufferGeometry(shapes);
                    geometry.computeBoundingBox();
                    let label: THREE.Mesh = new THREE.Mesh(geometry, matLite);
                    // position close to sphere
                    label.position.y = planesGroup.children[i].position.y + 0.8;
                    label.position.x = planesGroup.children[i].position.x + 0.8;
                    label.position.z = planesGroup.children[i].position.z;
                    // add to group
                    labelsGroup.add(label);
                });
            }
            console.log("Textlabels created.")

            console.log("Adding spheres and labels to the scene ... ")

            // add to scene
            __retSetUp.scene.add(planesGroup);
            __retSetUp.scene.add(labelsGroup);

            console.log("Adding to scene.")

            // store original colors of events if not already done to be able to restore the color
            for (let i = 0; i < timeline.eventPlanes.length; i++) {
                //@ts-ignore
                timeline.eventPlanesOriginalColor.push(Object.assign({}, timeline.eventPlanes[i].material.color)); // careful, Object.assign makes a shallow copy, which means it only passes top-level enumerables by value, but nested objects would be passed by reference. Since we do not have nested objects, this is fine, but keep shallow copy in mind.
            }

            console.log("Update user view with processed data and created spheres")

            timeline.finishedLoading = true;
        })
        .catch((error) => {
            console.error(error);

            timeline.finishedLoading = true;
            console.log("Could not fetch data necessary for application. What you see is a simulation of what the application would look like, with a single object presented) ");

            //mockup section - just a single blob is efficient for now
            //internet connection droppet here in the office. I want to continue working. Also in case this happens again
            timelineStartDate = 0;
            timelineEndDate = 1600;

            let eventPlaneObject: eventPlane = new eventPlane(1, "Germania 98", 98, 98, "<div><p>FAKE NEWS</p></div>", "chapter_1", "Rechtswissen", "default_0/de/html/unit_chapter_1.html", [], -1, 0, "Antike -800-500", "this is a secription", "http://somethingsomething", "text of the whole thing", "http://somethingsomething", "http://somethingsomething", [0, 1, 2]);
            eventPlaneObjects.push(eventPlaneObject);

            const timelineLineHeight: number = Math.ceil(timelineEndDate * timeline.scale / 100) * 100;
            buildWorld(timeline, __retSetUp.scene, timelineLineWidth, timelineLineHeight, timelineEndDate, dateLineSpace, defaultEventObjects);

            timeline.eventTypes = ["Rechtswissen", "EventZeitspanneNormal", "FormenRechtlicherNormativitt", "Personen"];
            let eventBlob = createBlob(timeline, eventPlaneObjects[0], timelineLineWidth, dateLineSpaceUnit, timeline.eventTypes); // returns sphere
            eventBlob.name = eventPlaneObjects[0].uri; //identifier. We need this to identify which object belongs to this evenplane since we can only directly call properties on the generated geometry not the object that was used to generate it
            __retSetUp.scene.add(eventBlob);
            // @ts-ignore  because inspector sais we cannot assign Mesh to Mesh[], but we actually do can push, we do not assign here.
            timeline.eventPlanes.push(eventBlob);
        });
    //console.log(" ... done ");

    return {
        timelineStartDate,
        timelineEndDate,
        eventPlaneObjects,
        gui,
        defaultEventObjects
    };
}

/**********************************************************************************************************************/
/* END OF FETCH DATA */