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
            bcdwCommands(destutter(data?.Content).substring(9, data.Content.length), data.Sender);
        }
    }
}

// Command handler
function bcdwCommands(data, callerID)
{
    console.log(data);
    // Commands only the user can use
    if (callerID === Player.MemberNumber)
    {
        // Start the script
        if (data.startsWith("start"))
        {
            diaperWetter();
        }

        // End the script
        if (data.startsWith("stop"))
        {
            stopWetting();
        }
    }
}



// Initializer function
function diaperWetter()
{
    ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: "Say hello to the little baby " + Player.Name + "!"}]});
    // Initial clear. Only time "both" should be used for refreshDiaper.
    refreshDiaper("both");
    messThreshold = .7;             // 1-chance to mess
    wetThreshold = .5;              // 1-chance to wet
    diaperTimerBase = 30;           // The default amount of time between ticks in minutes
    regressionLevel = 0;            // Used for tracking how much the user has regressed (affects the timer)
    desperationLevel = 0;           // Used for tracking how recently a milk bottle has been used (affects the timer)
    

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
function refreshDiaper(diaper = "both")
{
    if (diaper === "both")
    {
        MessLevelPanties = 0;
        WetLevelPanties = 0;
        MessLevelChastity = 0;
        WetLevelChastity = 0;
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
    else if (diaper === "chastity")
    {
        MessLevelChastity = 0;
        WetLevelChastity = 0;
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
    else if (diaper === "panties")
    {
        MessLevelPanties = 0;
        WetLevelPanties = 0;
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
    if (checkForNurseryMilk() && regressionLevel < 6)
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
    if (testMess > messThreshold)
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
    else if (testMess > wetThreshold)
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
