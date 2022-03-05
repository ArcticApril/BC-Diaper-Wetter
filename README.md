# BC-Diaper-Wetter
A simply script that automatically wets the users diaper so long as one is worn (both chastity and clothes versions)

# How to use
To use, open up the developer console of your browser (for example in Chrome, press F12 or right click then select Inspect Element, then go to the "Console" tab) and copy the text from the BCDiaperWet.js file into the console, then press enter. If you are not also running the BCX mod, you may have to do this with the bcmodsdk.js file first.
Once you have done that, wear either a poofy or bulky diaper (either the panties or chastity version, or both if you want more potential uses!) and type `->diaper start` in chat. Once you're done using it, type `->diaper stop` to become contienent again.

## Aditional usage tips
`->diaper start` has several arguments! Here they are listed!
- `wetchance` controls how often you will wet. Takes a value between 0 and 1 (higher is more often). Default is 0.5
- `messchance` is similar, but for messing. Make sure this is lower than `wetchance`. Default is 0.3
- `desperation` sets your initial "desperation" level, which is normally controlled by having a milk bottle used on you. Range is between 0 and 3, default is 0.
- `regression` sets your initial "regression" level, which is normally controlled by wearing Nuersery Milk for an extended period of time. Range is between 0 and 3, default is 0.
- `wetpanties`/`messpanties`/`wetchastity`/`messchastity` each control how much both diapers are used. Ranges are from 0 to 2, defaults are all 0.
