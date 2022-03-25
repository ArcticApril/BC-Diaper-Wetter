// Namespacing
var BCDWVari =
{
    // A simple table for the colors that the script will use.
    DiaperUseLevels:
    [
        ["#808080", "#97916A", "#8B8D41"],
        ["#877C6C", "#7E774E"],
        ["#4C3017"]
    ]
};

const BCDWCONST = 
{
    // Use messages table. Brought out here so it could be modified later in the GUI.
    DiaperUseMessages:
    {
        "MessInner": " has messed her inner diaper.",
        "MessInnerFully": " has fully messed her inner diaper.",
        "WetInner": " has wet her inner diaper.",
        "WetInnerFully": " has fully wet her inner diaper.",
        "MessOuter": " has messed her outer diaper.",
        "MessOuterFully": " has fully messed her outer diaper.",
        "WetOuter": " has wet her outer diaper.",
        "WetOuterFully": " has fully wet her outer diaper.",
        "MessOnly": " has messed her diaper.",
        "MessOnlyFully": " has fully messed her diaper.",
        "WetOnly": " has wet her diaper.",
        "WetOnlyFully": " has fully wet her diaper.",
        "ChangeDiaperInner": " has gotten a fresh inner diaper.",
        "ChangeDiaperOuter": " has gotten a fresh outer diaper.",
        "ChangeDiaperOnly": " has gotten a fresh diaper.",
        "ChangeDiaperBoth": " has gotten a fresh pair of diapers."
    },

    // Table to store all the defaul values for diaperWetter()
    diaperDefaultValues: 
    {
        messChance: .3,
        wetChance: .5,
        baseTimer: 30,
        regressionLevel: 0,
        desperationLevel: 0,
        messLevelInner: 0,
        wetLevelInner: 0,
        messLevelOuter: 0,
        wetLevelOuter: 0
    },

    diaperHelpMessages:
    {
        default: "Welcome to BCDW: Bondage Club Diaper Wetter! Where we make sure babies use their diapers!\nTo get started, use the ->diaper start to begin using your diaper and ->diaper stop to stop. You can also use ->diaper help <command> to get more information on any given command (for example, arguments!).\nIn order to get a fresh diaper, use the ->diaper change command (this can also be whispered to you so other can change your diaper!)",
        start: "->diaper start has several arguments! Here they are listed!\n-wetchance controls how often you will wet. Takes a value between 0 and 1 (higher is more often). Default is 0.5\n-messchance is similar, but for messing. Make sure this is lower than wetchance. Default is 0.3\n-desperation sets your initial “desperation” level, which is normally controlled by having a milk bottle used on you. Range is between 0 and 3, default is 0.\n-regression sets your initial “regression” level, which is normally controlled by wearing Nuersery Milk for an extended period of time. Range is between 0 and 3, default is 0.\n-wetpanties/messpanties/wetchastity/messchastity each control how much both diapers are used. Ranges are from 0 to 2, defaults are all 0.",
        change: "->diaper change can be used to give you or someone else a fresh diaper. To only change one diaper, add chastity or panties to the end to describe which you want to change. To change someone else, either whisper the command to them, or add their member number to the end of the command.",
        stop: "->diaper stop will instantly stop the script running. The same thing will happen if you go without a diaper for a period of time."
    }
};
