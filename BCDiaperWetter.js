
// Initializer function
function diaperWetter()
{
    // Greating message
    ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: "Say hello to the little baby " + Player.Name + "!"}]});

    // Initial clear.
    refreshDiaper(
    {
        cdiaper: "both",
        inMessLevelChastity: (BCDWVari?.MessLevelChastity < 0 || BCDWVari?.MessLevelChastity > 2) ? 
            BCDWCONST?.diaperDefaultValues.messLevelOuter : 
            BCDWVari?.MessLevelChastity,
        inWetLevelChastity: (BCDWVari?.WetLevelChastity < 0 || BCDWVari?.WetLevelChastity > 2) ? 
            ((BCDWVari?.MessLevelChastity < 0 || BCDWVari?.MessLevelChastity > 2) ? 
                BCDWCONST?.diaperDefaultValues.messLevelOuter : 
                BCDWVari?.MessLevelChastity
            ) : 
            ((BCDWVari?.WetLevelChastity > BCDWVari?.MessLevelChastity) ? 
                BCDWVari?.WetLevelChastity : 
                ((BCDWVari?.MessLevelChastity < 0 || BCDWVari?.MessLevelChastity > 2) ? 
                    BCDWCONST?.diaperDefaultValues.messLevelOuter : 
                    BCDWVari?.MessLevelChastity
                )
            ),
        inMessLevelPanties: (BCDWVari?.MessLevelPanties < 0 || BCDWVari?.MessLevelPanties > 2) ? 
            BCDWCONST?.diaperDefaultValues.messLevelInner : 
            BCDWVari?.MessLevelPanties,
        inWetLevelPanties: (BCDWVari?.WetLevelPanties < 0 || BCDWVari?.WetLevelPanties > 2) ? 
            ((BCDWVari?.MessLevelPanties < 0 || BCDWVari?.MessLevelPanties > 2) ? 
                BCDWCONST?.diaperDefaultValues.messLevelInner : 
                BCDWVari?.MessLevelChastity
            ) : 
            ((BCDWVari?.WetLevelPanties > BCDWVari?.MessLevelPanties) ? 
                BCDWVari?.WetLevelPanties : 
                ((BCDWVari?.MessLevelPanties < 0 || BCDWVari?.MessLevelPanties > 2) ? 
                    BCDWCONST?.diaperDefaultValues.messLevelInner : 
                    BCDWVari?.MessLevelPanties
                )
            ),
    });

    // Handle modifiers
    BCDWVari?.diaperTimerModifier = 1;    // We will divide by the modifier (positive modifiers decrease the timer)
    BCDWVari?.diaperTimerModifier = manageRegression(diaperTimerModifier);
    BCDWVari?.diaperTimerModifier = manageDesperation(diaperTimerModifier);
    BCDWVari?.diaperTimer = diaperTimerBase / diaperTimerModifier;

    // Go into main loop
    BCDWVari?.diaperRunning = true;           // Helps with the kill switch
    checkTick();
}

// Changes how long it takes between ticks (in minutes)
function changeDiaperTimer(delay)
{
    // Bound the delay to between 2 minutes and 1 hour
    if (delay < 2) { delay = 2; }
    else if (delay > 60) { delay = 60; }

    BCDWVari?.diaperTimerBase = delay;        // Updates diaperTimerBase
}

// Refresh the diaper settings so wet and mess levels are 0. Pass "chastity", "panties", or "both" so only the correct diaper gets reset.
function refreshDiaper(
    {
        cdiaper = "both",
        inWetLevelPanties = BCDWCONST?.diaperDefaultValues.wetLevelInner,
        inMessLevelPanties =  BCDWCONST?.diaperDefaultValues.messLevelInner,
        inWetLevelChastity = BCDWCONST?.diaperDefaultValues.wetLevelOuter,
        inMessLevelChastity = BCDWCONST?.diaperDefaultValues.messLevelOuter,
    } = {}
)
{
    if (cdiaper === "both")
    {
        BCDWVari?.MessLevelPanties = inMessLevelPanties;
        BCDWVari?.WetLevelPanties = inWetLevelPanties;
        BCDWVari?.MessLevelChastity = inMessLevelChastity;
        BCDWVari?.WetLevelChastity = inWetLevelChastity;
        changeDiaperColor("ItemPelvis");
        changeDiaperColor("Panties");
        if (checkForDiaper("Panties") && checkForDiaper("ItemPelvis"))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["ChangeDiaperBoth"]}]});
        }
        else if ((checkForDiaper("Panties") && !checkForDiaper("ItemPelvis")) || (checkForDiaper("ItemPelvis") && !checkForDiaper("Panties")))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["ChangeDiaperOnly"]}]});
        }
    }
    else if (cdiaper === "chastity")
    {
        BCDWVari?.MessLevelChastity = inMessLevelChastity;
        BCDWVari?.WetLevelChastity = inWetLevelChastity;
        changeDiaperColor("ItemPelvis");
        if (checkForDiaper("ItemPelvis") && checkForDiaper("Panties"))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["ChangeDiaperOuter"]}]});
        }
        else if (checkForDiaper("ItemPelvis") && !checkForDiaper("Panties"))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["ChangeDiaperOnly"]}]});
        }
    }
    else if (cdiaper === "panties")
    {
        BCDWVari?.MessLevelPanties = inMessLevelPanties;
        BCDWVari?.WetLevelPanties = inWetLevelPanties;
        changeDiaperColor("Panties");
        if (checkForDiaper("ItemPelvis") && checkForDiaper("Panties"))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["ChangeDiaperOuter"]}]});
        }
        else if (checkForDiaper("Panties") && !checkForDiaper("ItemPelvis"))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["ChangeDiaperOnly"]}]});
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
                BCDWVari?.DiaperUseLevels[BCDWVari?.MessLevelChastity][BCDWVari?.WetLevelChastity-BCDWVari?.MessLevelChastity],
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
                BCDWVari?.DiaperUseLevels[MessLevelPanties][WetLevelPanties-MessLevelPanties],
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
    BCDWVari?.diaperRunning = false;
    clearTimeout(BCDWVari?.diaperLoop);
    checkTick();
}

// Funcky while loop
function checkTick()
{
    // Terminate loop if the user isn't wearing a compatible diaper
    if((checkForDiaper("ItemPelvis") || checkForDiaper("Panties")) && diaperRunning === true)
    {
        // Wait for a bit
        BCDWVari?.diaperLoop = setTimeout(checkTick, diaperTimer*60*1000);
        // Go to main logic
        diaperTick();
    }
    else
    {
        BCDWVari?.diaperRunning = false;
        ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: "Awww, " + Player.Name + " is all grown up!"}]});
    }
}

// Body function
// If the baby uses their diaper, it will make the front of their diaper look like it's been used
function diaperTick()
{
    // Handle modifiers
    BCDWVari?.diaperTimerModifier = 1;    // We will divide by the modifier (positive modifiers decrease the timer)
    BCDWVari?.diaperTimerModifier = manageRegression(diaperTimerModifier);
    BCDWVari?.diaperTimerModifier = manageDesperation(diaperTimerModifier);
    BCDWVari?.diaperTimer = diaperTimerBase / diaperTimerModifier;

    testMess = Math.random();
    // If the baby messes, increment the mess level to a max of 2 and make sure that the wet level is at least as high as the mess level.
    if (testMess > 1-messChance)
    {
        if (BCDWVari?.MessLevelPanties === 2 || !checkForDiaper("Panties"))
        {
            BCDWVari?.MessLevelChastity = (BCDWVari?.MessLevelChastity < 2) ? BCDWVari?.MessLevelChastity + 1 : BCDWVari?.MessLevelChastity;
            BCDWVari?.WetLevelChastity = (BCDWVari?.WetLevelChastity < BCDWVari?.MessLevelChastity) ? BCDWVari?.MessLevelChastity : BCDWVari?.WetLevelChastity;
        }
        else if (checkForDiaper("Panties"))
        {
            BCDWVari?.MessLevelPanties = BCDWVari?.MessLevelPanties + 1;
            BCDWVari?.WetLevelPanties = (BCDWVari?.WetLevelPanties < BCDWVari?.MessLevelPanties) ? BCDWVari?.MessLevelPanties : BCDWVari?.WetLevelPanties;
        }

        // Display messages for when a diaper is messed.
        if ((BCDWVari?.MessLevelPanties === 2 && checkForDiaper("Panties") && !checkForDiaper("ItemPelvis")) || (BCDWVari?.MessLevelChastity === 2 && checkForDiaper("ItemPelvis") && !checkForDiaper("Panties")))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["MessOnlyFully"]}]});
        }
        else if ((checkForDiaper("Panties") && !checkForDiaper("ItemPelvis")) || (checkForDiaper("ItemPelvis") && !checkForDiaper("Panties")))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["MessOnly"]}]});
        }
        else if (BCDWVari?.MessLevelChastity === 0)
        {
            if (BCDWVari?.MessLevelPanties === 2)
            {
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["MessInnerFully"]}]});
            }
            else if (BCDWVari?.MessLevelPanties === 1)
            {
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["MessInner"]}]});
            }
        }
        else if (BCDWVari?.MessLevelChastity === 1)
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["MessOuter"]}]});
        }
        else if (BCDWVari?.MessLevelChastity === 2)
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["MessOuterFully"]}]});
        }
    }
    // If the baby only wets, increment the wet level to a max of 2.
    else if (testMess > 1-BCDWVari?.wetChance)
    {
        if (BCDWVari?.WetLevelPanties == 2 && (InventoryGet(Player, "Panties") !== "PoofyDiaper" && InventoryGet(Player, "Panties") !== "BulkyDiaper"))
        {
            BCDWVari?.WetLevelChastity = (BCDWVari?.WetLevelChastity < 2) ? BCDWVari?.WetLevelChastity + 1 : BCDWVari?.WetLevelChastity;
        }
        else
        {
            BCDWVari?.WetLevelPanties = BCDWVari?.WetLevelPanties + 1;
        }

        // Display messages for when a diaper is wet.
        if ((BCDWVari?.WetLevelPanties === 2 && checkForDiaper("Panties") && !checkForDiaper("ItemPelvis")) || (BCDWVari?.WetLevelChastity === 2 && checkForDiaper("ItemPelvis") && !checkForDiaper("Panties")))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["MessOnlyFully"]}]});
        }
        else if ((checkForDiaper("Panties") && !checkForDiaper("ItemPelvis")) || (checkForDiaper("ItemPelvis") && !checkForDiaper("Panties")))
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["WetOnly"]}]});
        }
        else if (BCDWVari?.WetLevelChastity === 0)
        {
            if (BCDWVari?.WetLevelPanties === 2)
            {
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["WetInnerFully"]}]});
            }
            else if (BCDWVari?.WetLevelPanties === 1)
            {
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["WetInner"]}]});
            }
        }
        else if (BCDWVari?.WetLevelChastity === 1)
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["WetOuter"]}]});
        }
        else if (BCDWVari?.WetLevelChastity === 2)
        {
            ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + BCDWCONST?.DiaperUseMessages["WetOuterFully"]}]});
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
