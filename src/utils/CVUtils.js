const OBJECT_MARKER_SCALE = 4;

const SCAN_OFFSET_X = 120;
const SCAN_OFFSET_Y = 120;

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
            cornerMap.set('tl', { x: corners.get(i).data32F[0], y: corners.get(i).data32F[1] });
            cornerMap.set('tr', { x: corners.get(i).data32F[2], y: corners.get(i).data32F[3] });
            cornerMap.set('br', { x: corners.get(i).data32F[4], y: corners.get(i).data32F[5] });
            cornerMap.set('bl', { x: corners.get(i).data32F[6], y: corners.get(i).data32F[7] });
            
            markers.set(ids.data32S[i], cornerMap);
        }

        // console.log(`Found markers:`)
        // console.log(markers);
    }

    corners.delete();
    ids.delete();   

    return markers;
}

export function flattenFrame(frame, res, markers, width, height, offset=false) {
    console.log(`Flattening image, size: ${frame.cols}, ${frame.rows}`)
    console.log("Markers:");
    console.log(markers);

    let offX = 0;
    let offY = 0;
    if (offset) {
      offX = SCAN_OFFSET_X;
      offY = SCAN_OFFSET_Y;
    }

    let topLeft, topRight, bottomRight, bottomLeft;
  
    topLeft = markers.get(10).get('tl');
    topRight = markers.get(11).get('tl');
    bottomRight = markers.get(12).get('tl');
    bottomLeft = markers.get(13).get('tl');
  
    let dst = new cv.Mat();
    let dsize = new cv.Size(width, height);
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      topLeft.x,
      topLeft.y,
      topRight.x,
      topRight.y,
      bottomRight.x,
      bottomRight.y,
      bottomLeft.x,
      bottomLeft.y,
    ]);
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      offX,
      offY,
      width - offX,
      0,
      width - offX,
      height - offY,
      0,
      height - offY,
    ]);

    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    cv.warpPerspective(
      frame,
      dst,
      M,
      dsize,
      cv.INTER_LINEAR,
      cv.BORDER_CONSTANT,
      new cv.Scalar()
    );
  
    dst.copyTo(res);
  
    dst.delete();
    srcTri.delete();
    dstTri.delete();
  
    return M;
}

function getPointTransform(point, M) {
    let x =
      (M.doubleAt(0, 0) * point.x +
        M.doubleAt(0, 1) * point.y +
        M.doubleAt(0, 2)) /
      (M.doubleAt(2, 0) * point.x +
        M.doubleAt(2, 1) * point.y +
        M.doubleAt(2, 2));
    let y =
      (M.doubleAt(1, 0) * point.x +
        M.doubleAt(1, 1) * point.y +
        M.doubleAt(1, 2)) /
      (M.doubleAt(2, 0) * point.x +
        M.doubleAt(2, 1) * point.y +
        M.doubleAt(2, 2));
    // console.log(`(${x}, ${y})`);
    return new cv.Point(parseInt(x, 10), parseInt(y, 10));
}

function removeBackground(frame) {
    let imgGrey = new cv.Mat(frame.rows, frame.cols, frame.type());
    cv.cvtColor(frame, imgGrey, cv.COLOR_RGBA2GRAY);

    // let fg = new cv.Mat(frame.rows, frame.cols, frame.type());
    let fg = new cv.Mat.zeros(frame.rows, frame.cols, frame.type());
    // cv.cvtColor(fg, fg, cv.COLOR_RGBA2RGB);
    cv.threshold(imgGrey, fg, 170, 255, cv.THRESH_BINARY_INV);
    cv.cvtColor(fg, fg, cv.COLOR_GRAY2RGBA);
    cv.bitwise_and(frame, fg, frame);

    // Change transparency channel
    let imgPlanes = new cv.MatVector();
    cv.split(frame, imgPlanes);
    cv.cvtColor(fg, fg, cv.COLOR_RGBA2GRAY);
    let fgPlanes = new cv.MatVector();
    cv.split(fg, fgPlanes);

    imgPlanes.set(3, fgPlanes.get(0));
    cv.merge(imgPlanes, frame);

    imgGrey.delete();
    fg.delete();
  }

export function findObjects(frame, markers, M, objects) {
    let i, topLeft, topRight, bottomRight, bottomLeft;
    
    // Check marker ids 100 to 120 to find objects
    for (i = 100; i < 120; i++) {
        if (markers.has(i)) {
            // Calculate object transforms to find four corners of the object
            // Based on calculation from https://www.quora.com/Given-two-diagonally-opposite-points-of-a-square-how-can-I-find-out-the-other-two-points-in-terms-of-the-coordinates-of-the-known-points
            topLeft = getPointTransform(markers.get(i).get('tl'), M);
            
            bottomRight = getPointTransform(markers.get(i).get('br'), M);
            bottomRight.x = topLeft.x + (bottomRight.x - topLeft.x) * OBJECT_MARKER_SCALE;
            bottomRight.y = topLeft.y + (bottomRight.y - topLeft.y) * OBJECT_MARKER_SCALE;

            topRight = getPointTransform(markers.get(i).get('tr'), M);
            topRight.x = (topLeft.x + bottomRight.x + bottomRight.y - topLeft.y) / 2;
            topRight.y = (topLeft.x - bottomRight.x + topLeft.y + bottomRight.y) / 2;

            bottomLeft = getPointTransform(markers.get(i).get('bl'), M);
            bottomLeft.x = (topLeft.x + bottomRight.x + topLeft.y - bottomRight.y) / 2;
            bottomLeft.y = (bottomRight.x - topLeft.x + topLeft.y + bottomRight.y) / 2;

            console.log(`[debug] Object (${i}) corners:`);
            console.log(`\ttl: ${topLeft.x}, ${topLeft.y}`);
            console.log(`\ttr: ${topRight.x}, ${topRight.y}`);
            console.log(`\tbr: ${bottomRight.x}, ${bottomRight.y}`);
            console.log(`\tbl: ${bottomLeft.x}, ${bottomLeft.y}`);

            // Set up the mask in the frame to obtain object
            let mask = new cv.Mat(frame.rows, frame.cols, frame.type());
            cv.rectangle(
              mask,
              new cv.Point(0, 0),
              new cv.Point(frame.cols, frame.rows),
              new cv.Scalar(0, 0, 0, 255),
              cv.FILLED
            );
            let center = new cv.Point(
              (topLeft.x + bottomRight.x) / 2,
              (topLeft.y + bottomRight.y) / 2
            );
            let side = Math.hypot(topLeft.x - topRight.x, topLeft.y - topRight.y);
            cv.circle(
              mask,
              center,
              side * 0.4,
              new cv.Scalar(255, 255, 255, 255),
              cv.FILLED
            );

            // Extract object
            let dst = new cv.Mat(frame.rows, frame.cols, frame.type());
            cv.rectangle(
              dst,
              new cv.Point(0, 0),
              new cv.Point(frame.cols, frame.rows),
              new cv.Scalar(255, 255, 255, 255),
              cv.FILLED
            );
            cv.bitwise_and(frame, mask, dst);
            
            // Make background white
            cv.cvtColor(mask, mask, cv.COLOR_RGBA2GRAY);
            cv.bitwise_not(mask, mask);
            cv.cvtColor(mask, mask, cv.COLOR_GRAY2RGBA);
            cv.bitwise_or(dst, mask, dst);

            // Hide ArUco marker
            cv.circle(
              dst,
              topLeft,
              (1.5 * side) / OBJECT_MARKER_SCALE,
              new cv.Scalar(255, 255, 255, 255),
              cv.FILLED
            );

            removeBackground(dst);

            // Crop object and add to map
            let pos = new cv.Point(center.x - side / 2, center.y - side / 2);
            let rect = new cv.Rect(pos.x, pos.y, side, side);
            let roiObject = new cv.Mat();
            roiObject = dst.roi(rect);
            let rot =
              Math.atan2(topRight.y - topLeft.y, topRight.x - topLeft.x) *
              (180 / Math.PI);

            // pos.x = pos.x - Math.floor(side / 2);
            // pos.y = pos.y - Math.floor(side / 2);

            console.log(`[CV] Found object ${i}`);
            objects.set(i, {
                'img': roiObject,
                'pos': pos,
                'center': center,
                'rot': rot,
                'size': side
            });
            console.log(objects.get(i));

            // dst.copyTo(res);

            mask.delete();
            dst.delete();
        }
    }
}

export function renderObjectOnBg(bg, obj, pos) {
    // console.log(`[INFO] Adding object at ${pos.x}, ${pos.y}`);
    
    // The pos is of the center of the object, derive the top left corner for rendering
    let x = pos.x - Math.floor(obj.cols / 2);
    let y = pos.y - Math.floor(obj.rows / 2);

    for (let i = 0; i < obj.rows; i++) {
      for (let j = 0; j < obj.cols; j++) {
        if (obj.ucharPtr(i, j)[3] === 255) {
          // Check if the pixel is within bounds before rendering
          if ((i + y) < bg.rows && (i + y) >= 0 && (j + x) < bg.cols && (j + x) >= 0) {
            bg.ucharPtr(i + y, j + x)[0] = obj.ucharPtr(i, j)[0];
            bg.ucharPtr(i + y, j + x)[1] = obj.ucharPtr(i, j)[1];
            bg.ucharPtr(i + y, j + x)[2] = obj.ucharPtr(i, j)[2];
          }
        }
      }
    }
}