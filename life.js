var speed = 200;
var cellSize = 20;
var borderSize = 2;
var cellsX;
var cellsY;
var mouseDown = false;
var pause = true;

$(
    function()
    {

        // Calculate the number of cells needed.
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
        cellsX = Math.floor(screenWidth / (cellSize + borderSize));
        cellsY = Math.floor(screenHeight / (cellSize + borderSize));

        // Build the grid.
        var str = '<table id="grid">';
        for (var y = 0; y < cellsY; y++) {
            str += '<tr>';
            for (var x = 0; x < cellsX; x++) {
                str += '<td id="' + y + '_' + x + '" style=""></td>';
            }
            str += '</tr>';
        }
        str += '</table>';
        $('body').append(str);

        // Set the grid size.
        $('#grid tr td').css('border-width', borderSize + 'px');
        $('#grid tr td').css('width', cellSize);
        $('#grid tr td').css('height', cellSize);

        // Register the event handlers.
        $('body').mouseup(function(event) {
            mouseDown = false;
        });
        $('#grid tr td').mousedown(function(event) {
            mouseDown = true;
            $(this).toggleClass('alive');
        });
        $('#grid tr td').mouseenter(function(event) {
            if (mouseDown) {
                $(this).toggleClass('alive');
            }
        });
        $(document).keydown(function(event) {
            switch (event.keyCode)
            {
                case 32: // space = pause
                    if (pause) {
                        pause = false;
                        $('#help').hide();
                    } else {
                        pause = true;
                        $('#help').show();
                    }
                    break;
                case 67: // c = clear (Firefox)
                case 99: // c = clear (Chome)
                    clear();
                    break;
            }
        });

        // Loop the live() function.
        setInterval(live, speed);

    }
);

// Run a cycle of life.
function live()
{
    if (pause) {
        return;
    }

    // Track changes for this iteration.
    var changes = new Array();

    // Figure out which cells live and die.
    for (var y = 0; y < cellsY; y++) {
        for (var x = 0; x < cellsX; x++) {

            // Identify this cell.
            var cell = '#' + y + '_' + x;

            // Calculate how many living neighbors this cell has.
            var liveNeighbors = 0;
            for (var dy = -1; dy <= 1; dy++) {
                for (var dx = -1; dx <= 1; dx++) {
                    if (dx == 0 && dy == 0) {
                        continue;
                    }
                    var newX = x + dx;
                    var newY = y + dy;
                    if (newX < 0 || newX >= cellsX || newY < 0 || newY >= cellsY) {
                        continue;
                    }
                    if ($('#' + newY + '_' + newX).hasClass('alive')) {
                        ++liveNeighbors;
                    }
                }
            }

            // If a living cell has less than 2 or more than 3 living neighbors, it dies.
            // If a dead cell has exactly 3 living neighbors, it comes to life.
            if ($(cell).hasClass('alive')) {
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    changes.push(cell);
                }
            } else {
                if (liveNeighbors == 3) {
                    changes.push(cell);
                }
            }
        }
    }

    // Apply changes.
    for (var change in changes) {
        $(changes[change]).toggleClass('alive');
    }

}

// Kill'em all.
function clear()
{
    for (var y = 0; y < cellsY; y++) {
        for (var x = 0; x < cellsX; x++) {
            $('#' + y + '_' + x).removeClass('alive');
        }
    }
}