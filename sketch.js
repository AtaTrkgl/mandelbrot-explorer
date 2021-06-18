
let iterationsSlider;
let iterApplyButton;
let iterations = 50;

const LOW_RES_PIXELSKIP = 9;

let highresResPerFrame = [100, 100];
let lastPixelsDrawn = [0, 0];

let zoom = 300;
let origin = [0, 0];

function setup() 
{
	createCanvas(displayWidth - 20, displayHeight - 200);
    background(0);
    pixelDensity(1);
    frameRate(60);

    iterationsSlider = createSlider(5, 300, iterations, 1);

    iterApplyButton = createButton("Apply Iterations");
    iterApplyButton.mousePressed(applyIterations);

    drawMandelbrot(LOW_RES_PIXELSKIP);
}

function draw(){
    if (origin[0] < height && origin[1] < width){

        var xRange = [lastPixelsDrawn[0], min(lastPixelsDrawn[0] + highresResPerFrame[0], width)];
        var yRange = [lastPixelsDrawn[1], min(lastPixelsDrawn[1] + highresResPerFrame[1], height)];
        drawMandelbrot(1, clearBg = false, yRange=yRange, xRange=xRange);

        if (xRange[1] == width)
            lastPixelsDrawn = [0, yRange[1]];
        else
            lastPixelsDrawn = [xRange[1], yRange[0]];
    }
}

function applyIterations(){
    iterations = iterationsSlider.value();

    // Decrease the highres resolution if the iterations get higher to improve performance.
    if (iterations > 250 && iterations < 350) highresResPerFrame = [30, 30];
    else if (iterations > 200 && iterations < 250) highresResPerFrame = [70, 70];
    else if (iterations > 100 && iterations < 200) highresResPerFrame = [150, 150];
    else highresResPerFrame = [200, 200];

    console.log(iterations);
    drawMandelbrot(LOW_RES_PIXELSKIP);
}

function iterateNumber(real, imag){
    let c = new Complex(real, imag);
    let z = new Complex(0, 0);
    for (let i = 0; i < iterations; i++) {
        z = Complex.add(Complex.multiply(z, z), c);
        if (abs(z.re) + abs(z.im) > 10){
            return i/iterations * 255;
        }
    }

    return -1;
}

function drawMandelbrot(pixelSkipCount, clearBg=true,yRange=[0, height], xRange=[0, width]){
    if (clearBg)
        background(0);
    
    if (pixelSkipCount != 1)
        lastPixelsDrawn = [0, 0];
    
    loadPixels();

    for (var y = yRange[0]; y < yRange[1]; y++) {
        for (var x = xRange[0]; x < xRange[1]; x++){
            let i = (y * width + x) * 4;
            if (x % pixelSkipCount == 0 && y % pixelSkipCount == 0){
                coords = pixelToCoords([x, y]);
                var iteratedColor = iterateNumber(coords[0], coords[1]);

                colorMode(HSB, 255);
                var c = color(abs(iteratedColor), 255,iteratedColor == -1 ? 0 : 255);
                pixels[i + 0] = clamp(red(c), 0 ,255);
                pixels[i + 1] = clamp(green(c), 0 ,255);
                pixels[i + 2] = clamp(blue(c), 0 ,255);
                pixels[i + 3] = 255;
            }else{
                yToCopy = y - (y % pixelSkipCount);
                xToCopy = x - (x % pixelSkipCount);
                var iToCopy = (yToCopy * width + xToCopy) * 4;

                pixels[i + 0] = pixels[iToCopy + 0];
                pixels[i + 1] = pixels[iToCopy + 1];
                pixels[i + 2] = pixels[iToCopy + 2];
                pixels[i + 3] = 255;
            }
        }
    }
    updatePixels();
}

function pixelToCoords(pixelCords, zoomAmount=zoom){
    let centeredPixCoords = [pixelCords[0] - width * .5, pixelCords[1] - height * .5];
    return [centeredPixCoords[0] / zoomAmount + origin[0], centeredPixCoords[1] / zoomAmount + origin[1]];
}

function mouseWheel(event) {
    if (!isCursorOnCanvas()) return;

    let prevZoom = zoom;
    zoom -= event.delta * zoom / 300;
    if (zoom < 200) zoom = 200;

    // By changing the origin by the position delta of the cursor
    // we can keep the mouse position still while zooming.
    let mousePos = [mouseX, mouseY];
    lastPos = pixelToCoords(mousePos, prevZoom);
    currentPos = pixelToCoords(mousePos, zoom);

    origin[0] -= currentPos[0] - lastPos[0];
    origin[1] -= currentPos[1] - lastPos[1];

    drawMandelbrot(LOW_RES_PIXELSKIP, clearBg=true);
}

function mouseClicked() {
    if (!isCursorOnCanvas()) return;

    let mousePos = [mouseX, mouseY];
    let mouseCoords = pixelToCoords(mousePos);
    origin = mouseCoords;

    drawMandelbrot(LOW_RES_PIXELSKIP, clearBg=true);
}

function isCursorOnCanvas(){
    return !(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height);
}

function clamp(num, _min, _max){
    return min(max(num, _min), _max);
}