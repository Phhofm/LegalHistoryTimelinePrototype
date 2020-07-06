import restoreValuesFromCookie from '../cookie/restoreValuesFromCookie';
import setUpTHREEJSEnv from './setUpTHREEJSEnv';
import buildBackground from './buildBackground';
import fetchData from '../data/fetchData';
import setUpControls from '../controls/setUpControls';
import setUpControllers from '../controls/setUpControllers';
import {
    animate
} from '../rendering/animate';
import addEventListeners from '../events/addEventListeners';

//classes import
import eventPlane from '../../classes/eventPlane';
import TimeLine from "../../timeLine";
import filteringControls from '../controls/filteringControls';

/* INITIALIZE FUNCTION */
// Handles set up of scene, camera, renderer, controls, eventListeners and handles fetching and processing of data by calling functions.

/**********************************************************************************************************************/

export default async (timeline: TimeLine) => {

    // disable all console warnings to keep browser console clean if parameter is set.
    if (timeline.disableConsoleWarnings) {
        console.warn = () => { };
    }

    /* CONTROL VARIABLES */
    /******************************************************************************************************************/
    const timelineLineWidth: number = timeline.scale * 13; // adapt width by changing the number.
    const dateLineSpace: number = timeline.scale * 140; // adapt dateLineSpace by changing the number.
    const dateLineSpaceUnit: number = dateLineSpace / 100; // adapt time steps by changing the number.

    /******************************************************************************************************************/

    /* RESTORE VALUES FROM COOKIE */
    /******************************************************************************************************************/
    restoreValuesFromCookie(timeline);

    /******************************************************************************************************************/

    /* SET UP THREEJS ENVIRONMENT */
    /******************************************************************************************************************/
    const __retSetUp: {
        renderer: THREE.WebGLRenderer; camera: THREE.PerspectiveCamera; scene: THREE.Scene
    } = setUpTHREEJSEnv(timeline);

    /******************************************************************************************************************/

    /* BACKGROUND */
    /******************************************************************************************************************/
    let __retParticleBackground = buildBackground(timeline);

    /******************************************************************************************************************/

    /* FETCH DATA AS JSON */
    // added await because right now a lot of logic is in fetchData that could be logically moved into other functions
    // but needs the fetching to be completed to not handle undefined data. Since we made this code synchronous now,
    // we can move functionality out of fetchData into other functions.
    /******************************************************************************************************************/
    const __retFetchData: {
        timelineStartDate: number; timelineEndDate: number,
        eventPlaneObjects: eventPlane[],
        gui: any,
        defaultEventObjects: eventPlane[]
    } = await fetchData(timeline, __retSetUp, timelineLineWidth, dateLineSpace, dateLineSpaceUnit);

    /******************************************************************************************************************/

    /* SET UP AND RESTRICT CONTROLS */

    // this is not in setup because we need the returned values from the data fetched for start and end date for limitation of panning
    /******************************************************************************************************************/
    const controls = setUpControls(__retSetUp, __retFetchData, dateLineSpaceUnit);

    /******************************************************************************************************************/

    /* SET UP CONTROLLERS */
    /******************************************************************************************************************/
    setUpControllers(__retFetchData, timeline, __retSetUp, timelineLineWidth, dateLineSpace, __retParticleBackground, controls, dateLineSpaceUnit);
    filteringControls(__retSetUp, __retFetchData.eventPlaneObjects, __retFetchData.gui, timeline, timelineLineWidth, dateLineSpaceUnit);

    /******************************************************************************************************************/

    /* HIDE CONTROLLERS IF MOBILE SCREEN */
    /******************************************************************************************************************/
    if (typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1) {
        __retFetchData.gui.domElement.style.visibility = "hidden";
        const infoControls = document.getElementById("infoControls");
        if (infoControls) { // not null (or undefined/NaN/''/0/false) check
            infoControls.style.visibility = "hidden";
        }
    }

    /******************************************************************************************************************/

    /* ADD EVENT LISTENERS */
    /******************************************************************************************************************/

    if (__retParticleBackground) {
        addEventListeners(timeline, __retSetUp, __retFetchData, timelineLineWidth, dateLineSpaceUnit, __retParticleBackground);
    } else {
        addEventListeners(timeline, __retSetUp, __retFetchData, timelineLineWidth, dateLineSpaceUnit);
    }

    /******************************************************************************************************************/

    /* ANIMATE => RENDER */
    /******************************************************************************************************************/
    if (__retParticleBackground) {
        // @ts-ignore
        animate(timeline, __retSetUp, controls, __retParticleBackground);

    } else {
        animate(timeline, __retSetUp, controls);

    }

    /******************************************************************************************************************/

    /* REMOVE SPINNER */
    /******************************************************************************************************************/
    if (!timeline.spinnerStopped) {
        timeline.spinner.stop();
        timeline.spinnerStopped = true;
    } //stop the spinner / loading animation and render the scenes

    /******************************************************************************************************************/

}

/**********************************************************************************************************************/
/* END OF INITIALIZE FUNCTION */