# Gulp Tasks

Each of the files in this folder export a function that can be called as a gulp 
task. The name of the task is the name of the file. IE,

    list.js => 'gulp list'
    
There are some helper methods for developing tasks 
in `modules/task-utilities.js`. Review the sample tasks to see how those helpers
are used.

Each task should accept a `-h` flag. If present, help text will print to the
console, and the task will exit.

If you adhere to this pattern, you can see a list of available tasks with:

    gulp list
    
Then, get help for any task with:

    gulp taskName -h
    

