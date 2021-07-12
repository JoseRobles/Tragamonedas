// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
let spinning_first_slot = false;
let spinning_second_slot = false;
let spinning_third_slot = false;
let response_from_server = false;
let response_sent = true;
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
/*Send Request*/
    $.ajax({

        url: '/Play/Throw',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            response_from_server = true;
        },
        error: function (request, error) {
            alert("Request: " + JSON.stringify(request));
        }
    });
    response_from_server = false;
    /*Spin all slots*/
    spin(2, 110);
}
function setInitialPosition(element, position) {
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

async function spin(times, speed) {
    let fixed_amount = 20;
    let limit = times * 4 * (1 / (fixed_amount/100));
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
    response_sent = true;

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

        if (response_from_server && response_sent) {
            setTimeout(function () { spinning_first_slot = false; console.log("spinning first false"); }, 1000);
            setTimeout(function () { spinning_second_slot = false; console.log("spinning second false"); }, 2000);
            setTimeout(function () { spinning_third_slot = false; console.log("spinning third false"); }, 3000);
            response_sent = false;
        }

        spin_amount_first = spin_amount_first + fixed_amount;
        spin_amount_second = spin_amount_second + fixed_amount;
        spin_amount_third = spin_amount_third + fixed_amount;
        index++;

        if (spinning_first_slot == false && spinning_second_slot == false && spinning_third_slot == false) {
            break;
        }

    }

    first_slot = document.getElementById("first-slot").style.backgroundPositionY.toString();
    second_slot = document.getElementById("second-slot").style.backgroundPositionY.toString();
    third_slot = document.getElementById("third-slot").style.backgroundPositionY.toString();

    final_position_first_slot = calculatePosition(parseInt(first_slot.replace("-", "").replace("px", "")));
    final_position_second_slot = calculatePosition(parseInt(second_slot.replace("-", "").replace("px", "")));
    final_position_third_slot = calculatePosition(parseInt(third_slot.replace("-", "").replace("px", "")));

    console.log(final_position_first_slot);
    console.log(final_position_second_slot);
    console.log(final_position_third_slot);
}

function random(seed) {
    let min = 1;
    let max = 4;
    return Math.round(Math.random() * (max - min) + seed);
}

function randomSlots()
{
    return { "first": random(1.5), "second": random(1.8), "third": random(1.4) };
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