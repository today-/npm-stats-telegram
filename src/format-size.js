module.exports = (bytes) => {
    if (bytes <= 0 || !isFinite(bytes)) return "";
    let i = -1;
    const byteUnits = [" KB", " MB", " GB", " TB", " PB", " EB", " ZB", " YB"];
    do {
        bytes /= 1024;
        i++;
    } while (bytes > 1024);

    return Math.max(bytes, 0.1).toFixed(1).replace(".", ",") + byteUnits[i];
}
