/*
display()
displayON()
displayOFF()

realWindSymbolUpdate(direction=0,speed=0)

isValueNull(valueName,value)
chkTPV(tpvName)

bigBlock(block,bigStyleName)

bearing(latlng1, latlng2)
equirectangularDistance(from,to)

generateUUID()
getCookie(name)
*/

function display(changedTPV) {
  if (!changedTPV) changedTPV = Object.keys(displayData);

  for (let tpvName of changedTPV) {
    // It turns out that Case is not a block, and the variables declared inside CAS are visible in all Switch
    let str = "",
      htmlBLock;
    let strPropLabel = "",
      strPropVal = "";
    switch (tpvName) {
      case "pluginStatus":
        if (tpv.pluginStatus) {
          switch (tpv.pluginStatus.value) {
            case "configCreate":
            case "configChange":
              console.log(
                "Plugin reports that config changed, so window reload."
              );
              location.reload(true);
              break;
            default:
          }
        }
        break;

      case "position":
        if (
          tpv.nextPoint &&
          tpv.nextPoint.value &&
          tpv.nextPoint.value.position &&
          tpv.position
        ) {
          // Update the next track point
          displayNextPoint();
        }
        break;

      /* Circle drawing */
      case "heading":
        if (
          tpv.heading &&
          tpv.heading.value != null &&
          tpv.heading.value != undefined
        ) {
          center_icon.style.display = "";

          compassCard.style.transform = `rotate(${360 - tpv.heading.value}deg)`;
        } else {
          // You need to show the card, even if there is no direction, because the wind can be shown on it
          compassCard.style.transform = `rotate(0deg)`;
          center_icon.style.display = "none";
        }
        break;

      case "track":
        if (
          tpv.track &&
          tpv.track.value != null &&
          tpv.track.value != undefined
        ) {
          if (displayData.track.trackDirection) {
            center_marc_streak.style.transform = `rotate(0deg)`;
          } else {
            if (
              tpv.heading &&
              tpv.heading.value != null &&
              tpv.heading.value != undefined
            ) {
              center_marc_streak.style.transform = `rotate(${
                tpv.track.value - tpv.heading.value
              }deg)`;
            }
          }
        } else {
          center_icon.style.transform = `rotate(0deg)`;
        }
        break;

      case "wangle":
        if (
          tpv.wspeed &&
          tpv.wspeed.value != null &&
          tpv.wspeed.value != undefined
        ) {
          if (
            tpv.wangle &&
            tpv.wangle.value != null &&
            tpv.wangle.value != undefined
          ) {
            //windSVGimage.style.transform = `rotate(${tpv.wangle.value-90}deg)`;
            windSVGimage.setAttribute(
              "transform",
              `rotate(${tpv.wangle.value - 90})`
            );
          } else {
            realWindSymbolViewUpdate(0.1);
          }
        }
        break;

      case "wspeed":
        if (
          tpv.wangle &&
          tpv.wangle.value != null &&
          tpv.wangle.value != undefined
        ) {
          if (
            tpv.wspeed &&
            tpv.wspeed.value != null &&
            tpv.wspeed.value != undefined
          ) {
            realWindSymbolViewUpdate(tpv.wspeed.value);
          } else {
            realWindSymbolViewUpdate(0.1);
          }
        }
        break;

      /* Drawing angles*/
      case "propRevolutions0":
      case "propRevolutions1":
        if (!displayData[tpvName].DOMid) break; // This parameter is requested, but should not be shown

        htmlBLock = document.getElementById(displayData[tpvName].DOMid);
        if (!tpv[tpvName] || tpv[tpvName].value === undefined) {
          // Disabling the block is too stringent for some viewers
          // htmlBLock.style.display = "none"; 
          break;
        }

        if (tpvName[tpvName.length - 1] == "0") {
          if (!tpv.propLabel0 && !tpv.propState0) break; // There is no information about this engine
          if (tpv.propLabel0 && tpv.propLabel0.value)
            strPropLabel = `<span style="font-size:var(--ltl1-font-size);">${tpv.propLabel0.value}</span>`;
          if (tpv.propState0 && tpv.propState0.value == "stopped") {
            strPropVal = `<span style="font-size:calc(var(--font-size)*0.7);">${dashboardPropStopTXT}</span>`; // Why doesn't Var work here (-Small-Font-Size)?
          } else {
            strPropVal = tpv[tpvName].value.toFixed(
              displayData[tpvName].precision
            );
          }
        } else {
          if (!tpv.propLabel1 && !tpv.propState1) break; // There is no information about this engine
          if (tpv.propLabel1 && tpv.propLabel1.value)
            strPropLabel = `<span style="font-size:var(--ltl1-font-size);">${tpv.propLabel1.value}</span>`;
          if (tpv.propState1 && tpv.propState1.value == "stopped") {
            strPropVal = `<span style="font-size:calc(var(--font-size)*0.7);">${dashboardPropStopTXT}</span>`; // Why doesn't Var work here (-Small-Font-Size)?
          } else {
            strPropVal = tpv[tpvName].value.toFixed(
              displayData[tpvName].precision
            );
          }
        }

        if (displayData[tpvName].DOMid.includes("ottom")) {
          // It is indicated placed in the lower corners
          str +=
            strPropLabel +
            '<span style="font-size:var(--ltl1-font-size);"><br><br></span>'; // The human name of the engine from Signalk
          str += strPropVal;
          if (displayData[tpvName].label)
            str += `<span style="font-size:var(--ltl1-font-size);"><br>${displayData[tpvName].label}</span>`;
        } else {
          if (displayData[tpvName].label)
            str += `<span style="font-size:var(--ltl1-font-size);">${displayData[tpvName].label}<br><br></span>`;
          str += strPropVal;
          str +=
            '<span style="font-size:var(--ltl1-font-size);"><br><br></span>' +
            strPropLabel; // The human name of the engine from Signalk
        }
        htmlBLock.style.display = "inherit";
        htmlBLock.innerHTML = str;
        break;

      case "propTemperature0":

      case "propTemperature1":
        if (!displayData[tpvName].DOMid) break; // This parameter is requested, but should not be shown

        htmlBLock = document.getElementById(displayData[tpvName].DOMid);
        if (!tpv[tpvName] || tpv[tpvName].value === undefined) {
          // Disabling the block is too stringent for some viewers
          // htmlBLock.style.display = "none";
          break;
        }
        if (tpvName[tpvName.length - 1] == "0") {
          if (!tpv.propLabel0 && !tpv.propState0) break; // There is no information about this engine
          if (tpv.propLabel0 && tpv.propLabel0.value)
            strPropLabel = `<span style="font-size:var(--ltl1-font-size);">${tpv.propLabel0.value}</span>`;
          if (tpv.propState0 && tpv.propState0.value == "stopped") {
            strPropVal = "<br>&nbsp;";
          } else {
            strPropVal = (tpv.propTemperature0.value - 273.15).toFixed(
              displayData[tpvName].precision
            );
          }
        } else {
          if (!tpv.propLabel1 && !tpv.propState1) break; // There is no information about this engine
          if (tpv.propLabel1 && tpv.propLabel1.value)
            strPropLabel = `<span style="font-size:var(--ltl1-font-size);">${tpv.propLabel1.value}</span>`;
          if (tpv.propState1 && tpv.propState1.value == "stopped") {
            strPropVal = "<br>&nbsp;";
          } else {
            strPropVal = (tpv.propTemperature0.value - 273.15).toFixed(
              displayData[tpvName].precision
            );
          }
        }
        if (displayData[tpvName].DOMid.includes("ottom")) {
          // It is indicated placed in the lower corners
          str +=
            strPropLabel +
            '<span style="font-size:var(--ltl1-font-size);"><br><br></span>'; // The human name of the engine from Signalk
          str += strPropVal;
          if (displayData[tpvName].label)
            str += `<span style="font-size:var(--ltl1-font-size);"><br>${displayData[tpvName].label}</span>`;
        } else {
          if (displayData[tpvName].label)
            str += `<span style="font-size:var(--ltl1-font-size);">${displayData[tpvName].label}<br><br></span>`;
          str += strPropVal;
          str +=
            '<span style="font-size:var(--ltl1-font-size);"><br><br></span>' +
            strPropLabel; // The human name of the engine from Signalk
        }
        htmlBLock.style.display = "inherit";
        htmlBLock.innerHTML = str;
        break;

      case "nextPoint": // Here it is possible to draw corners, but the label on the circle is also drawn
        if (!tpv[tpvName] || !tpv[tpvName].value) {
          nextPointDirection.style.display = "none";
          if (displayData[tpvName].DOMid)
            document.getElementById(displayData[tpvName].DOMid).style.display =
              "none";
          break;
        }
        if (!tpv.position || !tpv.position.value) break; //If there are no coordinates, we cannot calculate the further
        displayNextPoint();
        break;

      case "speed":
      case "depth":
      case "airTemperature":
      case "airPressure":
      case "airHumidity":
      case "waterTemperature":
	    case "windSpeedTrue":
      case "windSpeedApparent":

      default:
        if (!displayData[tpvName].DOMid) break; // This parameter is requested, but should not be shown

        htmlBLock = document.getElementById(displayData[tpvName].DOMid);
        if (
          !tpv[tpvName] ||
          tpv[tpvName].value === null ||
          tpv[tpvName].value === undefined
        ) {
          // Disabling the block is too stringent for some viewers
          // htmlBLock.style.display = "none";
          break;
        }
        if (tpvName.includes("emperature")) tpv[tpvName].value -= 273.15; // To Temperates in Celsius
        if (displayData[tpvName].DOMid.includes("ottom")) {
          // It is indicated placed in the lower corners
          str += tpv[tpvName].value.toFixed(displayData[tpvName].precision);
          if (displayData[tpvName].label)
            str += `<span style="font-size:var(--ltl1-font-size);"><br>${displayData[tpvName].label}</span>`;
        } else {
          if (displayData[tpvName].label)
            str += `<span style="font-size:var(--ltl1-font-size);">${displayData[tpvName].label}<br><br></span>`;
          str += tpv[tpvName].value.toFixed(displayData[tpvName].precision);
        }
        htmlBLock.style.display = "inherit";
        htmlBLock.innerHTML = str;
        break;
    }
  }

  function displayNextPoint() {
    const azimuth = bearing(tpv.position.value, tpv.nextPoint.value.position);
    nextPointDirection.style.transform = `rotate(${azimuth}deg)`;
    nextPointDirection.style.display = "inherit";

    if (!displayData.nextPoint.DOMid) return; //This parameter is requested, but should not be shown

    let dist = equirectangularDistance(
      tpv.position.value,
      tpv.nextPoint.value.position
    );
    let mesTXT;
    if (dist > 1000) {
      dist = (dist / 1000).toFixed(displayData.nextPoint.precision + 1);
      mesTXT = dashboarNextPointMesKMTXT;
    } else {
      dist = dist.toFixed(displayData.nextPoint.precision);
      mesTXT = dashboarNextPointMesMTXT;
    }

    const htmlBLock = document.getElementById(displayData.nextPoint.DOMid);
    let str = "";
    if (displayData.nextPoint.DOMid.includes("ottom")) {
      // It is indicated placed in the lower corners
      str += dist;
      if (displayData.nextPoint.label)
        str += `<span style="font-size:var(--ltl1-font-size);"><br>${displayData.nextPoint.label}, ${mesTXT}</span>`;
    } else {
      if (displayData.nextPoint.label)
        str += `<span style="font-size:var(--ltl1-font-size);">${displayData.nextPoint.label}, ${mesTXT}<br><br></span>`;
      str += dist;
    }
    htmlBLock.style.display = "inherit";
    htmlBLock.innerHTML = str;
  } // 	end function displayNextPoint
} // end function display()

function displayON() {
  /* Includes the display of ordinary screen elements, and turns off the message display */
  console.log("[displayON]");

  center_marc.style.display = "";
  max_upwind_angle.style.display = "";
  center_icon.style.display = "";
} // end function displayON

function displayOFF() {
  /* turns off the display of ordinary screen elements, and turns on the message display */
  console.log("[displayOFF]");

  center_marc.style.display = "none";
  max_upwind_angle.style.display = "none";
  center_icon.style.display = "none";
  leftTopBlock.style.display = "none"; //To turn off events
  rightTopBlock.style.display = "none";
  rightBottomBlock.style.display = "none";
  leftBottomBlock.style.display = "none";
} // end function displayOFF

var oldWind = { w25cnt: null, w5cnt: null, w2dt5cnt: null, direction: null };

function realWindSymbolViewUpdate(speed = null) {
  /* Changes the appearance of the wind symbol from this wind speed.
But it does not turn.
*/
  // Symbol
  let windSVG = document.getElementById("windSVGimage");
  if (!windSVG) return; // The picture there somehow does not immediately appear
  let windMark = windSVG.getElementById("wMark");

  if (speed === null) {
    while (windMark.firstChild) {
      //Remove all symbols from the icon
      windMark.removeChild(windMark.firstChild);
    }
    return;
  }

  let posX = 0,
    stepX = hbl.x2.baseVal.value,
    stepY = bLine.points[2].y - bLine.points[1].y;
  posX += bLine.points[0].x;

  let w25cnt = Math.floor(speed / 25); // feather 25 m/s
  speed -= w25cnt * 25;
  if (w25cnt) w25cnt = 1; //One pen.We will not show fantastic speeds

  let w5cnt = Math.floor(speed / 5); // feathers 5 m/s
  speed -= w5cnt * 5;

  let w2dt5cnt = Math.floor((speed * 10) / 25);

  if (
    oldWind.w25cnt == w25cnt &&
    oldWind.w5cnt == w5cnt &&
    oldWind.w2dt5cnt == w2dt5cnt
  )
    return; // The view of the arrow has not changed

  oldWind.w25cnt = w25cnt;
  oldWind.w5cnt = w5cnt;
  oldWind.w2dt5cnt = w2dt5cnt;

  while (windMark.firstChild) {
    //Remove all symbols from the icon
    windMark.removeChild(windMark.firstChild);
  }
  // arrow
  windMark.appendChild(
    document.createElementNS("http://www.w3.org/2000/svg", "use")
  );
  windMark.lastChild.setAttribute("x", "0");
  windMark.lastChild.setAttribute("y", "0");
  windMark.lastChild.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "#bLine"
  );

  if (w2dt5cnt) {
    // половинное перо
    // We draw the upHalf penly, its length should be equal to W2DT5.POINTS [3] .X, but in this case we simply insert HBL
    windMark.appendChild(
      document.createElementNS("http://www.w3.org/2000/svg", "use")
    );
    windMark.lastChild.setAttribute("x", String(posX));
    windMark.lastChild.setAttribute("y", 0);
    windMark.lastChild.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "#hbl"
    );
    // We draw a feather
    windMark.appendChild(
      document.createElementNS("http://www.w3.org/2000/svg", "use")
    );
    windMark.lastChild.setAttribute("x", String(posX));
    windMark.lastChild.setAttribute("y", String(stepY));
    windMark.lastChild.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "#w2dt5"
    );
    posX += w2dt5.points[3].x;
    //We draw a continuation
    upHline(posX); // draw the upper connecting line, remember the new POSX do not need
    posX = downHline(posX); // draw the lower connecting line
  }

  for (let i = w5cnt; i--; ) {
    // We draw feathers 5 m/s
    // We draw the upper line
    windMark.appendChild(
      document.createElementNS("http://www.w3.org/2000/svg", "use")
    );
    windMark.lastChild.setAttribute("x", String(posX));
    windMark.lastChild.setAttribute("y", 0);
    windMark.lastChild.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "#hbl"
    );
    // We draw a feather
    windMark.appendChild(
      document.createElementNS("http://www.w3.org/2000/svg", "use")
    );
    windMark.lastChild.setAttribute("x", String(posX));
    windMark.lastChild.setAttribute("y", String(stepY));
    windMark.lastChild.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "#w5"
    );
    posX += w5.points[3].x;
    // We draw a continuation
    if (i != 0) {
      upHline(posX); // draw the upper connecting line, remember the new POSX do not need
      posX = downHline(posX); // draw the lower connecting line
    }
  }

  for (let i = w25cnt; i--; ) {
    // We draw feathers 25 m/s
    upHline(posX); // draw the upper connecting line, remember the new POSX do not need
    posX = downHline(posX); // draw the lower connecting line
    // We draw the top line it should be a length with width w25
    windMark.appendChild(
      document.createElementNS("http://www.w3.org/2000/svg", "line")
    );
    windMark.lastChild.setAttribute("x1", String(posX));
    windMark.lastChild.setAttribute("y1", 2);
    windMark.lastChild.setAttribute("x2", String(posX + w25.points[2].x));
    windMark.lastChild.setAttribute("y2", 2);
    // We draw a feather
    windMark.appendChild(
      document.createElementNS("http://www.w3.org/2000/svg", "use")
    );
    windMark.lastChild.setAttribute("x", String(posX));
    windMark.lastChild.setAttribute("y", String(stepY));
    windMark.lastChild.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "#w25"
    );
    posX += w25.points[2].x;
  }

  // draw the final vertical line
  windMark.appendChild(
    document.createElementNS("http://www.w3.org/2000/svg", "use")
  );
  windMark.lastChild.setAttribute("x", String(posX));
  windMark.lastChild.setAttribute("y", 0);
  windMark.lastChild.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "#vbl"
  );

  function upHline(posX) {
    for (let i = 2; i--; ) {
      windMark.appendChild(
        document.createElementNS("http://www.w3.org/2000/svg", "use")
      );
      windMark.lastChild.setAttribute("x", String(posX));
      windMark.lastChild.setAttribute("y", 0);
      windMark.lastChild.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        "#hbl"
      );
      posX += hbl.x2.baseVal.value;
    }
    return posX;
  } //end function upHline
  function downHline(posX) {
    for (let i = 2; i--; ) {
      windMark.appendChild(
        document.createElementNS("http://www.w3.org/2000/svg", "use")
      );
      windMark.lastChild.setAttribute("x", String(posX));
      windMark.lastChild.setAttribute(
        "y",
        String(bLine.points[2].y - bLine.points[1].y)
      );
      windMark.lastChild.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        "#hbl"
      );
      posX += hbl.x2.baseVal.value;
    }
    return posX;
  } //end function downHline
} // end function realWindSymbolUpdate

function closebottomOnButtonMessage() {
  bottomOnButtonMessage.style.display = "none";
} // end function closebottomOnButtonMessage

var zerotonull = {};
function isValueNull(valueName, value) {
  /* Should Valuename be considered equivalent to the zero value
	Returns True if Valuename was 0 Isnullcount once in a row */
  /*
	This task comes down to a counter that increases with each next call of the function,
	And often it is given as an example of the use of "closure" in JavaScript.However, it is easy to see
	that a straightforward solution to the problem is better to use "close" for the following reasons:
	1) With a normal solution, two global named entities are required: a variable for storage
	counter and function for their processing.
	When solving a “close”, a function is required - a generator and one function for each meter.
	2) the normal solution will be the same for all programming languages in general, and the solution with
	"Closing" unique for JavaScript and causes bewilderment.
	*/
  let isNullCount = 10;

  if (typeof value != "number") return false;
  if (!zerotonull[valueName]) zerotonull[valueName] = 0;
  if (value === 0) zerotonull[valueName] += 1; // Strictly zero?
  else zerotonull[valueName] = 0;
  if (zerotonull[valueName] >= isNullCount) {
    zerotonull[valueName] = isNullCount;
    return true;
  }
  return false;
} // end function isValueNull

function chkTPV(tpvName, checksTPV) {
  /* Checks whether TPVNAME*/
  if (!displayData[tpvName].fresh) return; // If there is no expiration date, the data is always fresh
  if (
    tpv[tpvName] &&
    Date.now() - tpv[tpvName].timestamp > displayData[tpvName].fresh
  ) {
    console.log(
      "Property",
      tpvName,
      "is",
      (Date.now() - tpv[tpvName].timestamp) / 1000,
      "sec. old, but should be no more than",
      displayData[tpvName].fresh / 1000,
      "sec."
    );
    delete tpv[tpvName]; //
    display([tpvName]);
    clearInterval(checksTPV[tpvName]);
    delete checksTPV[tpvName];
  }
} // end function chkTPV

function bigBlock(block, bigStyleName) {
  /**/
  block.classList.toggle(bigStyleName);
  if (
    leftTopBlock.classList.contains("leftTopBlockBig") ||
    rightTopBlock.classList.contains("rightTopBlockBig") ||
    leftBottomBlock.classList.contains("leftBottomBlockBig") ||
    rightBottomBlock.classList.contains("rightBottomBlockBig")
  )
    compass.classList.add("opa");
  else compass.classList.remove("opa");
} // end function bigBlock


function bearing(latlng1, latlng2) {
  /* Returns azimuth from point 1 to point 2 */
  const rad = Math.PI / 180;
  let lat1, lat2, lon1, lon2;
  if (latlng1.lat) lat1 = latlng1.lat * rad;
  else lat1 = latlng1.latitude * rad;
  if (latlng2.lat) lat2 = latlng2.lat * rad;
  else lat2 = latlng2.latitude * rad;
  if (latlng1.lng) lon1 = latlng1.lng * rad;
  else if (latlng1.lon) lon1 = latlng1.lon * rad;
  else lon1 = latlng1.longitude * rad;
  if (latlng2.lng) lon2 = latlng2.lng * rad;
  else if (latlng2.lon) lon2 = latlng2.lon * rad;
  else lon2 = latlng2.longitude * rad;

  let y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  let x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  let bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  if (bearing >= 360) bearing = bearing - 360;

  return bearing;
} // end function bearing

function equirectangularDistance(from, to) {
  // https://www.movable-type.co.uk/scripts/latlong.html
  // from,to: {longitude: xx, latitude: xx}
  const rad = Math.PI / 180;
  const φ1 = from.latitude * rad;
  const φ2 = to.latitude * rad;
  const Δλ = (to.longitude - from.longitude) * rad;
  const R = 6371e3; // метров
  const x = Δλ * Math.cos((φ1 + φ2) / 2);
  const y = φ2 - φ1;
  const d = Math.sqrt(x * x + y * y) * R; // метров
  return d;
} // end function equirectangularDistance

function generateUUID() {
  // Public Domain/MIT https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
  // I do not care about their thoughts about "unsafe", for they are outside the context
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
} // end function generateUUID

function getCookie(name) {
  // Returns cookie with the name NAME, if not, if not, then undefined
  name = name.trim();
  var matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : null;
} // end function getCookie
