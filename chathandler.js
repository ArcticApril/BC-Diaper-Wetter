// Start listening for chat inputs
function bcdwStartListening()
{
    try
    {
        ServerSocket.on("ChatRoomMessage", bcdw);
    }
    catch(error)
    {
        setTimeout(bcdwStartListening, 500);
    }
}

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
            let chatCommand = data?.Content.toLowerCase().split(" ");
            chatCommand.shift();

            // Send to command parser
            bcdwCommands(chatCommand.reverse(), data.Sender, data.Type);
        }
    }
}

// Command handler
function bcdwCommands(chatCommand, callerID, type)
{
    console.log("BCDW caught command");
    console.log(chatCommand);
    // Commands only the user can use
    if (callerID === Player.MemberNumber)
    {
        // Start the script
        if (chatCommand[chatCommand.length-1] === "start")
        {
            // Check to see if other arguments have been passed as well (default regression level, desperation, or use levels)
            chatCommand.pop()

            // Parse arguments for command
            let commandArguments = ["wetchance", "messchance", "desperation", "regression", "timer", "wetpanties", "messpanties", "wetchastity", "messchastity"];
            while (commandArguments.includes(chatCommand[chatCommand.length-1]))
            {
                let tempVal = chatCommand.pop();
                if (!isNaN(chatCommand[chatCommand.length-1]))
                {
                    switch (tempVal)
                    {
                        case commandArguments[0]:
                            BCDWVari.wetChance = chatCommand[chatCommand.length-1];
                            break;
                        case commandArguments[1]:
                            BCDWVari.messChance = chatCommand[chatCommand.length-1];
                            break;
                        case commandArguments[2]:
                            BCDWVari.desperationLevel = chatCommand[chatCommand.length-1];
                            break;
                        case commandArguments[3]:
                            BCDWVari.regressionLevel = chatCommand[chatCommand.length-1];
                            break;
                        case commandArguments[4]:
                            BCDWVari.diaperTimerBase = chatCommand[chatCommand.length-1];
                            break;
                        case commandArguments[5]:
                            BCDWVari.WetLevelPanties = chatCommand[chatCommand.length-1];
                            break;
                        case commandArguments[6]:
                            BCDWVari.MessLevelPanties = chatCommand[chatCommand.length-1];
                            break;
                        case commandArguments[7]:
                            BCDWVari.WetLevelChastity = chatCommand[chatCommand.length-1];
                            break;
                        case commandArguments[8]:
                            BCDWVari.MessLevelChastity = chatCommand[chatCommand.length-1];
                            break;
                    }
                }
                chatCommand.pop();
            }
            diaperWetter();
        }

        // End the script
        else if (chatCommand[chatCommand.length-1] === "stop")
        {
            stopWetting();
        }
    }
    // Chat commands that can be executed by other people
    {
        // Filter to make sure the command is targeted at the user
        if (chatCommand[chatCommand.length-2] === Player.MemberNumber || type === "Whisper" || callerID === Player.MemberNumber)
        {
            // Change into a fresh diaper
            if (chatCommand[chatCommand.length-1] === "change")
            {
                chatCommand.pop();

                // Get rid of the member number in case that was passed
                if (chatCommand[chatCommand.length-1] === Player.MemberNumber)
                {
                    chatCommand.pop();
                }

                // See if you should be changing both or just one of the diaper (and which one, of course)
                if (chatCommand[chatCommand.length-1] === "panties")
                {
                    if (!checkForDiaper("panties"))
                    {
                        ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + " doesn't have a diaper there!"}]});
                    }
                    else
                    {
                        refreshDiaper({cdiaper: "panties"});
                    }
                }
                else if (chatCommand[chatCommand.length-1] === "chastity")
                {
                    if (!checkForDiaper === "chastity")
                    {
                        ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + " doesn't have a diaper there!"}]});
                    }
                    else
                    {
                        refreshDiaper({cdiaper: "chastity"});
                    }
                }
                else
                {
                    if (!(checkForDiaper("panties") || checkForDiaper("chastity")))
                    {
                        ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: Player.Name + " doesn't have a diaper! Get one on her before she makes a mess!"}]});
                    }
                    else
                    {
                        refreshDiaper({cdiaper: "both"});
                    }
                }
            }
        }
    }
    // Commands that can be executed by anyone
    if (chatCommand[chatCommand.length-1] === "help") {
        chatCommand.pop();

        let commandArguments = ["start", "change", "stop"];
        let tempVal = chatCommand.pop();
        switch (tempVal)
        {
            case commandArguments[0]:
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: BCDWCONST?.diaperHelpMessages.start}]});
                break;
            case commandArguments[1]:
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: BCDWCONST?.diaperHelpMessages.change}]});
                break;
            case commandArguments[2]:
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: BCDWCONST?.diaperHelpMessages.stop}]});
                break;
            default:
                ServerSend("ChatRoomChat", {Type: "Action", Content: "gag", Dictionary: [{Tag: "gag", Text: BCDWCONST?.diaperHelpMessages.default}]});
                break;
        }
    }
}
