(function () {

    const segmentationConfig = {
        internalResolution: 'high',
        segmentationThreshold: 0.07,
        scoreThreshold: 0.05
    };
    const bodyPixConfig = {
        architechture: 'MobileNetV1',
        outputStride: 8,
        multiplier: 1,
        quantBytes: 4
    };

    let video;
    let outCanvas, outContext;
    let curCanvas, curContext;

    function init() {
        video = document.getElementById("video");
        outCanvas = document.getElementById("output-canvas");
        outContext = outCanvas.getContext("2d");
        curCanvas = document.createElement("canvas");
        curCanvas.setAttribute("width", 500);
        curCanvas.setAttribute("height", 300);
        curContext = curCanvas.getContext("2d");
        video.play();
        computeFrame();
    }

    function computeFrame() {
        curContext.drawImage(video, 0, 0, 500, 300);
        let frame = curContext.getImageData(0, 0, 500, 300);
        model.segmentPerson(curCanvas, segmentationConfig).then((segmentation) => {
            let out_image = outContext.getImageData(0, 0, 500, 300);
            for (let x = 0; x < 500; x++) {
                for (y = 0; y < 300; y++) {
                    let n = x + (y * 500);
                    if (segmentation.data[n] === 0) {
                        out_image.data[n * 4] = frame.data[n * 4]; //R
                        out_image.data[n * 4 + 1] = frame.data[n * 4 + 1]; //G
                        out_image.data[n * 4 + 2] = frame.data[n * 4 + 2]; //B
                        out_image.data[n * 4 + 3] = frame.data[n * 4 + 3]; //A
                    }
                }
            }
            outContext.putImageData(out_image, 0, 0);
            setTimeout(computeFrame, 0);
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        bodyPix.load(bodyPixConfig).then((m) => {
            model = m;
            init();
        });
    });


})();
