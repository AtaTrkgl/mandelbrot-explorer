
let iterationsSlider;
let sliderLastVal;
let zoom = 300;
let origin = [.2, .3];

let pixelSkipCount = 0;
let timeSinceZoom = 0;

function setup() 
{
	createCanvas(800, 800);
    background(0);
    pixelDensity(1);
    frameRate(60);

    iterationsSlider = createSlider(5, 100, 30, 1);

    drawMandelbrot();
}

function draw()
{
    timeSinceZoom += deltaTime / 1000;
    if (sliderLastVal != iterationsSlider.value())
        drawMandelbrot();

    sliderLastVal = iterationsSlider.value();
    if (timeSinceZoom > 5 && pixelSkipCount != 0)
    {
        pixelSkipCount = 0;
        drawMandelbrot();
    }
    else if (timeSinceZoom < 5 && pixelSkipCount == 0)
        pixelSkipCount = 7;
}

function iterateNumber(real, imag){
    let c = new Complex(real, imag);
    let z = new Complex(0, 0);
    for (let i = 0; i < iterationsSlider.value(); i++) {
        z = Complex.add(Complex.multiply(z, z), c);
        if (abs(z.re) + abs(z.im) > 10){
            return i/iterationsSlider.value() * 255 * 3;
        }
    }

    return 0;
}

function drawMandelbrot(){
    background(0);
    loadPixels();

    for (var y = 0; y < height; y+=1 + pixelSkipCount) {
        for (var x = 0; x < width; x+=1 + pixelSkipCount){
            coords = pixelToCoords([x, y]);
            let iteratedColor = iterateNumber(coords[0], coords[1]);
            let i = (y * width + x) * 4;
            
            pixels[i + 0] = clamp(iteratedColor - 255 * 2, 0 ,255);
            pixels[i + 1] = clamp(iteratedColor - 255 * 1, 0 ,255);
            pixels[i + 2] = clamp(iteratedColor, 0 ,255);
            pixels[i + 3] = 255;
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
    zoom -= event.delta * 10;
    if (zoom < 100) zoom = 100;

    // By changing the origin by the position delta of the cursor
    // we can keep the mouse position still while zooming.
    let mousePos = [mouseX, mouseY];
    lastPos = pixelToCoords(mousePos, prevZoom);
    currentPos = pixelToCoords(mousePos, zoom);

    origin[0] -= currentPos[0] - lastPos[0];
    origin[1] -= currentPos[1] - lastPos[1];


    timeSinceZoom = 0;
    drawMandelbrot();
}

function clamp(num, _min, _max){
    return min(max(num, _min), _max);
}