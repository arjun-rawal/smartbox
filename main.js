var numOfTasks = -0;
var x;

localStorage.clear();
// function showPrevTasks(){
//     for (var i =0;i<localStorage.length;i++){
//         x = localStorage.getItem(i.toString());
//         displayTasks(x);
//     }


}
// function newTask(){
//     let taskName = prompt("Task Name: ", "task")
//     displayTasks(taskName);
// }

// function displayTasks(taskName){
//     //creates a paragraph with the task name
    
//     const td = document.getElementById("tasks");
//     const para = document.createElement("p");
//     para.className="tasks"
//     const node = document.createTextNode(taskName);
//     para.appendChild(node); 
//     td.appendChild(para);

//     //store task locally
//     localStorage.setItem(numOfTasks.toString(), taskName);
//     numOfTasks++;
// }

function Blue(){

    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['9f5cd3d8-1735-4301-80af-b0c41c4aac5e'] // Required to access service later.
      })
      .then(device => {
        return device.gatt.connect();
      })
      .then(server => {
        return server.getPrimaryService('9f5cd3d8-1735-4301-80af-b0c41c4aac5e');
      })
      .then(service => {
        return service.getCharacteristic('b0956118-a560-47d8-8a99-ea714782bd37');
      })
      .then(characteristic => {
        x=characteristic;
         return lockBlue();
         
       // characteristic.writeValue(Uint8Array.of(1));
    })
    .catch(error => {
        document.getElementById("asdf").innerHTML += ('Argh! ' + error);
      });
      }
var x;
    function lockBlue(){
        x.writeValue(Uint8Array.of(1));
    }

    function unlockBlue(){
        x.writeValue(Uint8Array.of(3));
    }


