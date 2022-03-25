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
function manageRegression(_diaperTimerModifier = 1)
{
    if (checkForNurseryMilk() && BCDWVari?.regressionLevel < 3)
    {
        BCDWVari?.regressionLevel++;
    }
    else if (!checkForNurseryMilk() && BCDWVari?.regressionLevel > 0)
    {
        BCDWVari?.regressionLevel--;
    }

    return _diaperTimerModifier * Math.pow(2, BCDWVari?.regressionLevel);
}

// Sets the users desperationLevel to 3 when they are given a milk bottle
function setDesperation()
{
    BCDWVari?.desperationLevel = 3;
}

// Handles "desperateness" aka how recently a milk bottle was drunk
function manageDesperation(_diaperTimerModifier = 1)
{
    // If they don't have a milk bottle anymore
    if (!checkForMilk())
    {
        // Decrease desperationLevel to a minimum of zero if no milk is found
        BCDWVari?.desperationLevel = (BCDWVari?.desperationLevel != 0) ? BCDWVari?.desperationLevel - 1 : 0;
    }
    return _diaperTimerModifier * (BCDWVari?.desperationLevel+1);
}
