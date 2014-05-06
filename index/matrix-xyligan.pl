use strict;
use warnings FATAL => 'all';
use v5.14;
# no autovivification;
# no autovivification 'strict';
# no autovivification 'store';

my @matrix;

my ($r, $c) = (5, 5);
@matrix = inward_spiral_matrix($r, $c, 'top-left', 'clockwise');
# @matrix = inward_spiral_matrix($r, $c, 'top-left', 'anticlockwise');
# @matrix = inward_spiral_matrix($r, $c, 'top-right', 'clockwise');
# @matrix = inward_spiral_matrix($r, $c, 'top-right', 'anticlockwise');
# @matrix = inward_spiral_matrix($r, $c, 'bottom-left', 'clockwise');
# @matrix = inward_spiral_matrix($r, $c, 'bottom-left', 'anticlockwise');
# @matrix = inward_spiral_matrix($r, $c, 'bottom-right', 'clockwise');
# @matrix = inward_spiral_matrix($r, $c, 'bottom-right', 'anticlockwise');
print_matrix($r, $c, @matrix);

# my $n = 5;
# @matrix = outward_spiral_matrix($n, 'clockwise');
# @matrix = outward_spiral_matrix($n, 'anticlockwise');
# @matrix = zig_zag_matrix($n, 'top-left');
# @matrix = zig_zag_matrix($n, 'top-right');
# @matrix = zig_zag_matrix($n, 'bottom-left');
# @matrix = zig_zag_matrix($n, 'bottom-right');
# use DDP; say p @matrix;
# print_matrix($n, $n, @matrix);


# r = rows; c = columns
# starting position name = top-left     = (0, 0)
#                        | top-right    = (0, $c - 1)
#                        | bottom-left  = ($r - 1, 0)
#                        | bottom-right = ($r - 1, $c - 1)
# direction name = clockwise | anticlockwise
sub inward_spiral_matrix { my ($r, $c, $starting_position_name, $direction_name) = @_;
    $c ||= $r;
    $starting_position_name ||= 'top-left';
    $direction_name         ||= 'clockwise';

    my %transition_table = (
        'top-left' => {
            clockwise => {
                initial => [ 0,  1],
                '0,1'   => [ 1,  0],
                '1,0'   => [ 0, -1],
                '0,-1'  => [-1,  0],
                '-1,0'  => [ 0,  1],
            },
            anticlockwise => {
                initial => [ 1,  0],
                '1,0'   => [ 0,  1],
                '0,1'   => [-1,  0],
                '-1,0'  => [ 0, -1],
                '0,-1'  => [ 1,  0],
            },
        },
        'top-right' => {
            clockwise => {
                initial => [ 1,  0],
                '1,0'   => [ 0, -1],
                '0,-1'  => [-1,  0],
                '-1,0'  => [ 0,  1],
                '0,1'   => [ 1,  0],
            },
            anticlockwise => {
                initial => [ 0, -1],
                '0,-1'  => [ 1,  0],
                '1,0'   => [ 0,  1],
                '0,1'   => [-1,  0],
                '-1,0'  => [ 0, -1],
            },
        },
        'bottom-left' => {
            clockwise => {
                initial => [-1,  0],
                '-1,0'  => [ 0,  1],
                '0,1'   => [ 1,  0],
                '1,0'   => [ 0, -1],
                '0,-1'  => [-1,  0],
            },
            anticlockwise => {
                initial => [ 0,  1],
                '0,1'   => [-1,  0],
                '-1,0'  => [ 0, -1],
                '0,-1'  => [ 1,  0],
                '1,0'   => [ 0,  1],
            },
        },
        'bottom-right' => {
            clockwise => {
                initial => [ 0, -1],
                '0,-1'  => [-1,  0],
                '-1,0'  => [ 0,  1],
                '0,1'   => [ 1,  0],
                '1,0'   => [ 0, -1],
            },
            anticlockwise => {
                initial => [-1,  0],
                '-1,0'  => [ 0, -1],
                '0,-1'  => [ 1,  0],
                '1,0'   => [ 0,  1],
                '0,1'   => [-1,  0],
            },
        },
    );

    my @m = allocate_matrix($r, $c);
    my ($x, $y) = translate_starting_position_name_to_coords($r, $c, $starting_position_name);
    my ($dx, $dy) = @{ $transition_table{$starting_position_name}{$direction_name}{'initial'} };
    for my $i (1 .. $r * $c) {
        $m[$x][$y] = $i;

        my ($nx, $ny) = ($x + $dx, $y + $dy);
        say $nx;
        if (defined $m[$nx][$ny] || $nx < 0 || $nx == $r || $ny < 0 || $ny == $c) {
            ($dx, $dy) = @{
                $transition_table
                {$starting_position_name}
                {$direction_name}
                {"$dx,$dy"}
            };
        }

        ($x, $y) = ($x + $dx, $y + $dy);
    }

    @m;
}

# n = an odd number
# direction name = clockwise | anticlockwise
sub outward_spiral_matrix { my ($n, $direction_name) = @_;
    die "expected an odd number for \$n, '$n' was given" if $n % 2 != 1;
    $direction_name ||= 'clockwise';

    my @m = allocate_matrix($n, $n);
    my ($x, $y) = (int($n / 2), int($n / 2));
    my @directions = generate_directions($n, $direction_name);
    for my $i (1 .. $n * $n) {
        $m[$x][$y] = $i;
        my ($dx, $dy) = @{ $directions[$i] };
        ($x, $y) = ($x + $dx, $y + $dy);
    }

    @m;
}


# 5 x 5
#
# 21 22 23 24 25
# 20  7  8  9 10
# 19  6  1  2 11
# 18  5  4  3 12
# 17 16 15 14 13
#
# clockwise directions
#
# 1 right ( 0,  1)
# 1 down  ( 1,  0)
# 2 left  ( 0, -1)
# 2 up    (-1,  0)
# 3 right ( 0,  1)
# 3 down  ( 1,  0)
# 4 left  ( 0, -1)
# 4 up    (-1,  0)
# 5 right ( 0,  1)
#
# anticlockwise directions
#
# 1 left
# 1 down
# 2 right
# 2 up
# 3 left
# 3 down
# 4 right
# 4 up
# 5 left
#
sub generate_directions { my ($n, $direction) = @_;
    my $dir_right = [ 0,  1];
    my $dir_left  = [ 0, -1];
    my $dir_up    = [-1,  0];
    my $dir_down  = [ 1,  0];

    $direction ||= 'clockwise';
    if ($direction eq 'anticlockwise') {
        ($dir_right, $dir_left) = ($dir_left, $dir_right);
    }

    my @directions = (undef);
    for my $i (1 .. $n) {
        if ($i % 2 == 1) {
            for (1 .. $i) {
                push @directions, $dir_right;
            }
            for (1 .. $i) {
                push @directions, $dir_down;
            }
        } else {
            for (1 .. $i) {
                push @directions, $dir_left;
            }
            for (1 .. $i) {
                push @directions, $dir_up;
            }
        }
    }

    @directions;
}

#        x     x     x
#     1  2  6  7 15
#     3  5  8 14 16  x
#  x  4  9 13 17 22
#    10 12 18 21 23
#  x 11 19 20 24 25
#     x     x

sub zig_zag_matrix { my ($n, $starting_position_name) = @_;
    $starting_position_name ||= 'top-left';

    my $right      = [ 0,  1];
    my $left       = [ 0, -1];
    my $down       = [ 1,  0];
    my $up         = [-1,  0];

    my $down_right = [ 1,  1];
    my $down_left  = [ 1, -1];
    my $up_right   = [-1,  1];
    my $up_left    = [-1, -1];

    if ($starting_position_name eq 'top-right') {
        ($right, $left) = ($left, $right);
        ($up_right, $down_left) = ($up_left, $down_right);
    } elsif ($starting_position_name eq 'bottom-left') {
        ($down, $up) = ($up, $down);
        ($up_right, $down_left) = ($down_right, $up_left);
    } elsif ($starting_position_name eq 'bottom-right') {
        ($right, $left) = ($left, $right);
        ($down, $up) = ($up, $down);
        ($up_right, $down_left) = ($down_left, $up_right);
    }

    my @m = allocate_matrix($n, $n);
    my ($x, $y) = translate_starting_position_name_to_coords($n, $n, $starting_position_name);

    for my $i (1 .. $n * $n) {
        $m[$x][$y] = $i;

        # horizontal/vertical
        my ($hvdx, $hvdy) = @{ $right };

        # diagonal
        my ($ddx, $ddy) = @{ $up_right };

        # if we are diagonally out of bounds
        my ($nx, $ny) = ($x + $ddx, $y + $ddy);
        if (coords_out_of_bounds($nx, $ny, $n, $n)) {
            # if we are horizontally/vertically out of bounds
            ($nx, $ny) = ($x + $hvdx, $y + $hvdy);
            if (coords_out_of_bounds($nx, $ny, $n, $n)) {
                # flip
                ($right, $down) = ($down, $right);
                ($hvdx, $hvdy) = @{ $right };
            }

            # move horizontally/vertically
            ($x, $y) = ($x + $hvdx, $y + $hvdy);

            # flip
            ($right, $down) = ($down, $right);
            ($up_right, $down_left) = ($down_left, $up_right);
        } else {
            # move diagonally
            ($x, $y) = ($nx, $ny);
        }
    }

    @m;
}

sub coords_out_of_bounds { my ($x, $y, $r, $c) = @_;
    return 1 if $x < 0 || $y < 0 || $x == $r || $y == $c;
    return 0;
}

# translate_starting_position_name_to_coords(4, 3, 'top-left');
# translate_starting_position_name_to_coords(4, 3, 'top-right');
# translate_starting_position_name_to_coords(4, 3, 'bottom-left');
# translate_starting_position_name_to_coords(4, 3, 'bottom-right');
sub translate_starting_position_name_to_coords { my ($r, $c, $sp_name) = @_;
    return      0,      0 if $sp_name eq 'top-left';
    return      0, $c - 1 if $sp_name eq 'top-right';
    return $r - 1,      0 if $sp_name eq 'bottom-left';
    return $r - 1, $c - 1 if $sp_name eq 'bottom-right';
    die "Invalid starting position name: '$sp_name'";
}

sub allocate_matrix { my ($r, $c) = @_;
    map { [ (undef) x $c ] } 1 .. $r;
}


sub print_matrix { my ($r, $c, @matrix) = @_;
    my $padding_left = length ''. $r * $c;
    # say $padding_left;
    say join ' ', map { sprintf '%*d', $padding_left, $_ // -1 } @$_ for @matrix;
}

# use lib 'H:/xdir/new-perl5/my-repos/postmortem';
# use Postmortem ignore => qw|p|;

