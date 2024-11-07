export default function processCapture(imgSrc) {
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

function findMarkers(img) {
    let detectionParams = new cv.aruco_DetectorParameters();
    let refineParams = new cv.aruco_RefineParameters(10.0, 3.0, true);
    let dictionary = cv.getPredefinedDictionary(cv.DICT_ARUCO_ORIGINAL);
    let detector = new cv.aruco_ArucoDetector(dictionary, detectionParams, refineParams);

    let corners = new cv.MatVector();
    let ids = new cv.Mat();

    detector.detectMarkers(img, corners, ids);
    console.log(ids.size());
    console.log(corners.size());

    if (corners.size() > 0) {
        console.log(`Found markers: ${ids.data}`)
        // cv.drawDetectedMarkers(img, corners, ids, new cv.Scalar(0, 255, 0));
    }
    // 

    corners.delete();
    ids.delete();
}