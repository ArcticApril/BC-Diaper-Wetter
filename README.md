# BC-Diaper-Wetter
A simply script that automatically wets the users diaper so long as one is worn (both chastity and clothes versions)

# How to use
To download, [either add this to your bookmarks and open it when you open the game]{https://mrbakucamp.github.io/BC-Diaper-Wetter/bcdw-loader-bookmark.js} or [add this]{https://mrbakucamp.github.io/BC-Diaper-Wetter/bcdw-loader-tampermonkey.js} as a [Tampermonkey]{https://www.tampermonkey.net/} script.
Once you have done that, wear either a poofy or bulky diaper (either the panties or chastity version, or both if you want more potential uses!) and run diaperWetter() in the console to start the script running.

After the script is running, you can force a "tick" of the script with the diaperTick() function, reset the state with refreshDiaper() (You can also do with with each slot individually with refreshDiaper("chastity") or refreshDiaper("panties").), and stop the script from running either with the stopWetting() function or by removing any bulky or poofy diaper and letting the script tick.
