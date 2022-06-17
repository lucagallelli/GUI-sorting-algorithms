const tolerance = 2; //px
const maxHeight = 200;
const minHeight = 50; // The size of all boxes will be between these

var movesDone = 0; // Tracks the number of callbacks from moveTo

var boxArray = [];
var pos = [];
// positions of each index of the array
var array = new Array();

function makeBoxes(array)
// Generate a GUI corresponding with the supplied array
{
    var holder = document.getElementById("container");

    // purge previous gui elements
    boxes = holder.getElementsByClassName("box");
    while (boxes.length > 0)
    {
        holder.removeChild(boxes[0])
    }

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

        // This is how we set colour, is there a more interesting option than a static
        // colour? How about a graident or random colour?
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

var countdec = 1
function bubbleSort(isAscending) {
    text = document.getElementById("output");
    text.innerHTML = "Array you entered was "+ array + "\n";
    makeBoxes(array);
    var maxI = array.length;
    var i;
    var j;
    var temp;
    var changed = true;
    var lastMovesDone = -1;
    while (changed)
    {
        changed = false;
        for(i = 0; i < maxI - 1; i++)
        {
            j = i + 1;
            var hasSwaped = false;
            if (isAscending)
            {
                hasSwaped = array[i] > array[j];
            }   
            else
            {
                hasSwaped = array[i] < array[j];
            }
            if(hasSwaped)
            {
                changed = true;
                // Only run the sort on the rising edge of movesDone counter
                if (movesDone == lastMovesDone)
                {
                    continue;
                }
                else
                {
                    lastMovesDone = movesDone;
                }
                temp = array[i];
                array[i] = array[j];
                array[j] = temp;
                swap(i, j);
            }
        }
        text.innerHTML += "\n\nPass " + countdec + ":    " + array + "\n";
        countdec = countdec + 1;
        maxI--;
    }
    text.innerHTML += "\n\nFinal sort"+":    " + array + "\n";
}

// Sorting animation module
function swap(i1, i2)
// Swap two elements both visually and in the array
{
    moveTo(boxArray[i1], pos[i2], 300);
    moveTo(boxArray[i2], pos[i1], 300, function(){console.log("Swap done.")});
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
                movesDone++;
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

function sumNumbers()
{
    text = document.getElementById("inputTest").value;
    // Split the text into substrings based on commas
    substrings = text.split(",");
    total = 0;
    substrings.forEach(element => {
        // Convert the substring into a number
        num = Number(element);
        // if the conversion failed, ignore that entry
        if (!isNaN(num))
        {
            total += num
        }
    });
    output = document.getElementById("outputTest");
    output.value = total;
    console.log(total);
}
