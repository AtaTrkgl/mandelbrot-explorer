
let iterationsSlider;
let iterApplyButton;
let iterations = 50;

let lowResButton;
let highResButton;

let zoom = 300;
let origin = [0, 0];

let pixelSkipCount = 9;

function setup() 
{
	createCanvas(displayWidth - 20, displayHeight - 200);
    background(0);
    pixelDensity(1);
    frameRate(60);

    iterationsSlider = createSlider(5, 300, iterations, 1);
    iterApplyButton = createButton("Apply Iterations");
    iterApplyButton.mousePressed(applyIterations);

    highResButton = createButton("High Res");
    highResButton.mousePressed(() => {pixelSkipCount = 1; drawMandelbrot();});
    lowResButton = createButton("Low Res");
    lowResButton.mousePressed(() => {pixelSkipCount = 9; drawMandelbrot();});

    drawMandelbrot();
}

function applyIterations(){
    iterations = iterationsSlider.value();
    drawMandelbrot();
}

function iterateNumber(real, imag){
    let c = new Complex(real, imag);
    let z = new Complex(0, 0);
    for (let i = 0; i < iterations; i++) {
        z = Complex.add(Complex.multiply(z, z), c);
        if (abs(z.re) + abs(z.im) > 10){
            return i/iterations * 255 * 3;
        }
    }

    return 0;
}

function drawMandelbrot(){
    background(0);
    loadPixels();

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++){
            let i = (y * width + x) * 4;
            if (x % pixelSkipCount == 0 && y % pixelSkipCount == 0){
                coords = pixelToCoords([x, y]);
                let iteratedColor = iterateNumber(coords[0], coords[1]);

                pixels[i + 0] = clamp(iteratedColor - 255 * 2, 0 ,255);
                pixels[i + 1] = clamp(iteratedColor - 255 * 1, 0 ,255);
                pixels[i + 2] = clamp(iteratedColor, 0 ,255);
                pixels[i + 3] = 255;
            }else{
                yToCopy = y - (y % pixelSkipCount);
                xToCopy = x - (x % pixelSkipCount);
                let iToCopy = (yToCopy * width + xToCopy) * 4;

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


    drawMandelbrot();
}

function mouseClicked() {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

    let mousePos = [mouseX, mouseY];
    let mouseCoords = pixelToCoords(mousePos);
    origin = mouseCoords;

    drawMandelbrot();
}

function clamp(num, _min, _max){
    return min(max(num, _min), _max);
}