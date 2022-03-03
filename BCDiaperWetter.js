// A simple table for the colors that the script will use.
DiaperUseLevels = 
[
    ["#808080", "#97916A", "#8B8D41"],
    ["#877C6C", "#7E774E"],
    ["#4C3017"]
];

// Use messages table. Brought out here so it could be modified later in the GUI.
DiaperUseMessages =
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
};

// Table to store all the defaul values for diaperWetter()
const diaperDefaultValues = 
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
};

diaperLoop = null;         // Keeps a hold of the loop so it can be exited at any time easily

// Destutter speach. Needed for interations with other mods
function destutter(string)
{
    // Step over every character in the string
    for (var i = 0 ; i < string.length - 2 ; i++)
    {
        if (string.at(i+1) === "-" && string.at(i) === string.at(i+2))
        {
            console.log(string.at(i));
            string = string.substring(0, i) + string.substring(i+2, string.length);
        }
    }
  return string;
}

// Chat handeler
ServerSocket.on("ChatRoomMessage", bcdw);
function bcdw(data)
{
    // First, make sure there's actually something to read
    if (data)
    {
        // Check to see if a milk bottle is used on the user
        if (
            data.Type === "Action" &&
            data.Content === "ActionUse" &&
            data.Dictionary[1]?.Tag === "DestinationCharacter" &&
            data.Dictionary[1]?.MemberNumber === Player.MemberNumber &&
            data.Dictionary[2]?.AssetName === "MilkBottle"
        )
        {
            setDesperation();
        }

        // Starts the script running
        if 
        (
            destutter(data?.Content).startsWith("->diaper") &&
            (data.Type === "Chat" || data.Type === "Whisper")
        )
        {
            // Parse out data into a queue for easier processing
            chatCommand = data?.Content.split(" ");
            chatCommand.shift();

            // Send to command parser
            bcdwCommands(chatCommand.reverse(), data.Sender);
        }
    }
}

// Command handler
function bcdwCommands(chatCommand, callerID)
{
    // Commands only the user can use
    if (callerID === Player.MemberNumber)
    {
        // Start the script
        if (chatCommand[chatCommand.length-1] === "start")
        {
            // Check to see if other arguments have been passed as well (default regression level, desperation, or use levels)
            chatCommand.pop()

            // Parse arguments for command
            let commandArguments = ["WetChance", "MessChance", "Desperation", "Regression", "Timer", "WetPanties", "MessPanties", "WetChastity", "MessChastity"];
            let caughtArguments = {};
            while (commandArguments.includes(chatCommand[chatCommand.length-1]))
            {
                let tempVal = chatCommand.pop();
                switch (tempVal)
                {
                    case commandArguments[0]:
                        caughtArguments.wetChance = (isNaN(chatCommand[chatCommand.length-1])) ? diaperDefaultValues.wetChance : chatCommand[chatCommand.length-1];
                        break;
                    case commandArguments[1]:
                        caughtArguments.messChance = (isNaN(chatCommand[chatCommand.length-1])) ? diaperDefaultValues.messChance : chatCommand[chatCommand.length-1];
                        break;
                    case commandArguments[2]:
                        caughtArguments.desperationLevel = (isNaN(chatCommand[chatCommand.length-1])) ? diaperDefaultValues.desperationLevel : chatCommand[chatCommand.length-1];
                        break;
                    case commandArguments[3]:
                        caughtArguments.regressionLevel = (isNaN(chatCommand[chatCommand.length-1])) ? diaperDefaultValues.regressionLevel : chatCommand[chatCommand.length-1];
                        break;
                    case commandArguments[4]:
                        caughtArguments.baseTimer = (isNaN(chatCommand[chatCommand.length-1])) ? diaperDefaultValues.baseTimer : chatCommand[chatCommand.length-1];
                        break;
                    case commandArguments[5]:
                        caughtArguments.wetLevelInner = (isNaN(chatCommand[chatCommand.length-1])) ? diaperDefaultValues.wetLevelInner : chatCommand[chatCommand.length-1];
                        break;
                    case commandArguments[6]:
                        caughtArguments.messLevelInner = (isNaN(chatCommand[chatCommand.length-1])) ? diaperDefaultValues.messLevelInner : chatCommand[chatCommand.length-1];
                        break;
                    case commandArguments[7]:
                        caughtArguments.wetLevelOuter = (isNaN(chatCommand[chatCommand.length-1])) ? diaperDefaultValues.wetLevelOuter : chatCommand[chatCommand.length-1];
                        break;
                    case commandArguments[8]:
                        caughtArguments.messLevelOuter = (isNaN(chatCommand[chatCommand.length-1])) ? diaperDefaultValues.messLevelOuter : chatCommand[chatCommand.length-1];
                        break;
                }
                chatCommand.pop();
            }

            console.log(caughtArguments);
            diaperWetter(caughtArguments);
        }

        // End the script
        else if (chatCommand[chatCommand.length-1] === "stop")
        {
            stopWetting();
        }
    }

    // If the user is called out
    else if (data.startsWith(toString(Player.MemberNumber)))
    {
        // Clip off the memeber number
        data = data.substring(toString(Player.MemberNumber).length + 1, data.length);

        if (data.startsWith("change"))
        {
            if (data.substring(7, data.length).startsWith("inner"))
            {
                refreshDiaper("panites");
            }
            else if (data.substring(7, data.length).startsWith("outer"))
            {
                refreshDiaper("chastity");
            }
            else
            {
                refreshDiaper();
            }
        }
    }
}

// Initializer function
function diaperWetter( args =
    {
        messChance: diaperDefaultValues.messChance,
        wetChance: diaperDefaultValues.wetChance,
        baseTimer: diaperDefaultValues.baseTimer,
        regressionLevel: diaperDefaultValues.regressionLevel,
        desperationLevel: diaperDefaultValues.desperationLevel,
        messLevelInner: diaperDefaultValues.messLevelInner,
        wetLevelInner: diaperDefaultValues.wetLevelInner,
        messLevelOuter: diaperDefaultValues.messLevelOuter,
        wetLevelOuter: diaperDefaultValues.wetLevelOuter
    }
)
{
    // Greating message
    ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: "Say hello to the little baby " + Player.Name + "!"}]});

    // Initial clear. Only time "both" should be used for refreshDiaper.
    refreshDiaper(
    {
        _diaper: "both",
        _wetLevelChastity: (args.wetLevelOuter < 0 || args.wetLevelOuter > 2) ? diaperDefaultValues.wetLevelOuter : (args.wetLevelOuter > args.messLevelOuter) ? args.wetLevelOuter : args.messLevelOuter,
        _messLevelChastity: (args.messLevelOuter < 0 || args.messLevelOuter > 2) ? diaperDefaultValues.messLevelOuter : args.messLevelOuter,
        _wetLevelPanties: (args.wetLevelInner < 0 || args.wetLevelInner > 2) ? diaperDefaultValues.wetLevelInner : (args.wetLevelInner > args.messLevelInner) ? args.wetLevelInner : args.messLevelInner,
        _messLevelPanties: (args.messLevelInner < 0 || args.messLevelInner > 2) ? diaperDefaultValues.messLevelInner : args.messLevelInner
    });

    messChance = args.messChance;
    wetChance = args.wetChance;
    diaperTimerBase = args.baseTimer;   // The default amount of time between ticks in minutes
    regressionLevel = args.regressionLevel;// Used for tracking how much the user has regressed (affects the timer)
    desperationLevel = args.desperationLevel;// Used for tracking how recently a milk bottle has been used (affects the timer)
    

    // Handle modifiers
    var diaperTimerModifier = 1;    // We will divide by the modifier (positive modifiers decrease the timer)
    diaperTimerModifier = manageRegression(diaperTimerModifier);
    diaperTimerModifier = manageDesperation(diaperTimerModifier);
    diaperTimer = diaperTimerBase / diaperTimerModifier;

    // Go into main loop
    diaperRunning = true;           // Helps with the kill switch
    checkTick();
}

// Changes how long it takes between ticks (in minutes)
function changeDiaperTimer(delay)
{
    // Bound the delay to between 2 minutes and 1 hour
    if (delay < 2) { delay = 2; }
    else if (delay > 60) { delay = 60; }

    diaperTimerBase = delay;        // Updates diaperTimerBase
}

// Refresh the diaper settings so wet and mess levels are 0. Pass "chastity", "panties", or "both" so only the correct diaper gets reset.
function refreshDiaper({_diaper, _wetLevelPanties, _messLevelPanties, _wetLevelChastity, _messLevelChastity} =
    {
        _diaper: "both",
        _wetLevelPanties: diaperDefaultValues.wetLevelInner,
        _messLevelPanties: diaperDefaultValues.messLevelInner,
        _wetLevelChastity: diaperDefaultValues.wetLevelOuter,
        _messLevelChastity: diaperDefaultValues.messLevelOuter,
    }
)
{
    if (_diaper === "both")
    {
        MessLevelPanties = _messLevelPanties;
        WetLevelPanties = _wetLevelPanties;
        MessLevelChastity = _messLevelChastity;
        WetLevelChastity = _wetLevelChastity;
        changeDiaperColor("ItemPelvis");
        changeDiaperColor("Panties");
        if (checkForDiaper("Panties") && checkForDiaper("ItemPelvis"))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["ChangeDiaperBoth"]}]});
        }
        else if ((checkForDiaper("Panties") && !checkForDiaper("ItemPelvis")) || (checkForDiaper("ItemPelvis") && !checkForDiaper("Panties")))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["ChangeDiaperOnly"]}]});
        }
    }
    else if (_diaper === "chastity")
    {
        MessLevelChastity = _messLevelChastity;
        WetLevelChastity = _wetLevelChastity;
        changeDiaperColor("ItemPelvis");
        if (checkForDiaper("ItemPelvis") && checkForDiaper("Panties"))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["ChangeDiaperOuter"]}]});
        }
        else if (checkForDiaper("ItemPelvis") && !checkForDiaper("Panties"))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["ChangeDiaperOnly"]}]});
        }
    }
    else if (_diaper === "panties")
    {
        MessLevelPanties = _messLevelPanties;
        WetLevelPanties = _wetLevelPanties;
        changeDiaperColor("Panties");
        if (checkForDiaper("ItemPelvis") && checkForDiaper("Panties"))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["ChangeDiaperOuter"]}]});
        }
        else if (checkForDiaper("Panties") && !checkForDiaper("ItemPelvis"))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["ChangeDiaperOnly"]}]});
        }
    }
}

// Check for if a diaper is in the Panties or ItemPelvies slot
function checkForDiaper(slot) 
{
    return InventoryGet(Player, slot)?.Asset?.Name === "PoofyDiaper" || InventoryGet(Player, slot)?.Asset?.Name === "BulkyDiaper";
}

// Checks to see if the user has a nursery milk equiped
function checkForNurseryMilk()
{
    return (InventoryGet(Player, "ItemMouth")?.Asset?.Name === "RegressedMilk") || (InventoryGet(Player, "ItemMouth2")?.Asset?.Name === "RegressedMilk") || (InventoryGet(Player, "ItemMouth3")?.Asset?.Name === "RegressedMilk");
}

// Checks for a normal milk bottle
function checkForMilk()
{
    return (InventoryGet(Player, "ItemMouth")?.Asset?.Name === "MilkBottle") || (InventoryGet(Player, "ItemMouth2")?.Asset?.Name === "MilkBottle") || (InventoryGet(Player, "ItemMouth3")?.Asset?.Name === "MilkBottle");
}

// Handles the regression counter
function manageRegression(diaperTimerModifier = 1)
{
    if (checkForNurseryMilk() && regressionLevel < 3)
    {
        regressionLevel++;
    }
    else if (!checkForNurseryMilk() && regressionLevel > 0)
    {
        regressionLevel--;
    }

    return diaperTimerModifier * Math.pow(2, regressionLevel);
}

// Sets the users desperationLevel to 3 when they are given a milk bottle
function setDesperation()
{
    desperationLevel = 3;
}

// Handles "desperateness" aka how recently a milk bottle was drunk
function manageDesperation(diaperTimerModifier = 1)
{
    // If they don't have a milk bottle anymore
    if (!checkForMilk())
    {
        // Decrease desperationLevel to a minimum of zero if no milk is found
        desperationLevel = (desperationLevel != 0) ? desperationLevel - 1 : 0;
    }
    return diaperTimerModifier * (desperationLevel+1);
}

// Updates the color of a diaper
function changeDiaperColor(slot)
{
    if (slot === "ItemPelvis" && checkForDiaper(slot))
    {
        InventoryWear(
            Player, 
            InventoryGet(Player, slot)?.Asset?.Name,
            slot,
            [
                InventoryGet(Player, slot)?.Color[0],
                DiaperUseLevels[MessLevelChastity][WetLevelChastity-MessLevelChastity],
                InventoryGet(Player, slot)?.Color[2],
                InventoryGet(Player, slot)?.Color[3]
            ],
            InventoryGet(Player, slot)?.Difficulty,
            Player.MemberNumber
        );
    }
    else if (slot === "Panties" && checkForDiaper(slot))
    {
        InventoryWear(
            Player, 
            InventoryGet(Player, slot)?.Asset?.Name,
            slot,
            [
                InventoryGet(Player, slot)?.Color[0],
                DiaperUseLevels[MessLevelPanties][WetLevelPanties-MessLevelPanties],
                InventoryGet(Player, slot)?.Color[2],
                InventoryGet(Player, slot)?.Color[3]
            ],
            InventoryGet(Player, slot)?.Difficulty,
            Player.MemberNumber
        );
    }
}

// Command to stop the script from running
function stopWetting()
{
    console.log("See you next time!");
    diaperRunning = false;
    clearTimeout(diaperLoop);
    checkTick();
}

// Funcky while loop
function checkTick()
{
    // Terminate loop if the user isn't wearing a compatible diaper
    if((checkForDiaper("ItemPelvis") || checkForDiaper("Panties")) && diaperRunning === true)
    {
        // Wait for a bit
        diaperLoop = setTimeout(checkTick, diaperTimer*60*1000);
        // Go to main logic
        diaperTick();
    }
    else
    {
        diaperRunning = false;
        ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: "Awww, " + Player.Name + " is all grown up!"}]});
    }
}

// Body function
// If the baby uses their diaper, it will make the front of their diaper look like it's been used
function diaperTick()
{
    // Handle modifiers
    var diaperTimerModifier = 1;    // We will divide by the modifier (positive modifiers decrease the timer)
    diaperTimerModifier = manageRegression(diaperTimerModifier);
    diaperTimerModifier = manageDesperation(diaperTimerModifier);
    diaperTimer = diaperTimerBase / diaperTimerModifier;

    testMess = Math.random();
    // If the baby messes, increment the mess level to a max of 2 and make sure that the wet level is at least as high as the mess level.
    if (testMess > 1-messChance)
    {
        if (MessLevelPanties === 2 || !checkForDiaper("Panties"))
        {
            MessLevelChastity = (MessLevelChastity < 2) ? MessLevelChastity + 1 : MessLevelChastity;
            WetLevelChastity = (WetLevelChastity < MessLevelChastity) ? MessLevelChastity : WetLevelChastity;
        }
        else if (checkForDiaper("Panties"))
        {
            MessLevelPanties = MessLevelPanties + 1;
            WetLevelPanties = (WetLevelPanties < MessLevelPanties) ? MessLevelPanties : WetLevelPanties;
        }

        // Display messages for when a diaper is messed.
        if ((MessLevelPanties === 2 && checkForDiaper("Panties") && !checkForDiaper("ItemPelvis")) || (MessLevelChastity === 2 && checkForDiaper("ItemPelvis") && !checkForDiaper("Panties")))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["MessOnlyFully"]}]});
        }
        else if ((checkForDiaper("Panties") && !checkForDiaper("ItemPelvis")) || (checkForDiaper("ItemPelvis") && !checkForDiaper("Panties")))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["MessOnly"]}]});
        }
        else if (MessLevelChastity === 0)
        {
            if (MessLevelPanties === 2)
            {
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["MessInnerFully"]}]});
            }
            else if (MessLevelPanties === 1)
            {
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["MessInner"]}]});
            }
        }
        else if (MessLevelChastity === 1)
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["MessOuter"]}]});
        }
        else if (MessLevelChastity === 2)
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["MessOuterFully"]}]});
        }
    }
    // If the baby only wets, increment the wet level to a max of 2.
    else if (testMess > 1-wetChance)
    {
        if (WetLevelPanties == 2 && (InventoryGet(Player, "Panties") !== "PoofyDiaper" && InventoryGet(Player, "Panties") !== "BulkyDiaper"))
        {
            WetLevelChastity = (WetLevelChastity < 2) ? WetLevelChastity + 1 : WetLevelChastity;
        }
        else
        {
            WetLevelPanties = WetLevelPanties + 1;
        }

        // Display messages for when a diaper is wet.
        if ((WetLevelPanties === 2 && checkForDiaper("Panties") && !checkForDiaper("ItemPelvis")) || (WetLevelChastity === 2 && checkForDiaper("ItemPelvis") && !checkForDiaper("Panties")))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["MessOnlyFully"]}]});
        }
        else if ((checkForDiaper("Panties") && !checkForDiaper("ItemPelvis")) || (checkForDiaper("ItemPelvis") && !checkForDiaper("Panties")))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["WetOnly"]}]});
        }
        else if (WetLevelChastity === 0)
        {
            if (WetLevelPanties === 2)
            {
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["WetInnerFully"]}]});
            }
            else if (WetLevelPanties === 1)
            {
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["WetInner"]}]});
            }
        }
        else if (WetLevelChastity === 1)
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["WetOuter"]}]});
        }
        else if (WetLevelChastity === 2)
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + DiaperUseMessages["WetOuterFully"]}]});
        }
    }
    // Don't update the color when it's not needed.
    else
    {
        return;
    }

    // Update color based on the DiaperUseLevels table.
    changeDiaperColor("ItemPelvis");
    changeDiaperColor("Panties");
    ChatRoomCharacterUpdate(Player); 
}
