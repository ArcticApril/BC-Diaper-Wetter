# BC-Diaper-Wetter
A simply script that automatically wets the users diaper so long as one is worn (both chastity and clothes versions)

# How to use
To use, open up the developer console of your browser (for example in Chrome, press F12 or right click then select Inspect Element, then go to the "Console" tab) and copy the text from the BCDiaperWet.js file into the console, then press enter. If you are not also running the BCX mod, you may have to do this with the bcmodsdk.js file first.
Once you have done that, wear either a poofy or bulky diaper (either the panties or chastity version, or both if you want more potential uses!) and run diaperWetter() in the console to start the script running.

After the script is running, you can force a "tick" of the script with the diaperTick() function, reset the state with refreshDiaper() (You can also do with with each slot individually with refreshDiaper("chastity") or refreshDiaper("panties").), and stop the script from running either with the stopWetting() function or by removing any bulky or poofy diaper and letting the script tick.
