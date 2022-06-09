import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from "react";
import { IMAGE1, IMAGE2, IMAGE3, IMAGE4 } from '../assets';
import { Input, Flex, Spacer, Grid, GridItem, Text, fontSize } from '@chakra-ui/react'

export default function Home() {
  const [currenCanvas, setCurretCanvas] = useState(IMAGE4.src);
  const [showCopied, setShowCopied] = useState(false);
  let canvas = null;
  let ctx = null;
  let data = [];
  let img = null;
  console.log(IMAGE1)
  useEffect(() => {
    console.log("ready");
    // var image = new Image();
    // image.src = IMAGE1;
    document.querySelector('canvas').getContext('2d');
    init();

  }, []);

  function init() {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 350;
    canvas.style.width = 350;
    canvas.height = 350;
    canvas.style.height = 350;
    canvas.style.objectFit = "cover"
    img = document.createElement('img');
    img.src = canvas.getAttribute('data-src');
    console.log("source supreem", canvas.getAttribute('data-src'));
    //once the image is loaded, add it to the canvas
    img.onload = (ev) => {
      ctx.drawImage(img, 0, 0);
      //call the context.getImageData method to get the array of [r,g,b,a] values
      let imgDataObj = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      data = imgDataObj.data; //data prop is an array
      // console.log(.data.length, 900 * 500 * 4); //  has 2,160,000 elements
      // canvas.addEventListener('mousemove', getPixel);
      // document.querySelector('img').addEventListener('mousemove', getPixel);
      // canvas.addEventListener('click', addBox);
    };
  };


  function getPixel(ev, a, b, element, boxPixelColor) {
    //as the mouse moves around the image
    // let canvas = ev.target;
    let cols = canvas?.width;
    // let rows = canvas.height;

    // let { offsetX, offsetY, clientY, clientX } = ev;

    //call the method to get the r,g,b,a values for current pixel
    // console.log("get pixel:", cols, ev, a, b);
    // ev.nativeEvent.offsetY, ev.nativeEvent.offsetX)
    // let c = getPixelColor(cols, ev.offsetY -32,  ev.offsetY-32);
    // let c = getPixelColor(cols, offsetY, offsetX);
    let c = getPixelColor(cols, b + 15, a + 15);


    //build a colour string for css
    let clr = `rgb(${c.red}, ${c.green}, ${c.blue})`; //${c.alpha / 255}
    // console.log(rgbToHex(rgbToHex));
    let pixelColor = document.getElementById(boxPixelColor);
    pixelColor.style.backgroundColor = clr;
    document.getElementById("text-" + boxPixelColor).innerText = c.red ? clr : "";
    document.getElementById(boxPixelColor).innerText = c.red ? clr : "";
    document.getElementById(boxPixelColor).style.color = c.red ? clr : "";
    document.getElementById(element).style.backgroundColor = clr;
    // console.log("color", clr)
    //save the string to use elsewhere
    // pixel = clr;
    //now get the average of the surrounding pixel colours
    // getAverage(ev);
  }

  function getAverage(ev) {
    // let canvas = ev.target;
    let cols = 350;
    let rows = 350;
    console.log("ctx", ctx);

    ctx.clearRect(0, 0, cols, rows);

    ctx.drawImage(img, 0, 0);
    let { offsetX, offsetY } = ev;
    const inset = 20;

    offsetX = Math.min(offsetX, cols - inset);
    offsetX = Math.max(inset, offsetX);
    offsetY = Math.min(offsetY, rows - inset);
    offsetY = Math.max(offsetY, inset);

    let reds = 0;
    let greens = 0;
    let blues = 0;

    for (let x = -1 * inset; x <= inset; x++) {
      for (let y = -1 * inset; y <= inset; y++) {
        let c = getPixelColor(cols, offsetY + y, offsetX + x);
        reds += c.red;
        greens += c.green;
        blues += c.blue;
      }
    }
    let nums = 41 * 41;
    let red = Math.round(reds / nums);
    let green = Math.round(greens / nums);
    let blue = Math.round(blues / nums);

    let clr = `rgb(${red}, ${green}, ${blue})`;


    ctx.fillStyle = clr;
    ctx.strokeStyle = '#FFFFFF';
    ctx.strokeWidth = 2;

    // average = clr;
    ctx.strokeRect(offsetX - inset, offsetY - inset, 41, 41);
    ctx.fillRect(offsetX - inset, offsetY - inset, 41, 41);
  }

  // function componentToHex(color) { 
  //   var hex = color.toString(16);
  //   console.log(hex)
  //   return hex.length == 1 ? "0" + hex : hex;
  // }

  // function rgbToHex(r, g, b) { 
  //   console.log(r,g,b)
  //   let gex = componentToHex(r) + componentToHex(g) + componentToHex(b);
  //   console.log("why "+gex ,  '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1))
  //   return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  // }
  function getPixelColor(cols, x, y) {
    //see grid.html as reference for this algorithm
    let pixel = cols * x + y;
    let arrayPos = pixel * 4;
    return {
      red: data[arrayPos],
      green: data[arrayPos + 1],
      blue: data[arrayPos + 2],
      alpha: data[arrayPos + 3],
    };
  }

  // function for mouse
  function startMoving(evt, element, boxPixelColor)
  {
    evt = evt || window.event;
    var posX = evt.clientX;
    var posY = evt.clientY;
    var a = document.getElementById(element);
    var divTop = a.style.top;
    var divLeft = a.style.left;

    divTop = divTop.replace('px', '');
    divLeft = divLeft.replace('px', '');
    var diffX = posX - divLeft;
    var diffY = posY - divTop;
    document.onmousemove = function (evt) {
      evt = evt || window.event;
      var posX = evt.clientX,
        posY = evt.clientY,
        aX = posX - diffX,
        aY = posY - diffY;
      var boun = document.getElementById("parent").offsetWidth - document.getElementById(element).offsetWidth;
      console.log((aX > 0) && (aX < boun) && (aY > 0) && (aY < boun), aX, boun, (aY > 0), (aY < boun));
      if ((aX > 0) && (aX < boun) && (aY > 0) && (aY < boun)) move(element, aX, aY, boxPixelColor);
    }

  }

  function stopMoving() {
    console.log("stop moving")
    var a = document.createElement('script');
    document.onmousemove = function () { }
  }

  function move(divid, xpos, ypos, boxPixelColor) {
    console.log('move');
    var a = document.getElementById(divid);
    document.getElementById(divid).style.left = xpos + 'px';
    document.getElementById(divid).style.top = ypos + 'px';
    getPixel(undefined, xpos, ypos, divid, boxPixelColor);
  }

  useEffect(() => {
    init();
  }, [currenCanvas]);

  /**
   * The method is for handling and setting image on the canvas.
   * @param (file) type 
   */
  const UploadCanvasFileHandler = (file) => {
    console.log(file, canvas, ctx, currenCanvas, URL.createObjectURL(file));
    // const [currenCanvas, setCurretCanvas] = useState(IMAGE4.src);

    setCurretCanvas(URL.createObjectURL(file));
    // init();
    // const image = document.createElement('img');
    // image.src = file;
    // image.onload = () => {
    // 	ctx.drawImage(image, 0, 0, 350, 350)
    // }
    // var fileReader = new FileReader();
    // fileReader.onload = (ev) => {
    // 	// ctx.drawImage(img, 0, 0);
    // 	//call the context.getImageData method to get the array of [r,g,b,a] values
    // 	var newImage = new Image();
    // 	newImage.src = e.target.result;
    // 	newImage.onload = function () {
    // 		ctx.drawImage(0, 0, canvas.width, canvas.height);
    // 	}
    // 	fileReader.readAsDataURL(file);

    // 	// data = imgDataObj.data; 

    // }
  }

  const urlClickHandler = (data) => {
    navigator.clipboard.writeText(data);
    setShowCopied(true);
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next </title>
        <meta name="description" content="Generated by create next " />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={styles.main}>
        <Text fontSize='50px' as="i">
          Welcome to Color Extractor
        </Text>


        <Flex flexWrap="wrap" gap="20px" width="100%" justifyContent="center" bg="gray.100" p={5} >

          <Flex alignItems="center" flexWrap="wrap">
            <Flex direction="column" justifyContent="center" alignItems="start" gap="20px">
              <Text fontSize='30px' as="b">
                Upload Image
              </Text>
              <Input placeholder='Basic usage' type="file" accept='.png, .jpg, .jpeg'
                onChange={(event) => {
                  UploadCanvasFileHandler(event.target.files[0]);
                }} />
              
              <Text fontSize='20px' as="b">
                Copy the color by clicking on box!
              </Text>
            </Flex>
            <Flex justifyContent="center" alignItems="center" direction="column" bg="gray.50" >
              <span className='canvas-container' id='parent'>
                <canvas data-src={currenCanvas}></canvas>
                <div className='all-element' id="elem" onMouseDown={(event) => startMoving(event, "elem", "pixelColor")}
                  onMouseUp={() => stopMoving()}></div>
                <div className='all-element' id="elem1" onMouseDown={(event) => startMoving(event, "elem1", "pixelColor1")}
                  onMouseUp={() => stopMoving()}></div>
                <div className='all-element' id="elem2" onMouseDown={(event) => startMoving(event, "elem2", "pixelColor2")}
                  onMouseUp={() => stopMoving()}></div>
                <div className='all-element' id="elem3" onMouseDown={(event) => startMoving(event, "elem3", "pixelColor3")}
                  onMouseUp={() => stopMoving()}></div>
                <div className='all-element' id="elem4" onMouseDown={(event) => startMoving(event, "elem4", "pixelColor4")}
                  onMouseUp={() => stopMoving()}></div>
              </span>
              <Flex position="relative">
                <Flex direction="column">
                  <span className="box" id="pixelColor" data-label="" onClick={(e)=>urlClickHandler(e.target.outerText)}></span>
                  <p id="text-pixelColor" className='text'></p>
                </Flex>
                <Flex direction="column">
                  <span className="box" id="pixelColor1" data-label="" onClick={(e) => urlClickHandler(e.target.outerText)}></span>
                <p id="text-pixelColor1" className='text'></p>
                </Flex>
                <Flex direction="column">
                  <span className="box" id="pixelColor2" data-label="" onClick={(e) => urlClickHandler(e.target.outerText)}></span>
                <p id="text-pixelColor2" className='text'></p>
                </Flex>
                <Flex direction="column">
                  <span className="box" id="pixelColor3" data-label="" onClick={(e) => urlClickHandler(e.target.outerText)}></span>
                <p id="text-pixelColor3" className='text'></p>
                </Flex>
                <Flex direction="column">
                  <span className="box" id="pixelColor4" data-label="" onClick={(e) => urlClickHandler(e.target.outerText)}></span>
                <p id="text-pixelColor4" className='text'></p>
                </Flex>   
                {showCopied && <p className="copied-clipboard">Copied!</p>}
              </Flex>
            </Flex>

          </Flex>
        </Flex>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-&utm_medium=default-template&utm_campaign=create-next-"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by  {' '}
          <Text fontSize="20px" as="b">Tarun</Text>
          {/* <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span> */}
        </a>
      </footer>
    </div>
  )
}
