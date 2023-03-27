// ==UserScript==
// @name         BC Diaper Wetter - SageForce Fix
// @namespace    https://www.bondageprojects.com/
// @version      0.1.1
// @description  A simple script that will automatically make a baby use their diaper
// @author       Arctic Line
// @match https://bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.elementfx.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @match http://localhost:*/*
// @icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// @run-at document-end
// ==/UserScript==

setTimeout(
    function() {
        'use strict';

        let n = document.createElement("script");
        n.setAttribute("language", "JavaScript");
        n.setAttribute("crossorigin", "anonymous");
        n.setAttribute("src", "https://github.com/sageforce/BC-Diaper-Wetter/blob/sageforce-patch-1/bcdw-loader-general.js");
        n.onload = () => n.remove();
        document.head.appendChild(n);
    },
    2000
);
