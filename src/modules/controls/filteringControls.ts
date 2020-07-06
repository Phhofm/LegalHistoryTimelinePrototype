import eventPlane from "../../classes/eventPlane";
import TimeLine from "../../timeLine";
import createCookie from "../cookie/createCookie";
import $ from "jquery";
import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three";

export default (__retSetUp: {
    renderer: WebGLRenderer; camera: PerspectiveCamera; scene: Scene
    //@ts-ignore
}, eventPlaneObjects: eventPlane[], gui: any, timeline: TimeLine, timelineLineWidth: number, dateLineSpaceUnit: number) => {

    const filterPlanes = (bool: boolean, type: string) => {
        if (__retSetUp.scene.children) {
            for (let i: number = 0; i < __retSetUp.scene.children.length; i++) {
                if (__retSetUp.scene.children[i].name === "PlanesGroup") {
                    for (let j: number = 0; j < __retSetUp.scene.children[i].children.length; j++) {
                        let correspondingEventObject = eventPlaneObjects.find(object => object.uri === __retSetUp.scene.children[i].children[j].name);
                        //@ts-ignore
                        if (correspondingEventObject.type === type) {
                            __retSetUp.scene.children[i].children[j].visible = bool;

                        }
                    }
                }
            }
        }
    }

    // Filter params and gui setup
    // add controllers with names as parameters from eventTypes received from data
    let params = {
        save: () => {

            //Cookie creation
            console.log("creating cookie controllerState with saved values for 120 days:");
            console.log(gui.getSaveObject().remembered);
            console.log(typeof gui.getSaveObject().remembered);
            console.log(gui.getSaveObject());

            // if we do not show controls it overwrites values of cookie with empty
            // this is the case with the backgrounds parameters (background1 and background2 objects)
            // therefore we copy the cookie values, then replace the empty object values with the correct object and store this as a cookie
            let newCookie = {
                ...gui.getSaveObject().remembered
            };
            if (Object.keys(newCookie.Demo[1]).length === 0) { // it this is empty because the controls are not displayed we overwrite it before it deletes cookie values
                newCookie.Demo[1] = timeline.background1;
            }
            if (Object.keys(newCookie.Demo[2]).length === 0) { // it this is empty because the controls are not displayed we overwrite it before it deletes cookie values
                newCookie.Demo[2] = timeline.background2;
            }
            createCookie('controllerState', newCookie, 120);
            console.log(newCookie);
            console.log('Cookie stored');
            console.log(document.cookie);
            document.location.reload(); // refresh site so app gets built again with default parameters since some things only work correctly when rebuilt
        },
        delete: () => {

            const eraseCookie = (name: string) => {
                createCookie(name, "", -1);
            }

            eraseCookie('controllerState');

            document.location.reload(); // refresh site so app gets built again with default parameters (since cookie now deleted)

        },
        export: () => {
            // create modal //
            let $modal = $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" style="background-color:white">' +
                '<div class="modal-dialog modal-dialog-centered modal-lg" role="document">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h5 class="modal-title" id="exampleModalLabel"></h5>' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            if (!$(".modal:visible").length) {
                $modal.find(".modal-title").append("Parameter Values");
                $modal.find(".modal-body").append("These are the values of your set parameters for you to save locally: <br>");
                for (let preset in gui.getSaveObject().remembered) {
                    if (gui.getSaveObject().remembered.hasOwnProperty(preset)) {
                        for (let paramsObject in gui.getSaveObject().remembered[preset]) {
                            if (gui.getSaveObject().remembered[preset].hasOwnProperty(paramsObject)) {
                                for (let param in gui.getSaveObject().remembered[preset][paramsObject]) {
                                    if (gui.getSaveObject().remembered[preset][paramsObject].hasOwnProperty(param)) {
                                        if (!param.includes("export")) {
                                            $modal.find(".modal-body").append(param + " = " + gui.getSaveObject().remembered[preset][paramsObject][param] + "<br>");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                $modal.modal("show");
            }
        },
    };

    gui.remember(params);

    let filterFolder = gui.addFolder('Filters');
    for (let i = 0; i < timeline.eventTypes.length; ++i) {
        const typeName = timeline.eventTypes[i];
        if (timeline.eventTypesValues[i] === undefined) { //in case there is no cookie which we loaded from
            // @ts-ignore yes it does work
            params[typeName] = true;
        } else {
            // @ts-ignore yes it does work
            params[typeName] = timeline.eventTypesValues[i];
        }
        // @ts-ignore filter all initially in case of a restored cookie had filter options turned on
        filterPlanes(params[typeName], typeName);
        let controller =
            // @ts-ignore
            filterFolder.add(params, typeName)
                .name(typeName)
                .listen();
        controller.onChange(
            (newValue: any) => {
                timeline.eventTypesValues[timeline.eventTypes.indexOf(typeName)] = newValue;
                filterPlanes(newValue, typeName);
            });
    }

    filterFolder.open();

    //colors for planes by replacing colors in eventPlaneColors array of timeline according to position
    //and removing and recreating all plane geometries
    let planeColorFolder = gui.addFolder('Plane Colors');
    let j = 0; //we need this in case of less eventplane colors were provided than there exist, so we cycle thorugh array again
    for (let i = 0; i < timeline.eventTypes.length; ++i) {
        const typeName = timeline.eventTypes[i];
        const param: string = typeName + "Color";
        if (timeline.eventPlaneColors.length < timeline.eventTypes.length) {
            j = 0; //reset color index for provided eventplanecolors
        }
        // @ts-ignore
        params[param] = timeline.eventPlaneColors[j]; //we fetch color from eventplanecolors array, if more eventplanetypes than colors we use reseted j index to prevent catch (fetch error)
        j++; //increment j, might be the same value as i unless j was reset
        let controller =
            planeColorFolder.addColor(params, param)
                .name(typeName)
                .listen();
        controller.onChange(
            (newValue: any) => {
                timeline.eventPlaneColors[i] = newValue;

                //loop thorugh eventPlaneObjects array
                for (let i = 0; i < eventPlaneObjects.length; i++) {

                    //find those that have the corresponding type
                    if (eventPlaneObjects[i].type === typeName) {

                        //for each object that has that type, find the corresponsing mesh object

                        for (let j = 0; j < __retSetUp.scene.children[1].children.length; j++) {
                            if (eventPlaneObjects[i].uri === __retSetUp.scene.children[1].children[j].name) {
                                //@ts-ignore this property exists
                                __retSetUp.scene.children[1].children[j].material.color.set(newValue);
                                break;
                            }
                        }
                    }
                }
            });
    }

    planeColorFolder.open();

    gui.add(params, 'save').name('Save Parameters');
    gui.add(params, 'export').name('Show Parameters');
    gui.add(params, 'delete').name('Reset');

    gui.domElement.children[1].children[0].hidden = true; // remove the inbuild-dat.gui save panel because we implemented our own

}