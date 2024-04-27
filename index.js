module.exports = function (app) {
  /**/

  var plugin = {};
  var versionTXT = "";

  plugin.id = "e-inkDashboardExtended";
  plugin.name = "e-inkDashboardExtended";
  plugin.description =
    "Dashboard for modern powerful JavaScript-enabled e-ink devices with some Signal K instruments";

  plugin.schema = {
    title: "e-inkDashboardExtended",
    type: "object",
    description: "",
    properties: {
      trackProp: {
        title: "Direction",
        description: "",
        type: "object",
        properties: {
          feature: {
            type: "string",
            title: "Will be displayed as Course:",
            enum: [
              "Course over ground (COG)",
              "Course over ground magnetic (CGM)",
              "Heading true (HT)",
              "Heading magnetic (HM)",
              "Heading compass (HC)",
            ],
            default: "Course over ground (COG)",
          },
          maxRefreshInterval: {
            type: "number",
            title: "The maximum frequency of Course refresh, sec",
            description: `Set this as quickly as your e-ink device may. If 0 -- 
					the data will be displayed as fast as they are received. If your device swamping this data flow -- 
					set this parameter to 0.5, 1 or 2 sec. Getting data seldom can be dangerous!
					`,
            default: 0,
          },
        },
      },
      wind: {
        title: "Wind",
        type: "object",
        properties: {
          direction: {
            title: "",
            type: "object",
            properties: {
              feature: {
                type: "string",
                title: "Will be displayed as Wind direction:",
                enum: [
                  "Apparent wind (AW)",
                  "True wind through water (TWA)",
                  "True wind (TW)",
                  "True wind magnetic (TWM)",
                  "True wind through ground (GWA)",
                  "none",
                ],
                default: "Apparent wind (AW)",
              },
              maxRefreshInterval: {
                type: "number",
                title: "The maximum frequency of Wind refresh, sec",
                description: `Set this as quickly as your e-ink device may. If 0 -- 
							the data will be displayed as fast as they are received. If your device swamping this data flow -- 
							set this parameter to 0.5, 1 or 2 sec. Getting data seldom can be dangerous!
							`,
                default: 0,
              },
            },
          },
        },
      },
      leftTopBlock: {
        title: "Left top value",
        type: "object",
        properties: {
          feature: {
            type: "string",
            title: "Will be displayed on the left top corner:",
            enum: [
              "Speed over ground (SOG)",
              "Speed through water (STW)",
              "Depth below surface (DBS)",
              "Depth below keel (DBK)",
              "Depth below transducer (DBT)",
              "Engine 1 revolutions",
              "Engine 1 temperature",
              "Engine 2 revolutions",
              "Engine 2 temperature",
              "Outside air temperature",
              "Outside air pressure",
              "Outside air relative humidity",
              "Water temperature",
              "Next navigated point",
              "Apparent wind speed (AWS)",
              "True wind speed (TWS)",
              "none",
            ],
            default: "Speed over ground (SOG)",
          },
          maxRefreshInterval: {
            type: "number",
            title: "The maximum frequency of value refresh, sec",
            description: `Set this as quickly as your e-ink device may. If 0 -- 
					the data will be displayed as fast as they are received. If your device swamping this data flow -- 
					set this parameter to 0.5, 1 or 2 sec. Getting data seldom can be dangerous!
					`,
            default: 0,
          },
        },
      },
      rightTopBlock: {
        title: "Right top value",
        type: "object",
        properties: {
          feature: {
            type: "string",
            title: "Will be displayed on the right top corner:",
            enum: [
              "Speed over ground (SOG)",
              "Speed through water (STW)",
              "Depth below surface (DBS)",
              "Depth below keel (DBK)",
              "Depth below transducer (DBT)",
              "Engine 1 revolutions",
              "Engine 1 temperature",
              "Engine 2 revolutions",
              "Engine 2 temperature",
              "Outside air temperature",
              "Outside air pressure",
              "Outside air relative humidity",
              "Water temperature",
              "Next navigated point",
              "Apparent wind speed (AWS)",
              "True wind speed (TWS)",
              "none",
            ],
            default: "Depth below transducer (DBT)",
          },
          maxRefreshInterval: {
            type: "number",
            title: "The maximum frequency of value refresh, sec",
            description: `Set this as quickly as your e-ink device may. If 0 -- 
					the data will be displayed as fast as they are received. If your device swamping this data flow -- 
					set this parameter to 0.5, 1 or 2 sec. Getting data seldom can be dangerous!
					`,
            default: 0,
          },
        },
      },
      leftBottomBlock: {
        title: "Left bottom value",
        type: "object",
        properties: {
          feature: {
            type: "string",
            title: "Will be displayed on the left bottom corner:",
            enum: [
              "Speed over ground (SOG)",
              "Speed through water (STW)",
              "Depth below surface (DBS)",
              "Depth below keel (DBK)",
              "Depth below transducer (DBT)",
              "Engine 1 revolutions",
              "Engine 1 temperature",
              "Engine 2 revolutions",
              "Engine 2 temperature",
              "Outside air temperature",
              "Outside air pressure",
              "Outside air relative humidity",
              "Water temperature",
              "Next navigated point",
              "Apparent wind speed (AWS)",
              "True wind speed (TWS)",
              "none",
            ],
            default: "Apparent wind speed (AWS)",
          },
          maxRefreshInterval: {
            type: "number",
            title: "The maximum frequency of value refresh, sec",
            description: `Set this as quickly as your e-ink device may. If 0 -- 
					the data will be displayed as fast as they are received. If your device swamping this data flow -- 
					set this parameter to 0.5, 1 or 2 sec. Getting data seldom can be dangerous!
					`,
            default: 0,
          },
        },
      },
      rightBottomBlock: {
        title: "Right bottom value",
        type: "object",
        properties: {
          feature: {
            type: "string",
            title: "Will be displayed on the right bottom corner:",
            enum: [
              "Speed over ground (SOG)",
              "Speed through water (STW)",
              "Depth below surface (DBS)",
              "Depth below keel (DBK)",
              "Depth below transducer (DBT)",
              "Engine 1 revolutions",
              "Engine 1 temperature",
              "Engine 2 revolutions",
              "Engine 2 temperature",
              "Outside air temperature",
              "Outside air pressure",
              "Outside air relative humidity",
              "Water temperature",
              "Next navigated point",
              "Apparent wind speed (AWS)",
              "True wind speed (TWS)",
              "none",
            ],
            default: "True wind speed (TWS)",
          },
          maxRefreshInterval: {
            type: "number",
            title: "The maximum frequency of value refresh, sec",
            description: `Set this as quickly as your e-ink device may. If 0 -- 
					the data will be displayed as fast as they are received. If your device swamping this data flow -- 
					set this parameter to 0.5, 1 or 2 sec. Getting data seldom can be dangerous!
					`,
            default: 0,
          },
        },
      },
    },
  };

  var unsubscribes = []; // an array of functions with a traditional name in which the functions that need to be performed when a plugin stop

  plugin.start = function (options, restartPlugin) {
    const fs = require("fs");

    const createOptionsCount = { count: 0, timeoutID: null }; // The counter of attempts to create a config in anticipation of the emergence of the path, and the ID of the Settimeout process
    const createOptionsCountLimit = 50; // The maximum number of attempts to create config.Apparently, it is necessary for it to try about five minutes?While everything is turned on while they start ...

    //app.debug('options:',options);
    /* Optionsjs is created as a line, because the names of the variables are indicated, as a result
<Script SRC = "Options.js"> </ Script> These names will be replaced by values.And if
form DisplayData as an object, and then json.stringife, then such a focus will not pass: it is impossible
To say that the line is removed without quotes.
Problem: The user can twice indicate one Options.However, Json.parse seems to be calm
To this, and appropriates the last meaning.This circumstance is used to show the waybill:
Once on the path navigation.course.nextpoint, we certainly subscribe to the label on the lap,
And then we subscribe, if indicated in the configuration - to show the distance to the point in the corner.
*/
    let optionsjs = ""; // Config, loaded by clients as <SCript SRC = "Options.js"> </ Script>
    createOptions(); // Actually the generation of config
    app.debug("Plugin started");
    // The substantial part ended on this, further - definitions of functions

    function createOptions() {
      /**/
      optionsjs = `// Automaticaly created file
const displayData = {
	'pluginStatus' : {	// The state of the server part
		'signalkPath': '${plugin.id}',
		'maxRefreshInterval': 0,
	},
`;
      /* Central circle, unconditional subscription */
      /* direction */
      // can only be chosen for Track, so there is only a track and there is no magtrack
      let headingDirection = "false";
      if (options.trackProp.feature.includes("COG")) {
        optionsjs += `
	'track' : {	// course over ground
		'signalkPath': 'navigation.courseOverGroundTrue',
		'label': dashboardCourseTXT,	
		'precision': 0,	
		'multiplicator': ${180 / Math.PI}, 	
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
		'headingDirection': ${headingDirection}
	},
	'heading' : {	// heading
		'signalkPath': 'navigation.headingTrue',
		'label': dashboardHeadingTXT,	
		'precision': 0,	
		'multiplicator': ${180 / Math.PI}, 	
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
		'headingDirection': ${headingDirection}
	},
`;
      } else if (options.trackProp.feature.includes("CGM")) {
        optionsjs += `
	'track' : {	// course over ground
		'signalkPath': 'navigation.courseOverGroundMagnetic',
		'label': dashboardMagCourseTXT,	
		'precision': 0,	
		'multiplicator': ${180 / Math.PI}, 	
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
		'headingDirection': ${headingDirection}
	},
	'heading' : {	// heading
		'signalkPath': 'navigation.headingMagnetic',
		'label': dashboardMagHeadingTXT,	
		'precision': 0,	
		'multiplicator': ${180 / Math.PI}, 	
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
		'headingDirection': ${headingDirection}
	},
`;
      } else if (options.trackProp.feature.includes("HT")) {
        headingDirection = "true";
        optionsjs += `
	'track' : {	// course over ground
		'signalkPath': 'navigation.courseOverGroundTrue',
		'label': dashboardCourseTXT,	
		'precision': 0,	
		'multiplicator': ${180 / Math.PI}, 	
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
		'headingDirection': ${headingDirection}
	},
	'heading' : {	// heading, курс
		'signalkPath': 'navigation.headingTrue',
		'label': dashboardHeadingTXT,	
		'precision': 0,	
		'multiplicator': ${180 / Math.PI}, 	
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
		'headingDirection': ${headingDirection}
	},
`;
      } else if (options.trackProp.feature.includes("HM")) {
        headingDirection = "true";
        optionsjs += `
	'track' : {	// course over ground
		'signalkPath': 'navigation.courseOverGroundMagnetic',
		'label': dashboardMagCourseTXT,	
		'precision': 0,	
		'multiplicator': ${180 / Math.PI}, 	
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
		'headingDirection': ${headingDirection}
	},
	'heading' : {	// heading
		'signalkPath': 'navigation.headingMagnetic',
		'label': dashboardMagHeadingTXT,	
		'precision': 0,	
		'multiplicator': ${180 / Math.PI}, 	
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
		'headingDirection': ${headingDirection}
	},
`;
      } else if (options.trackProp.feature.includes("HC")) {
        headingDirection = "true";
        optionsjs += `
	'track' : {	// course over ground
		'signalkPath': 'navigation.courseOverGroundMagnetic',
		'label': dashboardMagCourseTXT,	
		'precision': 0,	
		'multiplicator': ${180 / Math.PI}, 	
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
		'headingDirection': ${headingDirection}
	},
	'heading' : {	// heading
		'signalkPath': 'navigation.headingCompass',
		'label': dashboardCompassHeadingTXT',	
		'precision': 0,	
		'multiplicator': ${180 / Math.PI}, 	
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
		'headingDirection': ${headingDirection}
	},
`;
      }
      /* wind
 Only one option is shown
*/
      let trueWind = "false";
      if (options.wind.direction.feature.includes("AW")) {
        // Long wind
        optionsjs += `
	'wangle' : {
		'signalkPath': 'environment.wind.angleApparent',
		'label': '',
		'precision' : 0,
		'multiplicator' : ${180 / Math.PI},
		'maxRefreshInterval': ${options.wind.direction.maxRefreshInterval * 1000},
		'fresh': ${(2 + options.wind.direction.maxRefreshInterval) * 1000},
		'trueWind': ${trueWind}
	},
`;
        optionsjs += `
	'wspeed' : {
		'signalkPath': 'environment.wind.speedApparent',
		'label': dashboardWindSpeedTXT+', '+dashboardWindSpeedMesTXT+':',
		'precision' : 0,
		'multiplicator' : 1.94384,
		'maxRefreshInterval': ${options.wind.direction.maxRefreshInterval * 1000},
		'fresh': ${(2 + options.wind.direction.maxRefreshInterval) * 1000},
	},
`;
      } else if (options.wind.direction.feature.includes("(TW)")) {
        trueWind = "true";
        optionsjs += `
	'wangle' : {
		'signalkPath': 'environment.wind.directionTrue',	// The wind direction relative to true north
		'label': '',
		'precision' : 0,
		'multiplicator' : ${180 / Math.PI},
		'maxRefreshInterval': ${options.wind.direction.maxRefreshInterval * 1000},
		'fresh': ${(2 + options.wind.direction.maxRefreshInterval) * 1000},
		'trueWind': ${trueWind}
	},
`;
        optionsjs += `
	'wspeed' : {
		'signalkPath': 'environment.wind.speedTrue',	// Wind speed over water (as calculated from speedApparent and vessel's speed through water)
		'label': dashboardTrueWindSpeedTXT+', '+dashboardWindSpeedMesTXT+':',
		'precision' : 1,
		'multiplicator' : 1.94384,
		'maxRefreshInterval': ${options.wind.direction.maxRefreshInterval * 1000},
		'fresh': ${(2 + options.wind.direction.maxRefreshInterval) * 1000},
	},
`;
      } else if (options.wind.direction.feature.includes("TWM")) {
        // только если курс или путевой угол магнитный
        if (
          options.trackProp.feature.includes("CGM") ||
          options.trackProp.feature.includes(
            "HM" || options.trackProp.feature.includes("HC")
          )
        ) {
          trueWind = "true";
          optionsjs += `
	'wangle' : {
		'signalkPath': 'environment.wind.directionMagnetic',
		'label': '',
		'precision' : 0,
		'multiplicator' : ${180 / Math.PI},
		'maxRefreshInterval': ${options.wind.direction.maxRefreshInterval * 1000},
		'fresh': ${(2 + options.wind.direction.maxRefreshInterval) * 1000},
		'trueWind': ${trueWind}
	},
`;
          optionsjs += `
	'wspeed' : {
		'signalkPath': 'environment.wind.speedTrue',	// Wind speed over water (as calculated from speedApparent and vessel's speed through water)
		'label': dashboardTrueWindSpeedTXT+', '+dashboardWindSpeedMesTXT+':',
		'precision' : 1,
		'multiplicator' : 1.94384,
		'maxRefreshInterval': ${options.wind.direction.maxRefreshInterval * 1000},
		'fresh': ${(2 + options.wind.direction.maxRefreshInterval) * 1000},
	},
`;
        }
      } else if (options.wind.direction.feature.includes("GWA")) {
        // Apparently, this is the course angle of the true wind, calculated from the penniless at the true speed
        trueWind = "true";
        optionsjs += `
	'wangle' : {
		'signalkPath': 'environment.wind.angleTrueGround',
		'label': '',
		'precision' : 0,
		'multiplicator' : ${180 / Math.PI},
		'maxRefreshInterval': ${options.wind.direction.maxRefreshInterval * 1000},
		'fresh': ${(2 + options.wind.direction.maxRefreshInterval) * 1000},
		'trueWind': ${trueWind}
	},
`;
        optionsjs += `
	'wspeed' : {
		'signalkPath': 'environment.wind.speedOverGround',
		'label': dashboardTrueWindSpeedTXT+', '+dashboardWindSpeedMesTXT+':',
		'precision' : 0,
		'multiplicator' : 1.94384,
		'maxRefreshInterval': ${options.wind.direction.maxRefreshInterval * 1000},
		'fresh': ${(2 + options.wind.direction.maxRefreshInterval) * 1000},
	},
`;
      } else if (options.wind.direction.feature.includes("TWA")) {
        // And this is in speed by the lag
        trueWind = "true";
        optionsjs += `
	'wangle' : {
		'signalkPath': 'environment.wind.angleTrueWater',
		'label': '',
		'precision' : 0,
		'multiplicator' : ${180 / Math.PI},
		'maxRefreshInterval': ${options.wind.direction.maxRefreshInterval * 1000},
		'fresh': ${(2 + options.wind.direction.maxRefreshInterval) * 1000},
		'trueWind': ${trueWind}
	},
`;
        optionsjs += `
	'wspeed' : {
		'signalkPath': 'environment.wind.speedTrue',	// Wind speed over water (as calculated from speedApparent and vessel's speed through water)
		'label': dashboardTrueWindSpeedTXT+', '+dashboardWindSpeedMesTXT+':',
		'precision' : 1,
		'multiplicator' : 1.94384,
		'maxRefreshInterval': ${options.wind.direction.maxRefreshInterval * 1000},
		'fresh': ${(2 + options.wind.direction.maxRefreshInterval) * 1000},
	},
`;
      }

      /* Unconditional subscription */
      /* Own coordinates
required for the "person overboard" mode, since there is a message only when
Changing information about MOB, and not about your own relative to MOB, although there is such an opportunity.
I think not to flood correctly.But then here we need their coordinates.
Actually, they were needed to prevent clashes, but there the message is transmitted and
Each change in its own position, and I added a direction and range to the message
Addition to the coordinates of the target.
*/
      optionsjs += `
	'position' : {
		'signalkPath': 'navigation.position',
		'dataPaths': ['longitude','latitude'],	// если .value в delta не атомарное значение - пути от value до атомарных значений. Для проверки на null.
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
	},
`;
      /*Prevention of clashes, requires collision-deetector */;
      optionsjs += `
	'collisions' : {
		'signalkPath': 'notifications.danger.collision',
		'precision' : 0,
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${(5 + options.trackProp.maxRefreshInterval) * 1000},		
	},
`;
      /* Man overboard, requires Galadrielmap*/
      optionsjs += `
	'mob' : {
		'signalkPath': 'notifications.mob',
		'precision' : 0,
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
	},
`;
      /* The next traveling point on the circle */
      optionsjs += `
	'nextPoint' : {
		'signalkPath': 'navigation.course.nextPoint',
		'precision' : 0,
		'maxRefreshInterval': ${options.trackProp.maxRefreshInterval * 1000},
		'fresh': ${60 * 60 * 24 * 1000},
	},
`;

      /* Subscription if indicated in the plugin settings */
      /* Screen angles */
      /* Left top value */
      if (options.leftTopBlock.feature !== "none")
        buildOptions(options.leftTopBlock, "leftTopBlock");
      /* Right top value */
      if (options.rightTopBlock.feature !== "none")
        buildOptions(options.rightTopBlock, "rightTopBlock");
      /* Left bottom value */
      if (options.leftBottomBlock.feature !== "none")
        buildOptions(options.leftBottomBlock, "leftBottomBlock");
      /* Right bottom value */
      if (options.rightBottomBlock.feature !== "none")
        buildOptions(options.rightBottomBlock, "rightBottomBlock");

      // Close Json
      optionsjs += `
};
`;
      // Check if we have changed config
      let prevOptions = "";
      try {
        prevOptions = fs.readFileSync(__dirname + "/public/options.js", "utf8");
      } catch (err) {}
      if (optionsjs != prevOptions) {
        app.debug("Config updated", optionsjs.length, prevOptions.length);
        fs.writeFileSync(__dirname + "/public/options.js", optionsjs); // Record the config

        // We organize the service channel for messages to customers about the state of the server, where we inform the config has changed.
        const delta = {
          context: "vessels.self",
          updates: [
            {
              values: [
                {
                  path: plugin.id,
                  value: "configCreate",
                },
              ],
              source: { label: plugin.id },
              timestamp: new Date().toISOString(),
            },
          ],
        };
        app.handleMessage(plugin.id, delta);
      }

      // The last message should always be with "value": null, because it is sent to every new client
      // This does not help, because the client should receive a message about the config change, but he will not receive it, if not in touch.
      // For example, Signalk overloaded and config changed.The client turned off, and connects after time.
      // And the last message is empty.
      // In short, with the SIGNALK restart, all this mechanism with reloading the config does not work.
      // only with a change in the configuration of the plugin or detecting the path, when working signalk
      setImmediate(() => {
        // Launch in the next turnover
        const delta = {
          context: "vessels.self",
          updates: [
            {
              values: [
                {
                  path: plugin.id,
                  value: null,
                },
              ],
              source: { label: plugin.id },
              timestamp: new Date().toISOString(),
            },
          ],
        };
        app.handleMessage(plugin.id, delta);
      });
      //

      function buildOptions(option, DOMid = null) {
        /*prepares Optionsjs values for display in the corners of the screen */
        let propulsionPaths = [];

        if (option.feature.includes("SOG")) {
          /* speed */
          optionsjs += `
	'speed' : {
		'signalkPath': 'navigation.speedOverGround',
		'label': dashboardSpeedTXT+', '+dashboardSpeedMesTXT,
		'precision' : 1,
		'multiplicator' : 1.94384,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(3 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
        } else if (option.feature.includes("STW")) {
          optionsjs += `
	'speed' : {
		'signalkPath': 'navigation.speedThroughWater',
		'label': dashboardVaterSpeedTXT+', '+dashboardSpeedMesTXT,
		'precision' : 1,
		'multiplicator' : 1.94384,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(3 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
        } else if (option.feature.includes("DBS")) {
          // depth
          optionsjs += `
	'depth' : {
		'signalkPath': 'environment.depth.belowSurface',
		'label': dashboardDepthTXT+', '+dashboardDepthMesTXT,
		'precision' : 1,
		'multiplicator' : 1,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(2 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
        } else if (option.feature.includes("DBK")) {
          optionsjs += `
	'depth' : {
		'signalkPath': 'environment.depth.belowKeel',
		'label': dashboardKeelDepthTXT+', '+dashboardDepthMesTXT,
		'precision' : 1,
		'multiplicator' : 1,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(2 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
        } else if (option.feature.includes("DBT")) {
          optionsjs += `
	'depth' : {
		'signalkPath': 'environment.depth.belowTransducer',
		'label': dashboardTransDepthTXT+', '+dashboardDepthMesTXT,
		'precision' : 1,
		'multiplicator' : 1,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(2 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
        } else if (option.feature.includes("1 revolutions")) {
          /* engines */
          //setTimeout(()=>{app.debug('двигатель',app.getSelfPath('propulsion'))},3000);
          if (checkPropulsionPath() && propulsionPaths[0]) {
            // actually, it is always here by logic here, but for uniformity
            optionsjs += `
	'propRevolutions0' : {
		'signalkPath': '${propulsionPaths[0]}.revolutions',
		'label': dashboardPropRevolutionTXT+', '+dashboardPropRevolutionMesTXT,
		'precision' : 0,
		'multiplicator' : 60,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(2 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
          }
        } else if (option.feature.includes("1 temperature")) {
          // Temperature in Kelvin!!!
          if (checkPropulsionPath() && propulsionPaths[0]) {
            // actually, it is always here by logic here, but for uniformity
            optionsjs += `
	'propTemperature0' : {
		'signalkPath': '${propulsionPaths[0]}.temperature',
		'label': dashboardPropTemperatureTXT+', '+dashboardTemperatureMesTXT,
		'precision' : 0,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(5 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
          }
        } else if (option.feature.includes("2 revolutions")) {
          if (checkPropulsionPath() && propulsionPaths[1]) {
            optionsjs += `
	'propRevolutions1' : {
		'signalkPath': '${propulsionPaths[1]}.revolutions',
		'label': dashboardPropRevolutionTXT+', '+dashboardPropRevolutionMesTXT,
		'precision' : 0,
		'multiplicator' : 60,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(2 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
          }
        } else if (option.feature.includes("2 temperature")) {
          // Temperature in Kelvin!!!
          if (checkPropulsionPath() && propulsionPaths[1]) {
            optionsjs += `
	'propTemperature1' : {
		'signalkPath': '${propulsionPaths[1]}.temperature',
		'label': dashboardPropTemperatureTXT+', '+dashboardTemperatureMesTXT,
		'precision' : 0,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(5 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
          }
        } else if (option.feature.includes("air temperature")) {
          /* air temperature */
          // Temperature in Kelvin!!!
          optionsjs += `
	'airTemperature' : {
		'signalkPath': 'environment.outside.temperature',
		'label': dashboarAirTemperatureTXT+', '+dashboardTemperatureMesTXT,
		'precision' : 0,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(30 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
        } else if (option.feature.includes("air pressure")) {
          /* air pressure */
          optionsjs += `
	'airPressure' : {
		'signalkPath': 'environment.outside.pressure',
		'label': dashboardAirPressureTXT+', '+dashboardAirPressureMesTXT,
		'precision' : 0,
		'multiplicator' : 0.01,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(30 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
        } else if (option.feature.includes("humidity")) {
          /* humidity */
          optionsjs += `
	'airHumidity' : {
		'signalkPath': 'environment.outside.relativeHumidity',
		'label': dashboardAirHumidityTXT+', '+dashboardAirHumidityMesTXT,
		'precision' : 0,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(30 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
        } else if (option.feature.includes("ater temperature")) {
          /* water temperature*/
          optionsjs += `
	'waterTemperature' : {
		'signalkPath': 'environment.water.temperature',
		'label': dashboardWaterTemperatureTXT+', '+dashboardTemperatureMesTXT,
		'precision' : 0,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(30 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
        } else if (option.feature.includes("navigated point")) {
          /* The next track point is on a circle and in the corner */
          optionsjs += `
	'nextPoint' : {
		'signalkPath': 'navigation.course.nextPoint',
		'label': dashboardNextPointTXT,
		'precision' : 0,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${60 * 60 * 24 * 1000},
		"DOMid": "${DOMid}"
	},
`;
        } else if (option.feature.includes("TWS")) {
          /* speed */
          optionsjs += `
	'windSpeedTrue' : {
		'signalkPath': 'navigation.wind.speedTrue',
		'label': dashboardTrueWindSpeedTXT+', '+dashboardSpeedMesTXT,
		'precision' : 1,
		'multiplicator' : 1.94384,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(3 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
        } else if (option.feature.includes("AWS")) {
          /* speed */
          optionsjs += `
	'windSpeedApparent' : {
		'signalkPath': 'environment.wind.speedApparent ',
		'label': dashboardWindSpeedTXT+', '+dashboardSpeedMesTXT,
		'precision' : 1,
		'multiplicator' : 1.94384,
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(3 + option.maxRefreshInterval) * 1000},
		"DOMid": "${DOMid}"
	},
`;
        }

        if (propulsionPaths[0]) {
          optionsjs += `
	'propLabel0' : {
		'signalkPath': '${propulsionPaths[0]}.label',
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(10 + option.maxRefreshInterval) * 1000},
	},
`;
          optionsjs += `
	'propState0' : {
		'signalkPath': '${propulsionPaths[0]}.state',
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(10 + option.maxRefreshInterval) * 1000},
	},
`;
        }

        if (propulsionPaths[1]) {
          optionsjs += `
	'propLabel1' : {
		'signalkPath': '${propulsionPaths[1]}.label',
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(10 + option.maxRefreshInterval) * 1000},
	},
`;
          optionsjs += `
	'propState1' : {
		'signalkPath': '${propulsionPaths[1]}.state',
		'maxRefreshInterval': ${option.maxRefreshInterval * 1000},
		'fresh': ${(10 + option.maxRefreshInterval) * 1000},
	},
`;
        }

        function checkPropulsionPath() {
          if (!propulsionPaths.length) {
            // The function can be launched several times (once at each corner), and from the previous launch everything is already.
            const realPropulsionPath = app.getSelfPath("propulsion");
            if (!realPropulsionPath) {
              if (createOptionsCount.timeoutID) return false; // Waiting is already running
              // Launching the waiting for the emergence of the path
              let timeout = 2000;
              // First we will often try, then rarely
              if (createOptionsCount.count > 10) timeout = 10000;
              if (createOptionsCount.count > createOptionsCountLimit) {
                clearTimeout(createOptionsCount.timeoutID); // ну упс
                createOptionsCount.timeoutID = null;
              } else {
                createOptionsCount.timeoutID = setTimeout(() => {
                  createOptionsCount.timeoutID = null;
                  createOptions();
                }, timeout);
                createOptionsCount.count += 1;
                //createOptionsCount.timestamp = Date.now();
              }
              return false;
            }
            clearTimeout(createOptionsCount.timeoutID);
            createOptionsCount.timeoutID = null;
            for (const propID in realPropulsionPath) {
              propulsionPaths.push("propulsion." + propID);
            }
          }
          return true;
        } //			end function checkPropulsionPath
      } // 		end function buildOptions
    } //	end function createOptions
  }; // end function plugin.start

  plugin.stop = function () {
    // Here we put logic we need when the plugin stops
    app.debug("Plugin stopped");
    unsubscribes.forEach((f) => f());
    unsubscribes = [];
  }; // end function plugin.stop

  return plugin;
}; //end module.exports
