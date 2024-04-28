/*
display()
displayON()
displayOFF()

realWindSymbolUpdate(direction=0,speed=0)

isValueNull(valueName,value)
chkTPV(tpvName)

bigBlock(block,bigStyleName)
updBottomMessages()

MOBalarm()
closebottomOnButtonMessage()
sendMOBtoServer(status=true)

bearing(latlng1, latlng2)
equirectangularDistance(from,to)

generateUUID()
getCookie(name)
*/
var bottomMessages = {};

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
        if (mobPosition && tpv.position) {
          // Update the distance to mob
          const mobDist = equirectangularDistance(
            tpv.position.value,
            mobPosition
          );
          // Distance to MOB in the lower left corner
          leftBottomBlock.style.display = "inherit";
          leftBottomBlock.innerHTML = `${mobDist.toFixed(
            displayData.mob.precision
          )}<span style="font-size:var(--ltl1-font-size);"><br>${dashboardMOBalarmTXT}, ${dashboardAlarmDistanceMesTXT}</span>`;
          leftBottomBlock.classList.add("leftBottomFrameBlinker");
        }
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
      case "track":
        compassMessage.style.display = "none";
        if (
          tpv.track &&
          tpv.track.value != null &&
          tpv.track.value != undefined
        ) {
          if (displayData.track.headingDirection) {
            center_icon.style.transform = `rotate(0deg)`;
          } else {
            if (
              tpv.heading &&
              tpv.heading.value != null &&
              tpv.heading.value != undefined
            ) {
              center_icon.style.transform = `rotate(${
                tpv.heading.value - tpv.track.value
              }deg)`;
            }
          }
          bottomMessages.track = `${
            displayData.track.label
          } ${tpv.track.value.toFixed(displayData.track.precision)}°`;
          updBottomMessages(); // Shows the lower message
        } else {
          center_icon.style.transform = `rotate(0deg)`;
          delete bottomMessages.heading;
          updBottomMessages(); // Shows the lower message
        }
        break;

      case "heading":
        if (
          tpv.heading &&
          tpv.heading.value != null &&
          tpv.heading.value != undefined
        ) {
          center_icon.style.display = "";
          if (displayData.heading.headingDirection) {
            if (
              tpv.heading &&
              tpv.heading.value != null &&
              tpv.heading.value != undefined
            ) {
              center_marc.style.transform = `rotate(${
                tpv.heading.value - tpv.track.value
              }deg)`;
            }
          }
          compassCard.style.transform = `rotate(${360 - tpv.heading.value}deg)`;
          topMessage.innerHTML = `${
            displayData.heading.label
          } ${tpv.heading.value.toFixed(displayData.heading.precision)}°`;
        }
        if (mobPosition && tpv.position) {
          const mobBearing = bearing(tpv.position.value, mobPosition);
          mobMark.style.display = "";
          mobMark.style.transform = `rotate(${mobBearing}deg)`;
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
            realWindSymbolViewUpdate(null);
            delete bottomMessages.wspeed;
            updBottomMessages(); // Shows the lower message
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
            bottomMessages.wspeed = `${
              displayData.wspeed.label
            } ${tpv.wspeed.value.toFixed(displayData.wspeed.precision)}`;
            updBottomMessages(); // Shows the lower message
          } else {
            realWindSymbolViewUpdate(null);
            delete bottomMessages.wspeed;
            updBottomMessages(); // Shows the lower message
          }
        }
        break;

      case "collisions":
        collisionArrows.innerHTML = "";
        rightBottomBlock.innerHTML = "";
        if (tpv.collisions && tpv.collisions.value) {
          let collisions = Object.entries(tpv.collisions.value.vessels).sort(
            function (a, b) {
              return a[1].dist - b[1].dist;
            }
          ); // Ride sorting, collisions - an array of arrays of two elements, the first is the former key, the second is the former value
          let minDist = Math.floor(collisions[0][1].dist + 1),
            maxDist,
            step;
          if (collisions.length > 1) {
            minDist = Math.floor(collisions[1][1].dist);
            maxDist = Math.floor(collisions[collisions.length - 1][1].dist) + 1;
            step = (maxDist - minDist) / 4;
          }
          let nearestDist = "";
          for (let collision of collisions) {
            const arrow = collisionArrow.cloneNode(true);
            arrow.id = collision[0];
            collisionArrows.appendChild(arrow);
            arrow.style.display = null;
            arrow.style.transform = `rotate(${collision[1].bearing}deg)`;

            if (collision[1].dist < minDist) {
              nearestDist = collision[1].dist;
            } else if (
              collision[1].dist > minDist &&
              collision[1].dist < minDist + step
            ) {
              arrow.style.width = "var(--collisionArrowWidthNormal)";
              arrow.style.left = "var(--collisionArrowLeftNormal)";
            } else if (
              collision[1].dist > minDist + step &&
              collision[1].dist < minDist + 2 * step
            ) {
              arrow.style.width = "var(--collisionArrowWidthSmall)";
              arrow.style.left = "var(--collisionArrowLeftSmall)";
            } else {
              arrow.style.width = "var(--collisionArrowWidthLitle)";
              arrow.style.left = "var(--collisionArrowLeftLitle)";
            }
          }

          // Distance to the immediate danger in the lower right corner
          rightBottomBlock.style.display = "inherit";
          rightBottomBlock.innerHTML = `${nearestDist.toFixed(
            displayData.collisions.precision
          )}<span style="font-size:var(--ltl1-font-size);"><br>${dashboardCollisionAlarmTXT}, ${dashboardAlarmDistanceMesTXT}</span>`;
          rightBottomBlock.classList.add("rightBottomFrameBlinker");
        } else {
          rightBottomBlock.classList.remove("rightBottomFrameBlinker");
        }
        break;

      case "mob":
        if (tpv.mob && tpv.mob.value) {
          // MOB mode is
          if (tpv.mob.value.position) {
            // This is Geojson, probably from Galadrielmap
            // look for a point indicated as current
            let point;
            for (point of tpv.mob.value.position.features) {
              // there are not only points, but also linestring
              if (
                point.geometry.type == "Point" &&
                point.properties &&
                point.properties.current
              ) {
                mobPosition = {
                  longitude: point.geometry.coordinates[0],
                  latitude: point.geometry.coordinates[1],
                };
                break;
              }
            }
            // But someone left can send Geojson without specifying the current point.Then the last will be the current one.
            if (!mobPosition)
              mobPosition = {
                longitude: point.geometry.coordinates[0],
                latitude: point.geometry.coordinates[1],
              };
          } else {
            const s = JSON.stringify(tpv.mob.value);
            if (s.includes("longitude") && s.includes("latitude")) {
              mobPosition = {
                longitude: tpv.mob.value.longitude,
                latitude: tpv.mob.value.latitude,
              };
            } else if (s.includes("lng") && s.includes("lat")) {
              mobPosition = {
                longitude: tpv.mob.value.lng,
                latitude: tpv.mob.value.lat,
              };
            } else if (s.includes("lon") && s.includes("lat")) {
              mobPosition = {
                longitude: tpv.mob.value.lon,
                latitude: tpv.mob.value.lat,
              };
            }
          }
        } else {
          // There is no MOB mode
          mobPosition = null;
          leftBottomBlock.innerHTML = "";
          leftBottomBlock.classList.remove("leftBottomFrameBlinker");
          mobMark.style.display = "none";
        }
        break;

      /* Drawing angles*/
      case "propRevolutions0":
      case "propRevolutions1":
        if (!displayData[tpvName].DOMid) break; // This parameter is requested, but should not be shown
        if (displayData[tpvName].DOMid == "leftBottomBlock" && mobPosition)
          break; // We will not draw in the lower left corner if the mode is mob
        if (
          displayData[tpvName].DOMid == "rightBottomBlock" &&
          tpv.collisions &&
          tpv.collisions.value
        )
          break; // We will not draw in the lower right corner if the danger of a collision

        htmlBLock = document.getElementById(displayData[tpvName].DOMid);
        if (!tpv[tpvName] || tpv[tpvName].value === undefined) {
          // Null - this engine is stopped.There could be a Display call for all values - for updating the screen
          htmlBLock.style.display = "none"; // To turn off events
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
        if (displayData[tpvName].DOMid == "leftBottomBlock" && mobPosition)
          break; // We will not draw in the lower left corner if the mode is mob
        if (
          displayData[tpvName].DOMid == "rightBottomBlock" &&
          tpv.collisions &&
          tpv.collisions.value
        )
          break; // We will not draw in the lower right corner if the danger of a collision

        htmlBLock = document.getElementById(displayData[tpvName].DOMid);
        if (!tpv[tpvName] || tpv[tpvName].value === undefined) {
          // There could be a Display call for all values - for updating the screen
          htmlBLock.style.display = "none"; // To turn off events
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
        if (displayData[tpvName].DOMid == "leftBottomBlock" && mobPosition)
          break; // We will not draw in the lower left corner if the mode is mob
        if (
          displayData[tpvName].DOMid == "rightBottomBlock" &&
          tpv.collisions &&
          tpv.collisions.value
        )
          break; // We will not draw in the lower right corner if the danger of a collision

        htmlBLock = document.getElementById(displayData[tpvName].DOMid);
        if (
          !tpv[tpvName] ||
          tpv[tpvName].value === null ||
          tpv[tpvName].value === undefined
        ) {
          // There could be a Display call for all values - for updating the screen
          htmlBLock.style.display = "none"; // To turn off events
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
    if (displayData.nextPoint.DOMid == "leftBottomBlock" && mobPosition) return; // We will not draw in the lower left corner if the mode is mob
    if (
      displayData.nextPoint.DOMid == "rightBottomBlock" &&
      tpv.collisions &&
      tpv.collisions.value
    )
      return; // We will not draw in the lower right corner if the danger of a clashя

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
  topMessage.style.display = "";
  bottomMessage.style.display = "";
  center_icon.style.display = "";

  compassMessage.style.display = "none";
} // end function displayON

function displayOFF() {
  /* turns off the display of ordinary screen elements, and turns on the message display */
  console.log("[displayOFF]");

  center_marc.style.display = "none";
  topMessage.style.display = "none";
  bottomMessage.style.display = "none";
  center_icon.style.display = "none";
  leftTopBlock.style.display = "none"; //To turn off events
  rightTopBlock.style.display = "none";
  rightBottomBlock.style.display = "none";
  leftBottomBlock.style.display = "none";

  compassMessage.innerHTML = `<span>${dashboardGNSSoldTXT}</span>`;
  compassMessage.style.display = "";
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

function MOBalarm() {
  if (tpv.mob && tpv.mob.value) {
    // MOB mode is
    bottomOnButtonMessage.innerHTML = `
	<br>
	<div class="messageButton" style="width: 60%;margin:1em 0;" onclick="sendMOBtoServer(true,tpv.mob.value.position);"><img src="img/mob.svg"> ${dashboardMOBbuttonAddTXT}</div>
	<div class="messageButton" style="width: 20%;" onclick="sendMOBtoServer(false);"> ✘ ${dashboardMOBbuttonCancelTXT}</div>
	`;
    bottomOnButtonMessage.style.display = "";
    document.body.addEventListener(
      "click",
      (event) => {
        closebottomOnButtonMessage();
      },
      { once: true }
    );
  } else {
    bottomOnButtonMessage.style.display = "none";
    sendMOBtoServer(true);
  }
} // end function MOBalarm

function closebottomOnButtonMessage() {
  bottomOnButtonMessage.style.display = "none";
} // end function closebottomOnButtonMessage

function sendMOBtoServer(status = true, mobMarkerJSON = null) {
  /* */
  if (typeof mobMarkerJSON == "string") {
    try {
      mobMarkerJSON = JSON.parse(mobMarkerJSON);
    } catch (error) {
      mobMarkerJSON = null;
    }
  }

  let delta;
  if (status) {
    // You need to open the "person overboard" mode
    // There are coordinates
    if (
      tpv.position &&
      tpv.position.value &&
      tpv.position.value.latitude &&
      tpv.position.value.longitude
    ) {
      if (mobMarkerJSON) {
        // Points, we must add
        // This is geojson, we believe that galadrielmap
        // For other options, forget the absence.Maybe one day....
        if (mobMarkerJSON.type == "FeatureCollection") {
          mobMarkerJSON.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                tpv.position.value.longitude,
                tpv.position.value.latitude,
              ],
            },
          });
        }
      } else {
        // The new single point
        mobMarkerJSON = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  tpv.position.value.longitude,
                  tpv.position.value.latitude,
                ],
              },
              properties: {
                current: true,
              },
            },
          ],
        };
      }
    }
    delta = {
      context: "vessels.self",
      updates: [
        {
          values: [
            {
              path: "notifications.mob",
              value: {
                method: ["visual", "sound"],
                state: "emergency",
                message: "A man overboard!",
                source: instanceSelf,
                position: mobMarkerJSON,
              },
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } else {
    delta = {
      context: "vessels.self",
      updates: [
        {
          values: [
            {
              path: "notifications.mob",
              value: null,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  if (socket.readyState == 1) {
    socket.send(JSON.stringify(delta));
  }
} // end function sendMOBtoServer

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

function updBottomMessages() {
  // In this cretinsky language, the empty object does not have a .keys () function, and if the Bottommessages is empty,
  // Bottommessages.keys () breaks off with Uncauret Typeerror: BottomMessages.keys Is Not a Function
  if (!Object.keys(bottomMessages).length) {
    bottomMessage.style.display = "none";
    return;
  }
  bottomMessage.innerHTML = "";
  for (let key in bottomMessages) {
    bottomMessage.innerHTML += " " + bottomMessages[key];
  }
  bottomMessage.style.display = "inherit";
} // end function updBottomMessages

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
