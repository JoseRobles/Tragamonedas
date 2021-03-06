// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
let spinning_first_slot = false;
let spinning_second_slot = false;
let spinning_third_slot = false;
let response_from_server = false;
let response_sent = true;
let is_random = true;
let initial_position_first_slot = 0;
let initial_position_second_slot = 0;
let initial_position_third_slot = 0;
let final_position_first_slot = 0;
let final_position_second_slot = 0;
let final_position_third_slot = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function play() {

    response_from_server = false;
    $("#play").prop("disabled", true);

    $.ajax({
        url: '/Play/Throw',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            is_random = data.is_random;
            final_position_first_slot = data.first_slot;
            final_position_second_slot = data.second_slot;
            final_position_third_slot = data.third_slot;
            response_from_server = true;
        },
        error: function (error) {
            alert("Se produjo un error.");
        }
    });
    
    spin(110);
}

function checkCredits() {
    $.ajax({

        url: '/Play/GetCredits',
        type: 'GET',
        dataType: 'json',
        success: function (credits) {
            if (credits == "0") {
                $("#play").prop("disabled", true);
                $("#cashout").prop("disabled", true);
            }
        },
        error: function (error) {
            alert("Ocurrio un error");
        }
    });
}

function setInitialPosition(element, position) {
    checkCredits();
    document.getElementById(element).style.backgroundPosition = "0 -" + (position-1)*100 + "px";
}

function setPosition(element, amount) {
    document.getElementById(element).style.backgroundPosition = "0 -" + amount + "px";
}

function calculatePosition(amount) {
    let preCalculated = Math.round(((amount + 100) / 100) % 4);
    if (preCalculated == 0) {
        preCalculated =  4;
    }
    return preCalculated;
}

async function spin(speed) {
    let fixed_amount = 20;
    let limit = 100000;
    let index = 0;

    let first_slot = document.getElementById("first-slot").style.backgroundPositionY.toString();
    let second_slot = document.getElementById("second-slot").style.backgroundPositionY.toString();
    let third_slot = document.getElementById("third-slot").style.backgroundPositionY.toString();

    let spin_amount_first = parseInt(first_slot.replace("-", "").replace("px", "")) + fixed_amount;
    let spin_amount_second = parseInt(second_slot.replace("-", "").replace("px", "")) + fixed_amount;
    let spin_amount_third = parseInt(third_slot.replace("-", "").replace("px", "")) + fixed_amount;

    spinning_first_slot = true;
    spinning_second_slot = true;
    spinning_third_slot = true;
    response_sent = false;

    while (index < limit) {

        await sleep(speed);

        if (spinning_first_slot) {
            setPosition("first-slot", spin_amount_first);
        }
        if (spinning_second_slot) {
            setPosition("second-slot", spin_amount_second);
        }
        if (spinning_third_slot) {
            setPosition("third-slot", spin_amount_third);
        }

        if (response_from_server && !response_sent) {
            if (!is_random && index > 20) {
                if (getPosition("first-slot") == final_position_first_slot) {
                    spinning_first_slot = false;
                }
                if (getPosition("second-slot") == final_position_second_slot) {
                    spinning_second_slot = false;
                }
                if (getPosition("third-slot") == final_position_third_slot) {
                    spinning_third_slot = false;
                }
                if (spinning_first_slot == false && spinning_second_slot == false && spinning_third_slot == false) {
                    response_sent = true;
                }
            } else {
                setTimeout(function () { spinning_first_slot = false; }, 1000);
                setTimeout(function () { spinning_second_slot = false; }, 2000);
                setTimeout(function () { spinning_third_slot = false; }, 3000);
                response_sent = true;
            }
        }

        spin_amount_first = spin_amount_first + fixed_amount;
        spin_amount_second = spin_amount_second + fixed_amount;
        spin_amount_third = spin_amount_third + fixed_amount;
        index++;

        if (spinning_first_slot == false && spinning_second_slot == false && spinning_third_slot == false) {
            $("#play").prop("disabled", false);
            break;
        }

    }

    final_position_first_slot = getPosition("first-slot");
    final_position_second_slot = getPosition("second-slot");
    final_position_third_slot = getPosition("third-slot");

    if (final_position_first_slot > 0 && final_position_second_slot > 0 && final_position_third_slot > 0) {
        sendResult();
    } else {
        alert("Ocurrio un error");
    }
}

function getPosition(slot) {
    let positionSlot = document.getElementById(slot).style.backgroundPositionY.toString();
    return calculatePosition(parseInt(positionSlot.replace("-", "").replace("px", "")));
}

function random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function cashOut() {
    $("#play").prop("disabled", true);
    $("#cashout").prop("disabled", true);

    $.ajax({
        url: '/Play/Transfer',
        type: 'POST',
        dataType: 'json',
        success: function (account) {
            $("#credits").html("0");
            if (account != "0") {
                $("#account").html(account);
            }
        },
        error: function (error) {
            alert("Ocurrio un error");
        }
    });
}

function hideCashOut() {
    let probability = [1, 1, 1, 1, 1, 2, 2, 2, 2, 0];
    let option = probability[random(0, 9)];
    let position = random(0, 4);

    
    switch (option) {
        case 1:
            moveToNewPosition(position);
            $("#cashout").prop("disabled", false);
            break;
        case 2:
            $("#cashout").prop("disabled", true);
            break;
        default:
            break;
    }

}

function moveToNewPosition(position) {
    switch (position) {
        case 1:
            document.getElementById("cashout").style.margin = "300px 0 0 0";
            break;
        case 2:
            document.getElementById("cashout").style.margin = "0 300px 0 0";
            break;
        case 3:
            document.getElementById("cashout").style.margin = "0 0 300px 0";
            break;
        case 4:
            document.getElementById("cashout").style.margin = "0 0 0 300px";
            break;
        default:
            break;
    }
}
function randomSlots()
{
    return { "first": random(1,4), "second": random(1,4), "third": random(1,4) };
}

function setRandomSlots() {
    var result = randomSlots();
    initial_position_first_slot = result.first;
    initial_position_second_slot = result.second;
    initial_position_third_slot = result.third;
    setInitialPosition("first-slot", result.first);
    setInitialPosition("second-slot", result.second);
    setInitialPosition("third-slot", result.third);
}

function sendResult() {
    let result = false;
    let result_index = 0;
    if (final_position_first_slot == final_position_second_slot && final_position_second_slot == final_position_third_slot) {
        result = true;
        result_index = final_position_first_slot;
    }
    
    $.ajax({

        url: '/Play/SetResult',
        type: 'POST',
        dataType: 'json',
        data: { winner: result, index: result_index},
        success: function (data) {
            $("#credits").html(data.credits);
            if (data.credits == "0") {
                $("#play").prop("disabled", true);
            }
        },
        error: function (request, error) {
            alert("Request: " + JSON.stringify(request));
        }
    });
}