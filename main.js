var numOfTasks = -0;
var x;
function showPrevTasks(){
    for (var i =0;i<localStorage.length;i++){
        x = localStorage.getItem(i.toString());
        displayTasks(x);
    }


}

function newTask(){
    let taskName = prompt("Task Name: ", "task")
    displayTasks(taskName);
}

function displayTasks(taskName){
    //creates a paragraph with the task name
    
    const td = document.getElementById("tasks");
    const para = document.createElement("p");
    para.className="tasks"
    const node = document.createTextNode(taskName);
    para.appendChild(node); 
    td.appendChild(para);

    //store task locally
    localStorage.setItem(numOfTasks.toString(), taskName);
    numOfTasks++;
}