var app = angular.module
(
    'app',
    [
//        'ui.bootstrap'
        'adjustable-number'
    ]
);

app.factory('$e', function clientIdFactory()
{
    return _.bind(angular.element, angular);
});

//app.filter('filter_spiral_matrix_types', function() {
//  return function(spiral_matrix_types_array, r, c) {
//      console.log(spiral_matrix_types_array);
//      console.log('rows: ' + r);
//      console.log('columns: ', + c);
//
//      // an outward spiral matrix must be square, i.e n x n
//      // and n must be odd
//      if (r != c || r % 2 != 1) {
//          return ['inward'];
////          return _.filter(spiral_matrix_types_array.splice(0), function(spiral_matrix_type) {
////              console.log(spiral_matrix_type);
////              return spiral_matrix_type !== 'outward';
////              return true;
////          });
//      }
//
//      return spiral_matrix_types_array;
//}});

app.controller('index', function
(
    $scope
//  , $e
  , $timeout
  , $interval
)
{
    $scope.matrix = { rows_count: 5, columns_count: 5 };

    $scope.matrix_types = ['spiral', 'zigzag'];
    $scope.matrix_type  =  $scope.matrix_types[0];

    $scope.spiral_matrix_types = ['inward', 'outward'];
    $scope.spiral_matrix_type  = $scope.spiral_matrix_types[0];

    $scope.starting_position_names = "top-left top-right bottom-left bottom-right".split(' ');
    $scope.starting_position_name  = $scope.starting_position_names[0];

    $scope.directions = "clockwise anticlockwise".split(' ');
    $scope.direction  = $scope.directions[0];

    var matrix = document.getElementById('matrix');
    var $timer = null;
    var current_number_index = 0;
    $scope.delay = 100;
    $scope.unleash_the_numbers = function() {
//        return;
//        console.log('unlreashing the numbers');

        // wait for angular to update the matrix indecies and to
        // render the table
        $timeout(function () {
            // clear the matrix
            for (var i = 0; i < matrix.rows.length; i++) {
                for (var j = 0; j < matrix.rows[i].cells.length; j++) {
                    matrix.rows[i].cells[j].innerHTML = '';
                }
            }

            var m;
            if ($scope.matrix_type === 'spiral' && $scope.spiral_matrix_type === 'inward') {
                m = inward_spiral_matrix(
                    $scope.matrix.rows_count,
                    $scope.matrix.columns_count,
                    $scope.starting_position_name,
                    $scope.direction
                );
            } else if ($scope.matrix_type === 'spiral' && $scope.spiral_matrix_type === 'outward') {
                m = outward_spiral_matrix($scope.matrix.rows_count, $scope.direction);
            } else if ($scope.matrix_type === 'zigzag') {
                m = zig_zag_matrix($scope.matrix.rows_count, $scope.starting_position_name);
            } else {
                throw 'there is no spoon';
            }

            current_number_index = 0;
            var fill_matrix = function() {
                var number = m[current_number_index];
                matrix.rows[ number[1] ].cells[ number[2] ].innerHTML = number[0];
                current_number_index++;
                if (current_number_index == m.length) {
                    $interval.cancel($timer);
                    $timer = null;
                }

//                console.log(number);
            };

//            if ($timer == null) {
//                $timer = $interval(fill_matrix, 100);
//            } else {
                $interval.cancel($timer);
                $timer = $interval(fill_matrix, $scope.delay);
//            }

//            for (var i = 0; i < m.length; i++) {
//                matrix.rows[ m[i][1] ].cells[ m[i][2] ].innerHTML = m[i][0];
//            }


        }, 0);
    };


    $scope.matrix_indecies;
    $scope.matrix_update_indecies = function()
    {
        var i, j;
        var rows_count = $scope.matrix.rows_count;
        var columns_count = $scope.matrix.columns_count;

        var matrix_indecies = [];
        var row;
        var index = 0;
        for (i = 1; i <= rows_count; i++)
        {
            row = [];
            for (j = 1; j <= columns_count; j++)
            {
                index++;
                row.push(index);
            }
            matrix_indecies.push(row);
        }

        $scope.matrix_indecies = matrix_indecies;
    };
    $scope.matrix_update_indecies();

    $scope.matrix_update_indecies_delay = 0;
    $scope.$watch('matrix.rows_count', _.debounce(function()
    {
        $scope.$apply(function() {
            $scope.matrix_update_indecies();
            $scope.unleash_the_numbers();
        });
    }, $scope.matrix_update_indecies_delay));
    $scope.$watch('matrix.columns_count', _.debounce(function()
    {
        $scope.$apply(function() {
            $scope.matrix_update_indecies();
            $scope.unleash_the_numbers();
        });
    }, $scope.matrix_update_indecies_delay));

    $scope.$watch('delay', _.debounce(function()
    {
        $scope.$apply(function() {
            $scope.matrix_update_indecies();
            $scope.unleash_the_numbers();
        });
    }, $scope.matrix_update_indecies_delay));


    $scope.filter_spiral_matrix_types = function(spiral_matrix_types_array) {
        var r = $scope.matrix.rows_count;
        var c = $scope.matrix.columns_count;
//        console.log(spiral_matrix_types_array);
//        console.log('rows: ' + r);
//        console.log('columns: ' + c);

        // an outward spiral matrix must be square, i.e n x n
        // and n must be odd
        if (r != c || r % 2 != 1) {
            $scope.spiral_matrix_type = $scope.spiral_matrix_types[0];
            return _.filter(spiral_matrix_types_array.slice(0), function(spiral_matrix_type) {
                return spiral_matrix_type !== 'outward';
            });
        }

        return spiral_matrix_types_array;
    };

    $scope.test_stuff = function()
    {
//        var a = [0, 0];
//        var b = [1, 1];
//        console.log('a: ', a, '; b: ', b);
//        swap_coords(a, b);
//        console.log('a: ', a, '; b: ', b);

//        console.log($scope.matrix);
        $scope.unleash_the_numbers();
    };
});


//$(document).ready(function()
//{
//    'use strict';
//    console.log('this is the shit =)');
//});

//    Class('Foo', { has: {
//        bar: { is: 'rw', required: true },
//
//    }, methods: {
//        baz: function(prefix) {
//            console.log(prefix + this.bar);
//        },
//    }, before: {
//
//    }, after: {
//
//    }});
//
//    var foo = new Foo({ bar: 'bar' });
//    foo.baz('hello: ');
