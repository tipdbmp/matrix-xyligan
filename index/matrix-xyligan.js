// var r = 5, c = 5;
// console.log(inward_spiral_matrix(r, c, 'top-left', 'clockwise'));
// console.log(inward_spiral_matrix(r, c, 'top-left', 'anticlockwise'));
// console.log(inward_spiral_matrix(r, c, 'top-right', 'clockwise'));
// console.log(inward_spiral_matrix(r, c, 'top-right', 'anticlockwise'));
// console.log(inward_spiral_matrix(r, c, 'bottom-left', 'clockwise'));
// console.log(inward_spiral_matrix(r, c, 'bottom-left', 'anticlockwise'));
// console.log(inward_spiral_matrix(r, c, 'bottom-right', 'clockwise'));
// console.log(inward_spiral_matrix(r, c, 'bottom-right', 'anticlockwise'));
//
function inward_spiral_matrix(r, c, starting_position_name, direction_name) {
    c = c || r;
    starting_position_name = starting_position_name || 'top-left';
    direction_name         = direction_name         || 'clockwise';

    var transition_table = {
        'top-left': {
            clockwise : {
                initial : [ 0,  1],
                '0,1'   : [ 1,  0],
                '1,0'   : [ 0, -1],
                '0,-1'  : [-1,  0],
                '-1,0'  : [ 0,  1],
            },
            anticlockwise : {
                initial : [ 1,  0],
                '1,0'   : [ 0,  1],
                '0,1'   : [-1,  0],
                '-1,0'  : [ 0, -1],
                '0,-1'  : [ 1,  0],
            },
        },
        'top-right' : {
            clockwise : {
                initial : [ 1,  0],
                '1,0'   : [ 0, -1],
                '0,-1'  : [-1,  0],
                '-1,0'  : [ 0,  1],
                '0,1'   : [ 1,  0],
            },
            anticlockwise : {
                initial : [ 0, -1],
                '0,-1'  : [ 1,  0],
                '1,0'   : [ 0,  1],
                '0,1'   : [-1,  0],
                '-1,0'  : [ 0, -1],
            },
        },
        'bottom-left' : {
            clockwise : {
                initial : [-1,  0],
                '-1,0'  : [ 0,  1],
                '0,1'   : [ 1,  0],
                '1,0'   : [ 0, -1],
                '0,-1'  : [-1,  0],
            },
            anticlockwise : {
                initial : [ 0,  1],
                '0,1'   : [-1,  0],
                '-1,0'  : [ 0, -1],
                '0,-1'  : [ 1,  0],
                '1,0'   : [ 0,  1],
            },
        },
        'bottom-right' : {
            clockwise : {
                initial : [ 0, -1],
                '0,-1'  : [-1,  0],
                '-1,0'  : [ 0,  1],
                '0,1'   : [ 1,  0],
                '1,0'   : [ 0, -1],
            },
            anticlockwise : {
                initial : [-1,  0],
                '-1,0'  : [ 0, -1],
                '0,-1'  : [ 1,  0],
                '1,0'   : [ 0,  1],
                '0,1'   : [-1,  0],
            },
        },
    };

    var m = allocate_matrix(r, c);
    var m2 = [];

    var x, y, xy;
    xy = translate_starting_position_name_to_coords(r, c, starting_position_name);
    x = xy[0]; y = xy[1];

    var dx, dy, dxy;
    dxy = transition_table[starting_position_name][direction_name]['initial'];
    dx = dxy[0]; dy = dxy[1];

    for (var i = 1; i <= r * c; i++) {
        m[x][y] = i;
        m2.push([i, x, y]);

        var nx = x + dx;
        var ny = y + dy;

        if (nx < 0 || nx === r || ny < 0 || ny === c || m[nx][ny] !== undefined ) {
            dxy = transition_table[starting_position_name][direction_name][dx + ',' + dy];
            dx = dxy[0]; dy = dxy[1];
        }

        x = x + dx;
        y = y + dy;
    }

    // return m;
    return m2;
}


// var n = 5;
// console.log(outward_spiral_matrix(n, 'clockwise'));
// console.log(outward_spiral_matrix(n, 'anticlockwise'));
function outward_spiral_matrix(n, direction_name) {
    direction_name = direction_name || 'clockwise';
    var m = allocate_matrix(n, n);
    var m2 = [];
    var x = Math.floor(n / 2);
    var y = Math.floor(n / 2);
    var directions = generate_directions(n, direction_name);
    for (var i = 1; i <= n * n; i++) {
        m[x][y] = i;
        m2.push([i, x, y]);
        var dx, dy, dxy;
        dxy = directions[i];
        dx = dxy[0]; dy = dxy[1];
        x = x + dx;
        y = y + dy;
    }

    // return m;
    return m2;
}

function generate_directions(n, direction) {
    direction = direction || 'clockwise';
    var dir_right = [ 0,  1];
    var dir_left  = [ 0, -1];
    var dir_up    = [-1,  0];
    var dir_down  = [ 1,  0];

    if (direction === 'anticlockwise') {
        // swapping two variables... where is ES6?
        dir_right = [dir_left, dir_left = dir_right][0];
    }

    var directions = [undefined];
    for (var i = 1; i <= n; i++) {
        if (i % 2 == 1) {
            for (var j = 1; j <= i; j++) {
                directions.push(dir_right);
            }
            for (var j = 1; j <= i; j++) {
                directions.push(dir_down);
            }
        } else {
            for (var j = 1; j <= i; j++) {
                directions.push(dir_left);
            }
            for (var j = 1; j <= i; j++) {
                directions.push(dir_up);
            }
        }
    }

    return directions;
}

// var n = 5;
// console.log(zig_zag_matrix(n, 'top-left'));
// console.log(zig_zag_matrix(n, 'top-right'));
// console.log(zig_zag_matrix(n, 'bottom-left'));
// console.log(zig_zag_matrix(n, 'bottom-right'));
function zig_zag_matrix (n, starting_position_name) {
    starting_position_name = starting_position_name || 'top-left';

    var right      = [ 0,  1];
    var left       = [ 0, -1];
    var down       = [ 1,  0];
    var up         = [-1,  0];

    var down_right = [ 1,  1];
    var down_left  = [ 1, -1];
    var up_right   = [-1,  1];
    var up_left    = [-1, -1];

    if (starting_position_name === 'top-right') {
        right = [left, left = right][0];
        up_right = up_left;
        down_left = down_right;
    } else if (starting_position_name === 'bottom-left') {
        down = [up, up = down][0];
        up_right = down_right;
        down_left = up_left;
    } else if (starting_position_name === 'bottom-right') {
        right = [left, left = right][0];
        down = [up, up = down][0];
        up_right = [down_left, down_left = up_right][0];
    }

    var m = allocate_matrix(n, n);
    var m2 = [];
    var x, y, xy;
    xy = translate_starting_position_name_to_coords(n, n, starting_position_name);
    x = xy[0]; y = xy[1];

    for (var i = 1; i <= n * n; i++) {
        m[x][y] = i;
        m2.push([i, x, y]);

        var hvdx = right[0];
        var hvdy = right[1];

        var ddx = up_right[0];
        var ddy = up_right[1];

        var nx = x + ddx;
        var ny = y + ddy;
        if (coords_out_of_bounds(nx, ny, n, n)) {
            nx = x + hvdx;
            ny = y + hvdy;
            if (coords_out_of_bounds(nx, ny, n, n)) {
                right = [down, down = right][0];
                hvdx = right[0];
                hvdy = right[1];
            }
            x = x + hvdx;
            y = y + hvdy;

            right = [down, down = right][0];
            up_right = [down_left, down_left = up_right][0];
        } else {
            x = nx;
            y = ny;
        }
    }

    // return m;
    return m2;
}

function coords_out_of_bounds(x, y, r, c) {
    if (x < 0 || y < 0 || x == r || y == c) { return true; }
    return false;
}


// console.log(translate_starting_position_name_to_coords(4, 4, 'top-left2'));
function translate_starting_position_name_to_coords(r, c, sp_name) {
    if (sp_name === 'top-left')     { return [0, 0]; }
    if (sp_name === 'top-right')    { return [0, c - 1]; }
    if (sp_name === 'bottom-left')  { return [r - 1, 0]; }
    if (sp_name === 'bottom-right') { return [r - 1, c - 1] }
    throw "Invalid starting position name: '" + sp_name + "'";
}

function allocate_matrix(r, c) {
    var m = [];
    var row;
    for (var i = 1; i <= r; i++) {
        row = [];
        for (var j = 1; j <= c; j++) {
            row.push(undefined);
        }
        m.push(row);
    }
    return m;
}

function swap_coords(a, b) {
    var c = [b[0], b[1]];
    b[0] = a[0]; b[1] = a[1];
    a[0] = c[0]; a[1] = c[1];
}