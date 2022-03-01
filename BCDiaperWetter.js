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
    "WetOnly": " has fully wet her diaper.",
    "ChangeDiaperInner": " has gotten a fresh inner diaper.",
    "ChangeDiaperOuter": " has gotten a fresh outer diaper.",
    "ChangeDiaperOnly": " has gotten a fresh diaper.",
    "ChangeDiaperBoth": " has gotten a fresh pair of diapers."
};

// Initializer function
function diaperWetter()
{
    ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: "Say hello to the little baby " + Player.Name + "!"}]});
    // Initial clear. Only time "both" should be used for refreshDiaper.
    refreshDiaper("both");
    messThreshold = .7;             // 1-chance to mess
    wetThreshold = .5;              // 1-chance to wet
    diaperTimerBase = 30*60*1000;   // The default amount of time between ticks
    diaperTimer = diaperTimerBase;  // The actual time between ticks (may be affected by)

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
    diaperRunning = false;
}

// Funcky while loop
function checkTick()
{
    // Terminate loop if the user isn't wearing a compatible diaper
    if((checkForDiaper("ItemPelvis") || checkForDiaper("Panties")) && diaperRunning === true)
    {
        // Wait for a bit
        setTimeout(checkTick, 30*60*1000);
        // Go to main logic
        diaperTick();
    } 
}

// Body function
// If the baby uses their diaper, it will make the front of their diaper look like it's been used
function diaperTick()
{
    // Automatically reset once the baby's diaper is changed (front color reset to #808080)
    // if ((InventoryGet(Player, "ItemPelvis").Color[1] === "#808080" && InventoryGet(Player, "Panties").Color[1] === "#808080") && (WetLevel > 0 || MessLevel > 0))
    // {
    //     WetLevel = 0;
    //     MessLevel = 0;
    // }

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
