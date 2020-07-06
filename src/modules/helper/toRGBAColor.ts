export default (num: number) => {
    // from decimal to rgba
    num >>>= 0;
    const b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ((num & 0xFF000000) >>> 24) / 255;
    let rgba: string = "rgba(" + [r, g, b, a].join(",") + ")";
    //@ts-ignore
    rgba = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgba && rgba.length === 4) ? "#" +
        ("0" + parseInt(rgba[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgba[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgba[3], 10).toString(16)).slice(-2) : '';
}