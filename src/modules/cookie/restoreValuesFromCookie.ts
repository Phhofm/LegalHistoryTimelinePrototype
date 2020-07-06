// module import
import readCookie from './readCookie';
import TimeLine from "../../timeLine";


/* RESTORE VALUES FROM COOKIE */
/******************************************************************************************************************/

export default (timeline: TimeLine) => {

    let controllerState: any = null;

    if (document.cookie.includes('controllerState')) { // check if cookie exists before trying to read it.
        controllerState = readCookie('controllerState'); // reading cookie of controller states.
    }

    if (controllerState !== null) {

        // Colors Folder
        timeline.eventPlaneMoveOverColor = controllerState.Demo[0].eventPlaneMoveOverColor;
        timeline.timelineColor = controllerState.Demo[0].timelineColor;

        // Background Folder
        timeline.background = controllerState.Demo[0].background;
        if (timeline.background === 0) { // if we use the particleJS canvas, dat.gui will not store pixelWaveBackground in the cookie and so just build from the default value
            timeline.pixelWaveBackground = true;
        }
        if (controllerState.Demo[0].pixelWaveBackground) {
            timeline.pixelWaveBackground = controllerState.Demo[0].pixelWaveBackground;
        }
        if (controllerState.Demo[0].particleColor) {
            timeline.particleColor = controllerState.Demo[0].particleColor;
        }
        if (controllerState.Demo[0].backgroundColor) {
            timeline.backgroundColor = controllerState.Demo[0].backgroundColor;
        }
        // background1 stars
        if (Object.keys(controllerState.Demo[1]).length !== 0) {
            timeline.background1 = controllerState.Demo[1];
        }
        // background2 wires
        if (Object.keys(controllerState.Demo[2]).length !== 0) {
            timeline.background2 = controllerState.Demo[2];
        }

        // Behavior Folder
        timeline.twitchingOnlyActiveObject = controllerState.Demo[0].twitchingOnlyActiveObject;
        timeline.eventWireFrame = controllerState.Demo[0].eventWireFrame;
        timeline.alternativeOnClickBehavior = controllerState.Demo[0].alternativeOnClickBehavior;
        timeline.twitchingExtent = controllerState.Demo[0].twitchingExtent;

        // Appearance Folder
        timeline.clickedSize = controllerState.Demo[0].clickedSize;
        timeline.sphereRadius = controllerState.Demo[0].sphereRadius;
        timeline.sphereWidthSegments = controllerState.Demo[0].sphereWidthSegments;
        timeline.sphereHeightSegments = controllerState.Demo[0].sphereHeightSegments;

        // Fliters
        // empty arrays and store values in timeline object
        timeline.eventTypes.length = 0;
        timeline.eventPlaneColors.length = 0;
        for (let variable in controllerState.Demo[3]) {
            if (controllerState.Demo[3].hasOwnProperty(variable)) {
                if (variable.includes("Color")) {
                    timeline.eventPlaneColors.push(controllerState.Demo[3][variable]);
                } else {
                    timeline.eventTypes.push(variable);
                    timeline.eventTypesValues.push(controllerState.Demo[3][variable]);
                }
            }
        }
    }
}
/* END OF RESTORE VALUES FROM COOKIE */
/******************************************************************************************************************/