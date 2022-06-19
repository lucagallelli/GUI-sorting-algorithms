const tolerance = 2; //px
const maxHeight = 200;
const minHeight = 50; // The size of all boxes will be between these

var boxArray = [];
// positions of each index of the array
var pos = [];
var array = [];

function makeBoxes(array)
// Generate a GUI corresponding with the supplied array
{
    var holder = document.getElementById("container");

    // purge previous gui elements
    while (holder.children.length > 0)
    {
        holder.removeChild(holder.children[0])
    }
    boxArray = [];
    pos = [];

    // Find the largest and smallest elements of array by linear search
    min = array[0];
    max = array[0];
    array.forEach(element => {
        if (element < min)
        {
            min = element;
        }
        else if (element > max)
        {
            max = element;
        }
    });

    x = 0;
    for (var i = 0; i < array.length; i++)
    {
        // Create the new div, give it box class
        var new_box = document.createElement("div");
        new_box.className = "box";
        // Make it a child of the container and add it to the array
        holder.appendChild(new_box);
        boxArray.push(new_box);

        // Calculate the height of the box, give it width, height
        var boxHeight = rescale(min, max, array[i])
        new_box.style["width"] = "10px";
        new_box.style["height"] = boxHeight + "px";

        new_box.style["background-color"] = "red";

        // Set the starting position of the box
        x += 100;
        pos.push([x, 100]);
        new_box.style["left"] = x + "px";
        new_box.style["top"] = 100 + "px";
    }
}

function rescale(min, max, value)
// Rescale value from between min and max to be between minHeight
// and maxHeight linearly
{
    output = value - min;
    output /= (max - min);
    output *= (maxHeight - minHeight);
    output += minHeight;
    return output;
}

function pushArray(){
    // Empty the array
    array = [];
    text = document.getElementById("elem").value;
    // Split the text into substrings based on commas
    substrings = text.split(",");
    substrings.forEach(element => {
        // Convert the substring into a number
        num = Number(element);
        // if the conversion failed, ignore that entry
        if (!isNaN(num))
        {
            array.push(num);
        }
    });
    document.getElementById("elem").value = '';
}

function addLine(text)
// Display a line of text in the output div
{
    holder = document.getElementById("output");
    var para = document.createElement("p");
    holder.appendChild(para);
    para.innerHTML = text;
}

function clearOutput()
// Delete all of the text we have currently output
{
    holder = document.getElementById("output");
    while(holder.children.length > 0)
    {
        holder.removeChild(holder.children[0]);
    }
}

// Bubble sort
function startBubbleSort(isAscending)
{
    clearOutput();
    makeBoxes(array);
    recursiveBubbleSort(isAscending, 0, 0, false);
}

function recursiveBubbleSort(isAscending, pass, i, changed)
// Since we need to react to callbacks, the recursive version of the search is prefered
// This is the recursive form of the bubble sort covered in SDD
{
    j = i + 1;
    var hasSwaped = false
    if (isAscending)
    {
        hasSwaped = array[i] > array[j];
    }   
    else
    {
        hasSwaped = array[i] < array[j];
    }
    // We define the function we call in the next step
    function next()
    {
        var nextI = i + 1;
        var nextChanged = changed;
        // If a pass is finished
        if (i >= (array.length - pass))
        {
            pass++;
            addLine("Pass " + pass + ":    " + array);
            // If there were no changes for a whole pass, stop sorting
            if (!changed)
            {
                return;
            }
            nextI = 0;
            nextChanged = false;
        }
        recursiveBubbleSort(isAscending, pass, nextI, nextChanged);
    }
    // If a swap is needed, we give the next function to the swap method as a callback
    // once the visual swap is done, it will be called
    if(hasSwaped)
    {
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        changed = true;
        swap(i, j, next);
    }
    // If no swap is needed we swap right away
    else
    {
        next();
    }
}

// Selection sort
function startSelectionSort(isAscending)
{
    clearOutput();
    makeBoxes(array);
    recursiveSelectionSort(isAscending, 0);
}

function recursiveSelectionSort(isAscending, pass)
// Since we need to react to callbacks, the recursive version of the search is prefered
// This is the recursive form of the selection sort covered in SDD
{
    var i = pass;
    var candidate = array[i];
    var candidateIndex = i;
    // Find the largest/smallest item and index via a linear search
    while (i < array.length)
    {
        var item = array[i];
        var newCandidate;
        if (isAscending)
        {
            newCandidate = item < candidate;
        }
        else
        {
            newCandidate = item > candidate;
        }
        if (newCandidate)
        {
            candidate = item;
            candidateIndex = i;
        }
        i++;
    }
    // We define the function we call in the next step
    function next()
    {
        pass++;
        if (pass < array.length)
        {
            recursiveSelectionSort(isAscending, pass);
        } 
    }
    // If a swap is needed, we give the next function to the swap method as a callback
    // once the visual swap is done, it will be called
    if(candidateIndex != pass)
    {
        temp = array[pass];
        array[pass] = array[candidateIndex];
        array[candidateIndex] = temp;
        swap(pass, candidateIndex, next);
    }
    // If no swap is needed we start the next pass
    else
    {
        next();
    }
}

function startInsertionSort(isAscending)
{
    clearOutput();
    makeBoxes(array);
    //First value on left is already sorted, therefor we start on the second value
    recursiveInsertionSort(isAscending, 1, 1);

}

function recursiveInsertionSort(isAscending, pass, location)
{
    var j = location - 1;
    var hasSwaped = false
    if (j >= 0)
    {
        if (isAscending)
        {
            hasSwaped = array[location] < array[j];
        }   
        else
        {
            hasSwaped = array[location] > array[j];
        }
    }
    // We define the function we call in the next step
    function next()
    {
        location--;
        if (!hasSwaped)
        {
            pass++;
            location = pass;
        }
        if (pass < array.length)
        {
            recursiveInsertionSort(isAscending, pass, location);
        }
    }

    if(hasSwaped)
    {
        temp = array[location];
        array[location] = array[j];
        array[j] = temp;
        swap(location, j, next);
    }
    // If no swap is needed we start the next pass
    else
    {
        next();
    }
}
    

// Sorting animation module
function swap(i1, i2, callback)
// Swap two elements both visually and in the array
{
        moveTo(boxArray[i1], pos[i2], 300);
        moveTo(boxArray[i2], pos[i1], 300, callback);
        temp = boxArray[i1];
        boxArray[i1] = boxArray[i2];
        boxArray[i2] = temp;
}

function moveTo(element, destination, timesteps, callback=null)
// We want to move element to the destination x and y in a number of small steps
// This function is asynchronus so the callback can be used to wait for movement to finish
{
    var dt = 10
    var elStyle = window.getComputedStyle(element);
    var currentY = elStyle.getPropertyValue("top").replace("px", "");
    var currentX = elStyle.getPropertyValue("left").replace("px", "");
    var rel = [destination[0] - currentX, destination[1] - currentY];
    var direction = normalise(rel);
    var distance = norm(rel) / timesteps * dt;
    function moveAFrame() {
        currentY = elStyle.getPropertyValue("top").replace("px", "");
        currentX = elStyle.getPropertyValue("left").replace("px", "");
        rel = [destination[0] - currentX, destination[1] - currentY]
        // If we are close to the goal, stop moving and snap to the correct position
        if (norm(rel) > tolerance)
        {
            moveStep(element, direction, distance)
        }
        else
        {
            element.style["top"] = (destination[1]) + "px";
            element.style["left"] = (destination[0]) + "px";
            clearInterval(movingFrames);
            if (callback)
            {
                callback();
            }
            return;
        }
     }
    var movingFrames = setInterval(moveAFrame, dt);
}

function moveStep(element, direction, distance)
// Direction is a unit vector representing the intended direction of motion
{
    // Distances to move in each direction
    var dx = direction[0] * distance;
    var dy = direction[1] * distance;
    // We modify the style of the element to move it
    var elStyle = window.getComputedStyle(element);
    var currentY = elStyle.getPropertyValue("top").replace("px", "");
    var currentX = elStyle.getPropertyValue("left").replace("px", "");
    element.style["top"] = (Number(currentY) + dy) + "px";
    element.style["left"] = (Number(currentX) + dx) + "px";
}

// Vector helper functions
function norm(v)
// Get the length of a vector
{
    var total = 0;
    v.forEach(element => {
        total = total + element * element;
    });
    return Math.sqrt(total)
}

function normalise(u)
// Make v a unit vector
{
    // Make v a copy of u so we don't affect the original
    v = [].concat(u)
    mag = norm(v);
    for (let index = 0; index < v.length; index++) {
        v[index] = v[index] / mag;
    }
    return v
}
