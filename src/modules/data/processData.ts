import TimeLine from "../../timeLine";
import eventPlane from "../../classes/eventPlane";
import {
    getTitlesFromChapter
} from "./buildEventObjects";

export default (timeline: TimeLine, data: any, defaultChapterTitle: string, eventPlaneObjects: eventPlane[], apiItemsWithReferences: any) => {
    // make an array containing all types. A type belongs to a bar, so a bar for each type. Need this to check events and establish color-code for events
    timeline.eventTypes = data.types; // this array gets build from the API and contains all possible eventtypes, corresponding to the eventtime bars
    timeline.eventTypes.push("NoType");

    const ignoredTitlesBecauseNoDateProvided: string[] = [];
    const ignoredEventPlanesBecauseNoTypeProvided: eventPlane[] = [];
    const startDateAddition: number = 200; // give timeplanes a height if only one date is provided, change here if shorter or longer desired
    const defaultEventObjects: eventPlane[] = []; // those are the overarching events like "Antike" or "Frühmittelalter", they contain the word 'default' in the label and can be placed on timeline and event on top of them.
    const defaultEventTitles: string[] = []; // those are the overarching events like "Antike" or "Frühmittelalter", they contain the word 'default' in the label and can be placed on timeline and event on top of them.

    // loops through elements in default (gets chapters)
    data.epub.default.forEach((defaultItem: APIItemType) => {
        defaultChapterTitle = getTitlesFromChapter(defaultItem, true, eventPlaneObjects, ignoredTitlesBecauseNoDateProvided, ignoredEventPlanesBecauseNoTypeProvided, startDateAddition, defaultChapterTitle, apiItemsWithReferences, defaultEventTitles, defaultEventObjects); // defaultChapter is a parameter that indicates that it is a chapter and not a sub-chapter (sincec chapter resembles a timeperiod in the current data)
    });

    // extend timeline to be as long till the latest event received (enddate of latest event)
    // not only do we extract the earliest and latest dates for the timeline-length, but also to restrict panning controls for the user to not pan/scroll too far

    let latestDate: number = 0;
    let earliestDate: number = 0;
    eventPlaneObjects.forEach((defaultItem) => {
        if (defaultItem.endDate > latestDate) {
            latestDate = defaultItem.endDate;
        }
        if (defaultItem.startDate < earliestDate) {
            earliestDate = defaultItem.endDate;
        }
    });
    let timelineEndDate = latestDate;
    let timelineStartDate = earliestDate;

    timeline.timelineLineHeight = Math.ceil(timelineEndDate * timeline.scale / 100) * 100;

    // consoleoutput of processes data if desired to check out
    if (timeline.consoleOutput) {
        console.log('These are all default objects: ');
        console.log(defaultEventObjects);
        console.log('These are all default titles: ');
        console.log(defaultEventTitles);
        console.log('These are all objects for eventplanes provided by the API:');
        console.log(eventPlaneObjects);
        console.log('These are all objects that have been ignored because they do not provide any types so we cannot place them as events on the timeline:');
        console.log(ignoredEventPlanesBecauseNoTypeProvided);
        console.log('These are all titles that have been ignored because they do not provide any dates so we cannot place them as events on the timeline:');
        console.log(ignoredTitlesBecauseNoDateProvided);
    }
    return {
        timelineEndDate,
        timelineStartDate,
        defaultEventObjects,
        defaultEventTitles
    };
}