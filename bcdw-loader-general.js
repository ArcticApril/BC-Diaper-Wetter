(function() {
    'use strict';

function loadComponent(url)
{
    return new Promise(function(resolve, reject)
    {
    console.log("Loading " + url);
        let script = document.createElement('script');
        script.setAttribute("language", "JavaScript");
        script.setAttribute("crossorigin", "anonymous");
        script.setAttribute("type", "module");
        script.src = url;
        script.async = false;
        script.onload = function()
        {
            resolve(url);
        }
        script.onerror = function() {
            reject(url);
        }
        document.body.appendChild(script);
        console.log("Loaded " + url);
    })
}

let scripts =
[
    "https://mrbakucamp.github.io/BC-Diaper-Wetter/BCDiaperWetter.js",
    "https://mrbakucamp.github.io/BC-Diaper-Wetter/bcdw-tables.js"
]

let promises = [];
scripts.forEach(function(url)
{
    promises.push(loadComponent(url));
});

console.log("Welcome to BCDW! To learn how to use the script, type ->diaper help in chat. More information can be found at https://mrbakucamp.github.io/BC-Diaper-Wetter/");

var bcdwIsLoaded = false;
Promise.all(promises).then(function()
{
    console.log("BCDW: All components loaded. You're ready to go (use your diaper)!");
    bcdwIsLoaded = true;
}).catch(function(script)
{
    console.log("BCDW: " + script + " failed to load.");
})
})();

// Start the script running once everything is loaded
function bcdwWaitForLoad()
{
    if (!bcdwIsLoaded)
    {
        console.log("BCDW: Waiting to load.");
        setTimeout(bcdwWaitForLoad, 500);
    }
    else
    {
        console.log("BCDW: Script armed!");
        bcdwonload();
    }
}
bcdwWaitForLoad();
