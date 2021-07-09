// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function play() {

}
function spin() {

}

function random(seed) {
    let min = 1;
    let max = 4;
    return Math.floor(Math.random() * (max - min) + seed);
}

function randomSlots()
{
    return { "first": random(1.5), "second": random(1.7), "third": random(1.4) };
}

function setRandomSlots() {
    debugger;
    var result = randomSlots();
    console.log(result);
}