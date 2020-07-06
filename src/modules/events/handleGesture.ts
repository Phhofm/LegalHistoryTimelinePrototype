import onClickLogic from '../../logic/onClick';
import eventPlane from '../../classes/eventPlane';
import TimeLine from "../../timeLine";
/* HANDLE GESTURE METHOD */
// this is to adapt to touch devices, using a threshold to determine if user wanted to swipe or click. Otherwise swiping would open click methods if stopped or started over an eventplane previously
/**********************************************************************************************************************/
export default (timeline: TimeLine, __retFetchData: {
    timelineStartDate: number;timelineEndDate: number;eventPlaneObjects: eventPlane[];
}, scene: THREE.Scene, raycaster: THREE.Raycaster, timelineLineWidth: number, dateLineSpaceUnit: number, threshold: number, touchstartX: number, touchstartY: number, touchendX: number, touchendY: number, currentChapterEpoch: string) => {
    const x: number = touchendX - touchstartX;
    const y: number = touchendY - touchstartY;

    if (Math.abs(x) > threshold || Math.abs(y) > threshold) { // swipe logic
    } else { // tap logic
        currentChapterEpoch = onClickLogic(timeline, scene, raycaster, timelineLineWidth, dateLineSpaceUnit, __retFetchData.eventPlaneObjects, currentChapterEpoch).currentChapterEpoch;
    }
    return currentChapterEpoch;
}

/**********************************************************************************************************************/
/* END OF HANDLE GESTURE METHOD */