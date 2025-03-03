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

  useEffect(() => {
    document.querySelector('canvas').getContext('2d');
    init();
  }, []);

  /**
   * Method to set the canvas
   */
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

    img.onload = (ev) => {
      ctx.drawImage(img, 0, 0);
      let imgDataObj = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      data = imgDataObj.data;
      // canvas.addEventListener('mousemove', getPixel);]
      // canvas.addEventListener('click', addBox);
    };
  };

  /**
   * Method called to get pixela and set it
  */
  function getPixel(ev, xCordinate, yCordinate, element, boxPixelColor) {
    let cols = canvas?.width;
    let c = getPixelColor(cols, yCordinate + 15, xCordinate + 15);
    let clr = `rgb(${c.red}, ${c.green}, ${c.blue})`; 

    let pixelColor = document.getElementById(boxPixelColor);
    pixelColor.style.backgroundColor = clr;
    document.getElementById("text-" + boxPixelColor).innerText = c.red ? clr : "";
    document.getElementById(boxPixelColor).innerText = c.red ? clr : "";
    document.getElementById(boxPixelColor).style.color = c.red ? clr : "";
    document.getElementById(element).style.backgroundColor = clr;
  }

  function getPixelColor(cols, xCord, yCord)
  {
    let pixel = cols * xCord + yCord;
    let arrayPos = pixel * 4;
    return {
      red: data[arrayPos],
      green: data[arrayPos + 1],
      blue: data[arrayPos + 2],
      alpha: data[arrayPos + 3],
    };
  }

  /**
   * Method to handle when block has started moving
  */
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

      if ((aX > 0) && (aX < boun) && (aY > 0) && (aY < boun)) move(element, aX, aY, boxPixelColor);
    }

  }

  /**
   * Method to handle when block has stop moving
  */
  function stopMoving() {
    var a = document.createElement('script');
    document.onmousemove = function () { }
  }

  /**
   * Method to handle when block is moving
  */
  function move(divid, xpos, ypos, boxPixelColor) {
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
    setCurretCanvas(URL.createObjectURL(file));
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
              {/* Block for color code */}
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
        </a>
      </footer>
    </div>
  )
}
