export function processCapture(imgSrc) {
    console.log(`Trying to read ${imgSrc}`);

    const img = cv.imread(imgSrc);
    console.log(img.size())

    findMarkers(img);

    const gray = new cv.Mat();
    cv.cvtColor(img, gray, cv.COLOR_BGR2GRAY);

    cv.imshow("TestCapture", img);

    img.delete();
    gray.delete();
}

export function findMarkers(img, markers) {
    let detectionParams = new cv.aruco_DetectorParameters();
    let refineParams = new cv.aruco_RefineParameters(10.0, 3.0, true);
    let dictionary = cv.getPredefinedDictionary(cv.DICT_ARUCO_ORIGINAL);
    let detector = new cv.aruco_ArucoDetector(dictionary, detectionParams, refineParams);

    let corners = new cv.MatVector();
    let ids = new cv.Mat();

    detector.detectMarkers(img, corners, ids);
    
    if (corners.size() > 0) {
        // Markers found, add them to map and return 
        let i;
        for (i = 0; i < corners.size(); i++) {
            if (ids.data32S[i] > 120) 
                continue;

            let cornerMap = new Map();
            cornerMap.set('tl', [corners.get(i).data32F[0], corners.get(i).data32F[1]]);
            cornerMap.set('tr', [corners.get(i).data32F[2], corners.get(i).data32F[3]]);
            cornerMap.set('br', [corners.get(i).data32F[4], corners.get(i).data32F[5]]);
            cornerMap.set('bl', [corners.get(i).data32F[6], corners.get(i).data32F[7]]);
            
            markers.set(ids.data32S[i], cornerMap);
        }

        console.log(`Found markers:`)
        console.log(markers);
        // console.log(ids.data32S);
        // console.log(corners.get(0).data32F)
        // cv.drawDetectedMarkers(img, corners, ids, new cv.Scalar(0, 255, 0));
    }

    corners.delete();
    ids.delete();   

    return markers;
}