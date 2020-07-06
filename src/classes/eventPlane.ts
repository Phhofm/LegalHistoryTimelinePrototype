export default class eventPlane {
    _id: number;                       // internal id reference to object
    title: string;
    startDate: number;
    endDate: number;
    html: string;                      // content to display
    description: string;
    image: string;
    text: string;
    linkLho: string;
    linkSource: string;
    links: any;
    label: string;
    type: string;
    uri: string;
    shadowId: number;                  // if -1 means no shadow expanded
    yFighterLevel: number;             // resolve y-fighting
    defaultChapter: string;            // what timeperiod it belongs to, those chapters are called "default" in the dataset this is why it is named like this
    _related: number[] = [];           // this will be later provided from the backend, which events are related or connected to this one, for now it is a mockup. TODO change this to be received from API.
                                       //@ts-ignore
    _correspondingMesh: THREE.Mesh;
    _relatedCurves: THREE.Line[] = []; //we store curves in object so we can set them invisible if event deselected in scene

    constructor(id: number, title: string, startDate: number, endDate: number, html: string, label: string, type: string, uri: string, references: number[], shadowId: number, yFighterLevel: number, defaultChapter: string, description: string, image: string, text: string, linkLho: string, linkSource: string, links: any) {
        this._id = id;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.html = html;
        this.label = label;
        this.type = type;
        this.uri = uri;
        this._related = references;
        this.shadowId = shadowId;
        this.yFighterLevel = yFighterLevel;
        this.defaultChapter = defaultChapter;
        this.description = description;
        this.image = image;
        this.text = text;
        this.linkLho = linkLho;
        this.linkSource = linkSource;
        this.links = links;
    }

}