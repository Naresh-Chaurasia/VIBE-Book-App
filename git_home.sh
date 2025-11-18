#!/bin/bash

clear

git add .

my_date=$(date)

echo $my_date

git commit -m "Home Page Category::$my_date"

git push origin book-app-with-filters