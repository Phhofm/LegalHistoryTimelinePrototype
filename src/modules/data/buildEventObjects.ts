import '../../interfaces/APIItemType';
import eventPlane from '../../classes/eventPlane';

/* BUILD EVENT OBJECTS RECEIVED FROM API */
// loops thorugh elements in chapters and gets titles, if there are inner chapters it loops thorugh all of them too to get all titles (currently 167 titles without inner chapters, 184 with inner chapters)
// builds and populates arrays with eventplane-objects from data provided
/**********************************************************************************************************************/
export function getTitlesFromChapter(chapter: APIItemType, defaultChapter: boolean, eventPlaneObjects: eventPlane[], ignoredTitlesBecauseNoDateProvided: string[], ignoredEventPlanesBecauseNoTypeProvided: eventPlane[], startDateAddition: number, defaultChapterTitle: string, apiItemsWithReferences: any, defaultEventTitles: string[], defaultEventObjects: eventPlane[]) {

    // if it is a chapter and not a sub-chapter
    if (defaultChapter) {
        defaultChapterTitle = chapter.title;
    }

    // call function again for inner chapters (sub-chapters)
    if (chapter.chapters && chapter.chapters.length > 0) {
        chapter.chapters.forEach((innerChapter) => {
            getTitlesFromChapter(innerChapter, false, eventPlaneObjects, ignoredTitlesBecauseNoDateProvided, ignoredEventPlanesBecauseNoTypeProvided, startDateAddition, defaultChapterTitle, apiItemsWithReferences, defaultEventTitles, defaultEventObjects);
        })
    }

    // extracting dates from titles and building planeObjects
    // if no date could be extracted from the title it will be ignored
    const dates = chapter.title.replace(/\s/g, '').match(/(?:(\u002D?\d{1,4})(?:\u002D)(\u002D?\d{1,4}))/u); //First we remove all whitespaces because "Antike -800 -500" made problems because of the whitespace, without whitespaces the apoended .match regex works fine. Capturing Groups with a Noncapturing Group in the middle for the - sign. There check for an optional - and then for a number in the range of 1-4 digits on both sides of the - sign ("500-1000" or "-800--200"). https://regexr.com/ with "Explain" will explain the regex (?:(\u002D?\d{1,4})(?:\u002D)(\u002D?\d{1,4}))
    let singleDate: number; // in case there is a single date like "Einfall der Hunnen 375"
    let extractedStartDate: number;
    let extractedEndDate: number;
    let noDateProvided: boolean = false;

    if (dates !== null) {
        extractedStartDate = parseInt(dates[1]);
        extractedEndDate = parseInt(dates[2]);
    } else { //single date. null since prevous regexp did not match the required specific date format
        const num: string[] | null = chapter.title.match(/\d{1,4}/); // extract single date
        if (num !== null) { // check if a single date got extracted
            singleDate = parseInt(num[0]);
        } else {
            noDateProvided = true;
        }
    }

    // type check
    let noTypeProvided: boolean = false;
    if (!chapter.type || chapter.type === "" || chapter.type === undefined) {
        noTypeProvided = true;
    }

    apiItemsWithReferences.push(chapter.references);

    // build eventObjects and populate arrays
    if (defaultChapter) {
        defaultEventTitles.push(chapter.title);
        //@ts-ignore
        if (extractedStartDate) { // check if there were multiple dates and build the corresponding object
            // @ts-ignore
            const eventPlaneObject: eventPlane = new eventPlane(chapter.id, chapter.title, extractedStartDate, extractedEndDate, chapter.html, chapter.label, chapter.type, chapter.uri, chapter.references, -1, 0, defaultChapterTitle, chapter.description, chapter.image, chapter.text, chapter.linkLho, chapter.linkSource, chapter.links);
            defaultEventObjects.push(eventPlaneObject);
        } else { // if there was a single date build the corresponding object
            // @ts-ignore
            const endDate: number = singleDate + startDateAddition; // need to create a endDate to be able to give the timeevent a height to place it (for the plane to have a height).
            // @ts-ignore
            const eventPlaneObject: eventPlane = new eventPlane(chapter.id, chapter.title, singleDate, endDate, chapter.html, chapter.label, chapter.type, chapter.uri, chapter.references, -1, 0, defaultChapterTitle, chapter.description, chapter.image, chapter.text, chapter.linkLho, chapter.linkSource, chapter.links);
            defaultEventObjects.push(eventPlaneObject);
        }

    } // filter out default chapters, because they got a NoType as type provided and therefore were not filtered out anymore, if displayed as bubbles they will have "undefined" everywhere except title, which breaks modal display
    else if (!noDateProvided) { // check if we found a date
        if (!noTypeProvided) { // check if we have a type
            // @ts-ignore i dont think that variables are used before assigned here, the if-statements logic should prevent this
            if (extractedStartDate) { // check if there were multiple dates and build the corresponding object
                // @ts-ignore
                const eventPlaneObject: eventPlane = new eventPlane(chapter.id, chapter.title, extractedStartDate, extractedEndDate, chapter.html, chapter.label, chapter.type, chapter.uri, chapter.references, -1, 0, defaultChapterTitle, chapter.description, chapter.image, chapter.text, chapter.linkLho, chapter.linkSource, chapter.links);
                eventPlaneObjects.push(eventPlaneObject);
            } else { // if there was a single date build the corresponding object
                // @ts-ignore
                const endDate: number = singleDate + startDateAddition; // need to create a endDate to be able to give the timeevent a height to place it (for the plane to have a height).
                // @ts-ignore
                const eventPlaneObject: eventPlane = new eventPlane(chapter.id, chapter.title, singleDate, endDate, chapter.html, chapter.label, chapter.type, chapter.uri, chapter.references, -1, 0, defaultChapterTitle, chapter.description, chapter.image, chapter.text, chapter.linkLho, chapter.linkSource, chapter.links);
                eventPlaneObjects.push(eventPlaneObject);
            }
        }
        //ignored because type is empty so we cannot know which timeline to add to
        else {
            // @ts-ignore
            if (extractedStartDate) { // check if there were multiple dates and build the corresponding object
                // @ts-ignore
                const eventPlaneObject: eventPlane = new eventPlane(chapter.id, chapter.title, extractedStartDate, extractedEndDate, chapter.html, chapter.label, "NoType", chapter.uri, chapter.references, -1, 0, defaultChapterTitle, chapter.description, chapter.image, chapter.text, chapter.linkLho, chapter.linkSource, chapter.links);
                ignoredEventPlanesBecauseNoTypeProvided.push(eventPlaneObject);
                eventPlaneObjects.push(eventPlaneObject);
            } else { // if there was a single date build the corresponding object
                //for the "Moderne 1800-"
                // @ts-ignore
                const endDate: number = singleDate + startDateAddition;
                // @ts-ignore
                const eventPlaneObject: eventPlane = new eventPlane(chapter.id, chapter.title, singleDate, endDate, chapter.html, chapter.label, "NoType", chapter.uri, chapter.references, -1, 0, defaultChapterTitle, chapter.description, chapter.image, chapter.text, chapter.linkLho, chapter.linkSource, chapter.links);
                ignoredEventPlanesBecauseNoTypeProvided.push(eventPlaneObject);
                eventPlaneObjects.push(eventPlaneObject);
            }
        }
    }
    //ignored because no date provided
    else {
        ignoredTitlesBecauseNoDateProvided.push(chapter.title);
        //console.log("Developer notes: The following title will be ignored by the application because it provided no date: " + chapter.title);
    }
    return defaultChapterTitle;
}

/**********************************************************************************************************************/
/* END OF BUILD EVENT OBJECTS RECEIVED FROM API */