/**
 * Example file that demonstrates the usage of timeline
 * @author phhofm / https://phhofm.github.io/
 */

// imports
import TimeLine from './timeLine';                          // import timeline
import {
    spinnerOptions
} from './modules/startUp/spinnerOptions';                  // import spinner options like linesize etc. these options can be adapted in the module code.
import {
    Spinner
} from "spin.js";                                           // import spinner for loading screen
import 'spin.js/spin.css';                                  // import spinner stylesheet for animation
import Font from '../fonts/gentilis_regular.typeface.json'; // import Font to be used
import $ from 'jquery';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/main.css';
import '../styles/ext.css';
import toRGBAColor from './modules/helper/toRGBAColor';
import WEBGL from './modules/helper/WebGL';

if (!WEBGL.isWebGLAvailable()) {

    var warning = WEBGL.getWebGLErrorMessage();
    document.getElementById('scene-container')!.appendChild(warning);
    throw new Error("WEBGL not supported by this browser");

}

// variables
const url: string = "https://api.jsonbin.io/b/5efc8fddbb5fbb1d25622eed"; // url with data provided
const container: HTMLElement | null = document.getElementById('scene-container'); // fetch container to hold the rendering mainScene

// loading screen Spinner. We load and display it before anything else. in fetchData will be unloaded
if (container) { // not null (or undefined/NaN/''/0/false) check
    let spinner = new Spinner(spinnerOptions).spin(container);

    // create timeline object
    // for more parameters to create the TimeLine object with specific parameters, have a look into the code (constructor of the object)
    const timelineWalkView = new TimeLine({
        spinner: spinner,           // REQUIRED the spinner for the loading screen
        url: url,                   // REQUIRED set the url from where the data will be imported
        container: container,       // REQUIRED set the container-selector which will hold the Three.js Scene
        font: Font,                 // REQUIRED pass the Font to be used for the 3D date elements
        consoleOutput: true,

        onClick: (data: any) => {   // OPTIONAL BUT HIGHLY RECOMMENDED. What will happen if an event gets clicked (show modal or redirect user etc). If this function is not provided, an alert message will be shown when an event is clicked.

            // default is image is empty
            let image = "";
            // bootstrap full size modal text (no image present so we make text full size)
            let colTextSize = 12;
            // if there is an image present, we load it and make the modal half-half
            if (data.image !== "") {

                image = '<div class="col-sm-6">' +
                    '<span tabindex="0" data-toggle="tooltip"' +
                    'title="">' +
                    '<img class="img-thumbnail"' +
                    'src="' + data.image + '"' +
                    'alt="" style="height:100%; object-fit:cover; border: 0px;"></span>' +
                    '</div>';

                colTextSize = 6;
            }

            // check text existance, display default text if !existent
            let text = "Click one of the following links for more information on this event:"   // standard text to display if no text provided
            if (data.linkLho == "" && data.linkSource == "") {                                  // if there are also no links, then there is no informaion at all on this event to display in the modal
                text = "There is currently no more information available on this event";
            }
            if (data.text !== "") {   // if there is text on this event, we of course display it
                text = data.text;
            }

            // links
            // the boostrap design
            let divLinks = '<div class="row align-items-end">';
            // sometimes there is the same link twice, sometimes there are multiple links like in "Quellentext" if they link to different sources. We need some control mechanism so they are either dropped or at least colored differently
            let controlArray: string[] = [];
            let remainingLinks = [];

            //for each link, we add a symbol and color to the bootsrap modal
            for (let i = 0; i < data.links.length; i++) {
                let addLink = '';

                // if it does not have a target (_blank) in the attributes, it is not an external link
                if (data.links[i]['@attributes']['target']) {

                    // LHO
                    if (data.links[i][0].includes('LHO')) {
                        if (controlArray.includes(data.links[i]['@attributes']['href'])) // we already have the exact same external link
                        { } // do nothing
                        else {
                            let colorLink = "DeepPink";
                            let symbol = 'LHO';      // for text
                            addLink = '<div class="col-sm text-center"><a class="link" href="' + data.links[i]['@attributes']['href'] + '" target="_blank" rel="external" title=' + data.links[i][0] + '><i style="color:' + colorLink + '">' + symbol + '</i></a></div>';       // for text
                            controlArray.push(data.links[i]['@attributes']['href']);
                        }
                    }

                    // Quellentext
                    else if (data.links[i][0].includes("Quellentext")) {
                        if (controlArray.includes(data.links[i]['@attributes']['href'])) // we already have the exact same external link
                        { } // do nothing
                        else {
                            let colorLink = "Yellow";
                            if (controlArray.includes("Yellow")) {    // there is already a yellow icon so we change color
                                colorLink = "Aquamarine";
                            }
                            //let symbol = 'book';        // for icon
                            let symbol = 'Quellentext';        // for text
                            //addLink = '<div class="col-sm"><a class="link" href="' + data.links[i]['@attributes']['href'] + '" target="_blank" rel="external" title=' + data.links[i][0] + '><i class="material-icons" style="color:' + colorLink + '">' + symbol + '</i></a></div>';       // for icon
                            addLink = '<div class="col-sm text-center"><a class="link" href="' + data.links[i]['@attributes']['href'] + '" target="_blank" rel="external" title=' + data.links[i][0] + '><i style="color:' + colorLink + '">' + symbol + '</i></a></div>';       // for text                            controlArray.push(data.links[i]['@attributes']['href']);
                            controlArray.push(colorLink);
                        }

                    }

                    // HRG 
                    else if (data.links[i][0].includes("HRG")) { // includes() is case sensitive
                        if (controlArray.includes(data.links[i]['@attributes']['href'])) // we already have the exact same external link
                        { } // do nothing
                        else {
                            let colorLink = "Red";
                            //let symbol = 'bookmark';        // for icon
                            let symbol = 'HRG';        // for text
                            //addLink = '<div class="col-sm"><a class="link" href="' + data.links[i]['@attributes']['href'] + '" target="_blank" rel="external" title=' + data.links[i][0] + '><i class="material-icons" style="color:' + colorLink + '">' + symbol + '</i></a></div>';       // for icon
                            addLink = '<div class="col-sm text-center"><a class="link" href="' + data.links[i]['@attributes']['href'] + '" target="_blank" rel="external" title=' + data.links[i][0] + '><i style="color:' + colorLink + '">' + symbol + '</i></a></div>';       // for text                            controlArray.push(data.links[i]['@attributes']['href']);
                            controlArray.push(data.links[i]['@attributes']['href']);
                        }
                    }

                    // HLS
                    else if (data.links[i][0].includes("HLS")) {
                        if (controlArray.includes(data.links[i]['@attributes']['href'])) // we already have the exact same external link
                        { } // do nothing
                        else {
                            let colorLink = "Cyan";
                            //let symbol = 'bookmarks';       // for icon
                            let symbol = 'HLS';         // for text
                            //addLink = '<div class="col-sm"><a class="link" href="' + data.links[i]['@attributes']['href'] + '" target="_blank" rel="external" title=' + data.links[i][0] + '><i class="material-icons" style="color:' + colorLink + '">' + symbol + '</i></a></div>';       // for icon
                            addLink = '<div class="col-sm text-center"><a class="link" href="' + data.links[i]['@attributes']['href'] + '" target="_blank" rel="external" title=' + data.links[i][0] + '><i style="color:' + colorLink + '">' + symbol + '</i></a></div>';       // for text
                            controlArray.push(data.links[i]['@attributes']['href']);
                        }
                    }

                    // Biographie
                    else if (data.links[i][0].includes("Biographie")) {
                        if (controlArray.includes(data.links[i]['@attributes']['href'])) // we already have the exact same external link
                        { } // do nothing
                        else {
                            let colorLink = "Lime";
                            //let symbol = 'info';      // for icon
                            let symbol = 'Biographie';        // for text
                            //addLink = '<div class="col-sm"><a class="link" href="' + data.links[i]['@attributes']['href'] + '" target="_blank" rel="external" title=' + data.links[i][0] + '><i class="material-icons" style="color:' + colorLink + '">' + symbol + '</i></a></div>';       // for icon
                            addLink = '<div class="col-sm text-center"><a class="link" href="' + data.links[i]['@attributes']['href'] + '" target="_blank" rel="external" title=' + data.links[i][0] + '><i style="color:' + colorLink + '">' + symbol + '</i></a></div>';       // for text
                            controlArray.push(data.links[i]['@attributes']['href']);
                        }
                    }

                    else {
                        remainingLinks.push(data.links[i]);
                    }

                    // add the google icon link to the html
                    divLinks = divLinks.concat(addLink);
                }
            }

            // remaining links
            //bootstrap dropdown html first part
            let fontsize = "1.0rem";        // for text
            let dropdownLinksString = '<div class="btn-group"><button type="button" class="btn btn-secondary btn-sm dropdown-toggle" data-toggle="dropdown" style="font-size: ' + fontsize + ';" aria-haspopup="true" aria-expanded="false">More</button><div class="dropdown-menu" style="background-color: transparent;">';

            // add remaining links to bootstrap dropdown html
            for (let i = 0; i < remainingLinks.length; i++) {
                let item = '<a class="dropdown-item" href="' + remainingLinks[i]['@attributes']['href'] + '" target="_blank" style="color: white;">' + remainingLinks[i][0] + '</a>';
                dropdownLinksString = dropdownLinksString.concat(item);
            }
            // close and add to modal html
            dropdownLinksString = dropdownLinksString.concat('</div></div>');
            divLinks = divLinks.concat(dropdownLinksString);

            // close out the boostrap modal design
            divLinks = divLinks.concat('</div>');

            let body = '<div class="container-fluid">' +
                '<div class="row">' +
                image +
                '<div class="col-sm-' + colTextSize + '" style="background-color: rgba(0,0,0,0.7);">' +
                '<div class="row">' +
                '<div class="col">' +
                '<p>' + text + ' </p>' +
                '</div>' +
                '</div>' +
                divLinks +
                '</div>';

            const $modal = $(
                '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
                '<div class="modal-dialog modal-dialog-centered modal-lg" role="document">' +
                '<div class="modal-content" style="border: 0px;">' +
                '<div class="modal-body">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            if (!$(".modal:visible").length) {
                $modal.find(".modal-body").append(body);
                $modal.modal("show");
                $modal[0].style.color = toRGBAColor(timelineWalkView.timelineColor);
            }
        },
    });

    // build the object / start the whole process
    timelineWalkView.build();
}