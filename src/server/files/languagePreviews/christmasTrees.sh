#!/bin/bash
# Christmas tree ASCII drawer
# works nicest for odd integers
ROWS=7
COLUMNS=15

spaces() {
  for ((i=0; i<$1; i++)) ; do
    echo -n " "
  done 
}

stars() {
  for ((i=0; i<$1; i++)) ; do
    echo -n "*"
  done
  echo ""
}

display_tree() {
    local rows=$1
    local columns=$2

    # render
    for (( r=1; r <= $1; r++ )); do
      s=$(( (((columns-1) * (r-1)/(rows-1) + 1)/2)*2 +1 ))
      spaces $(((columns-s)/2))
      stars $s
    done
}

display_tree $ROWS $COLUMNS
