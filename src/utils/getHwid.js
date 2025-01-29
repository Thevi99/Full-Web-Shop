const get_hwid = function (requestHeaders) {
    console.log("Received headers:", requestHeaders);
    let headers = [
        "valyse-fingerprint", "sirhurt-fingerprint", "sw-fingerprint", "bark-fingerprint", 
        "delta-fingerprint", "comet-fingerprint", "evon-fingerprint", "trigon-fingerprint", 
        "oxy-fingerprint", "wrd-fingerprint", "flux-fingerprint", "syn-fingerprint", 
        "krnl-hwid", "sentinel-fingerprint", "electronid", "seriality-identifier", 
        "hydrogen-fingerprint", "codex-fingerprint", "krampus-fingerprint", 
        "vegax-fingerprint", "arceus-fingerprint"
    ];
    let headerExecutors = {
        "syn-fingerprint": "Synapse X",
        "sw-fingerprint": "Script-Ware",
        "krnl-hwid": "KRNL",
        "electronid": "Electron",
        "trigon-fingerprint": "Trigon",
        "sirhurt-fingerprint": "SirHurt",
        "bark-fingerprint": "Bark",
        "delta-fingerprint": "Delta",
        "comet-fingerprint": "Comet",
        "evon-fingerprint": "Evon",
        "oxy-fingerprint": "Oxygen U",
        "wrd-fingerprint": "WeAreDevs",
        "flux-fingerprint": "Fluxus",
        "sentinel-fingerprint": "Sentinel",
        "valyse-fingerprint": "Valyse",
        "seriality-identifier": "Seriality",
        "hydrogen-fingerprint": "Hydrogen",
        "codex-fingerprint": "Code X",
        "krampus-fingerprint": "Krampus",
        "vegax-fingerprint": "Vega X",
        "arceus-fingerprint": "Arceus"
    };
    let executorName = "Unknown HWID";
    let hwid = "";
    let totalHeaders = 0;
    for (let i = 0; i < headers.length; i++) {
        if (requestHeaders[headers[i]]) {
            totalHeaders++;
            executorName = headerExecutors[headers[i]];
            hwid = requestHeaders[headers[i]];
        }
    }
    if (hwid === "") {
        console.log(requestHeaders);
        return { success: false, data: "No hwid found" };
    }
    if (totalHeaders > 1) {
        return { success: false, data: "Multiple hwids found" };
    }
    return { success: true, data: hwid, executor: executorName };
};

module.exports = get_hwid;
