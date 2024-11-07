export function processImage(imgSrc) {
    console.log(`Trying to read ${imgSrc}`);

    const img = cv.imread(imgSrc);
    console.log(img.size())

    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);

    console.log("Image converted");
    cv.imshow("TestCapture", imgGray);
    img.delete();
    imgGray.delete();
}