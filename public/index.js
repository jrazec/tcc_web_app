let floorList, bldgList, availNpcList,availRoomsList;
const urlFetch = "http://localhost:3000" 

const addNewBtn = document.querySelector('#add-new');
const addModal = document.querySelector('#add-modal');

// For toggling of Add Modal
addNewBtn.addEventListener('click',()=>{
  $('#add-modal').modal('toggle')
});

// Fetch APIs

// ----> Get methods
async function initializeBuilding() {
  const response = await fetch(`${urlFetch}/admin/buildings`);
  const bldgList = await response.json();
  return bldgList;
}

async function initializeFloor() {
  const response = await fetch(`${urlFetch}/admin/floors`);
  const floorList = await response.json();
  return floorList;
}

async function initializeAvailNpcs() {
  const response = await fetch(`${urlFetch}/admin/npcs`);
  const availNpcList = await response.json();
  return availNpcList;
}

async function initializeAvailRooms() {
  const response = await fetch(`${urlFetch}/admin/rooms`);
  const availRoomsList = await response.json();
  return availRoomsList;
}

// ----> DELETE methods
function deleteRequest(deleteId,route) {

  fetch(`/admin/setup/${route}/delete/` + deleteId, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id: deleteId // Sending the value of id to the delete route
      })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to delete file');
      }
      // Handle successful deletion here
  })
  .catch(error => {
      console.error('Error deleting file:', error);
  });
}


// Input Validators
function validateNpcUpdate() {
  let id = document.forms["update-npc-form"]["npc-id"].value;
  let name = document.forms["update-npc-form"]["npc-name"].value;
  let desc = document.forms["update-npc-form"]["npc-desc"].value;
  let image = document.forms["update-npc-form"]["npc-image"].value;
  let coordinates = document.forms["update-npc-form"]["coordinates"].value;

    if (id == "" || name == "" || coordinates == "" || image == "" || desc == "" || coordinates == "" ) {
      alert("Fill Out All necessary fields");
      return false;
    }  
    
    if (isNaN(id)) {
      alert("ID must be a NUMBER");
      return false;
    }
  return true;
}

function validateNpcAdd(){
  console.log("Npc")
   const npcIdList = document.querySelectorAll('.npcPkId');

    let id = document.forms["add-npc-form"]["add-npc-id"].value;
    let name = document.forms["add-npc-form"]["add-npc-name"].value;
    let desc = document.forms["add-npc-form"]["add-npc-desc"].value;
    let image = document.forms["add-npc-form"]["add-npc-image"].value;
    let coordinates = document.forms["add-npc-form"]["add-npc-coordinates"].value;

    if (name == "" || coordinates == "" || image == "" || desc == "" || coordinates == "" ) {
      alert("Fill Out All necessary fields");
      return false;
    }  
    
    if (isNaN(id)) {
      alert("ID must be a NUMBER");
      return false;
    }
    for(let i = 0; i < npcIdList.length; i++){
      let cellId = npcIdList[i].textContent.trim();
      if(parseInt(cellId) === parseInt(id)) {
        
        alert("KEY CANNOT BE Used more than once!")
        return false;
      }
    };
    
    return true;

}

function validateRoomAdd(){
  console.log("Room")
  const npcIdList = document.querySelectorAll('.npcPkId');

   let id = document.forms["add-room-form"]["add-room-id"].value;
   let name = document.forms["add-room-form"]["add-room-name"].value;
   let desc = document.forms["add-room-form"]["add-room-desc"].value;
   let image = document.forms["add-room-form"]["add-room-image"].value;
   let bldg = document.forms["add-room-form"]["bldg"].value;
   let floor = document.forms["add-room-form"]["floor"].value;
   let coordinates = document.forms["add-room-form"]["add-room-coordinates"].value;

   if (name === "" || coordinates === "" || image === "" || desc === "" || coordinates === "" || bldg === "" || floor === "") {
     alert("Fill Out All necessary fields");
     return false;
   }  
   
   if (isNaN(id)) {
     alert("ID must be a NUMBER");
     return false;
   }
   for(let i = 0; i < roomIdList.length; i++){
     let cellId = npcIdList[i].textContent.trim();
     if(parseInt(cellId) === parseInt(id)) {
       
       alert("KEY CANNOT BE Used more than once!")
       return false;
     }
   };
   
   return true;

}

function validateQuestAdd(){
  const questIdList = document.querySelectorAll('.questPkId');
  console.log("validated")
   let id = document.forms["add-quest-form"]["add-quest-id"].value;
   let type = document.forms["add-quest-form"]["add-quest-type"].value;
   let question = document.forms["add-quest-form"]["add-question"].value;
   let npcDesig = document.forms["add-quest-form"]["add-npc-desig"].value;
   let roomDesig = document.forms["add-quest-form"]["add-room-desig"].value;
   let coordinates = document.forms["add-quest-form"]["add-quest-coordinates"]
   let ans = document.forms["add-quest-form"]["add-answer"].value;
   let c1 = document.forms["add-quest-form"]["add-choice-1"].value;
   let c2 = document.forms["add-quest-form"]["add-choice-2"].value;
   let c3 = document.forms["add-quest-form"]["add-choice-3"].value;
   const choices = [ans,c1,c2,c3];
   const duplicates = choices.filter((item, index) => choices.indexOf(item) !== index);
  
   if (duplicates.length > 0){
    alert("Cmon man! Choices Should be different..");
    return false;
   }

   if (type == "" || coordinates == "" || question == "" || ans == "" || c1 == "" || c2 == "" || c3 == "" || (npcDesig === "" && roomDesig === "")) {
     alert("Fill Out All necessary fields");
     return false;
   }  
   
   if (isNaN(id)) {
     alert("ID must be a NUMBER");
     return false;
   }
   for(let i = 0; i < questIdList.length; i++){
     let cellId = questIdList[i].textContent.trim();
     if(parseInt(cellId) === parseInt(id)) {
       
       alert("KEY CANNOT BE Used more than once!")
       return false;
     }
   };
   
   return true;

}

function validateQuestUpdate(){
  const questIdList = document.querySelectorAll('.questPkId');
  console.log("validated")
   let type = document.forms["update-quest-form"]["update-quest-type"].value;
   let question = document.forms["update-quest-form"]["update-question"].value;
   let npcDesig = document.forms["update-quest-form"]["update-npc-desig"].value;
   let roomDesig = document.forms["update-quest-form"]["update-room-desig"].value;
   let coordinates = document.forms["update-quest-form"]["update-quest-coordinates"] //sd
   let ans = document.forms["update-quest-form"]["update-answer"].value;
   let c1 = document.forms["update-quest-form"]["update-choice-1"].value;
   let c2 = document.forms["update-quest-form"]["update-choice-2"].value;
   let c3 = document.forms["update-quest-form"]["update-choice-3"].value;
  const choices = [ans,c1,c2,c3];
  const duplicates = choices.filter((item, index) => choices.indexOf(item) !== index);
 
  if (duplicates.length > 0){
   alert("Cmon man! Choices Should be different..");
   return false;
  }
  
  if (coordinates == "" || question == "" || ans == "" || c1 == "" || c2 == "" || c3 == "" ) {
    alert("Fill Out All necessary fields");
    return false;
  }  

  for(let i = 0; i < questIdList.length; i++){
    let cellId = questIdList[i].textContent.trim();
    if(parseInt(cellId) === parseInt(id)) {
      
      alert("KEY CANNOT BE Used more than once!")
      return false;
    }
  };
  
  return true;
  
}

// Clearing Input buttons
function clearNpcInput() {
  // For Npc
  document.getElementById('add-npc-id').value = "";
  document.getElementById('add-npc-name').value = "";
  document.getElementById('add-npc-desc').value = "";
  document.getElementById('add-npc-image').value = "";
  document.getElementById('add-npc-coor').value = "";
}



// Options Manipulation - ADD Modal

// Updating the Building List
async function updateBldgOptions(bldgList) {
  if (document.getElementById("bldg") === null) {
    return;
  }
  const buildingId = document.getElementById("bldg");
  // Putting up the bldg options
  for (let i = 0; i < bldgList.length; i++) {
    let option = document.createElement("option");
    option.value = bldgList[i].id;
    option.textContent = `${bldgList[i].name}`;
    buildingId.appendChild(option);
  }
}

// Updating the Floor List ONCE a Certain Building is Selected
async function updateFloorOptions(floorList) {
  if (document.getElementById("bldg") === null) {
    return;
  }
  let buildingId = document.getElementById("bldg").value;
  let floorSelect = document.getElementById("floor");
  // will use fetch api here                  
  floorSelect.textContent = ""; 

  if (buildingId !== "") {
    var filteredFloors = floorList.filter(function(floor) {
      console.log(floor.bldg_id)
      return String(floor.bldg_id) === buildingId;
    });
    // Putting up the floor options
    for (let i = 0; i < filteredFloors.length; i++) {
      let option = document.createElement("option");
      option.value = `${filteredFloors[i].id}`;
      option.textContent = `${filteredFloors[i].num}`;
      floorSelect.appendChild(option);
    }
  }
}

// Putting Up the Available NPCs That has no Designated Npc
async function putAvailNpcsRooms(availNpcList,availRoomsList) {
  if(document.querySelector('#add-npc-desig') === null) {
    return;
  }
  const addNpcDesig = document.querySelector('#add-npc-desig');
  const addRoomDesig = document.querySelector('#add-room-desig');

  // For Avail NPC Selection
  for (let i = 0; i < availNpcList.length; i++) {
    let option = document.createElement("option");
    option.value = availNpcList[i].npc_id;
    option.textContent = `${availNpcList[i].npc_name}`;
    addNpcDesig.appendChild(option);
  }

    // For Avail Roum Selection
    for (let i = 0; i < availRoomsList.length; i++) {
      let option = document.createElement("option");
      option.value = availRoomsList[i].room_id;
      option.textContent = `${availRoomsList[i].room_name}`;
      addRoomDesig.appendChild(option);
    }
}

async function updateBuildingSingle () {
  if(document.querySelector('#update-bldg') === null) {
    return;
  }
  const bldgUpdateSelection = document.querySelector('#update-bldg');
  const buildingList = await initializeBuilding();
  console.log("UPBS",buildingList)
  // Putting up the bldg options
  for (let i = 0; i < buildingList.length; i++) {
    let option = document.createElement("option");
    option.value = buildingList[i].id;
    option.textContent = `${buildingList[i].name}`;
    bldgUpdateSelection.appendChild(option);
  }
}

// Updating the Floor List ONCE a Certain Building is Selected
async function updateFloorSingle() {
  if(document.getElementById("update-bldg") === null) {
    return;
  }
  let buildingId = document.getElementById("update-bldg").value;
  let floorSelect = document.getElementById("update-floor");
  flrList = await initializeFloor();
  // will use fetch api here                  
  floorSelect.textContent = ""; 

  if (buildingId !== "") {
    var filteredFloors = flrList.filter(function(floor) {
      console.log(floor.bldg_id)
      return String(floor.bldg_id) === buildingId;
    });
    // Putting up the floor options
    for (let i = 0; i < filteredFloors.length; i++) {
      let option = document.createElement("option");
      option.value = `${filteredFloors[i].id}`;
      option.textContent = `${filteredFloors[i].num}`;
      floorSelect.appendChild(option);
    }
  }
}


// Putting Up the Available NPCs That has no Designated Npc
async function putUpAvailNpcsRooms() {
  if(document.querySelector('#update-npc-desig') === null) {
    return;
  }
  const availNpcList =  await initializeAvailNpcs();
  const availRoomsList = await initializeAvailRooms();

  const updateNpcDesig = document.querySelector('#update-npc-desig');
  const updateRoomDesig = document.querySelector('#update-room-desig');

  // For Avail NPC Selection
  for (let i = 0; i < availNpcList.length; i++) {
    let option = document.createElement("option");
    option.value = availNpcList[i].npc_id;
    option.textContent = `${availNpcList[i].npc_name}`;
    updateNpcDesig.appendChild(option);
  }

    // For Avail Roum Selection
    for (let i = 0; i < availRoomsList.length; i++) {
      let option = document.createElement("option");
      option.value = availRoomsList[i].room_id;
      option.textContent = `${availRoomsList[i].room_name}`;
      updateRoomDesig.appendChild(option);
    }
}

// Initializing Of All Lists
async function initialize() {
  floorList = await initializeFloor();
  bldgList = await initializeBuilding();
  availNpcList = await initializeAvailNpcs();
  availRoomsList = await initializeAvailRooms();
   updateFloorOptions(floorList);
   updateBldgOptions(bldgList);
   putAvailNpcsRooms(availNpcList,availRoomsList);
   putUpAvailNpcsRooms(availNpcList,availRoomsList)
  console.log("Building List:", bldgList[0].name);
  console.log("Floor List:", floorList);
}

// Once the DOMContent is loaded, will set event listeners
document.addEventListener("DOMContentLoaded", function() {
  if(document.getElementById("add-npc-desig") === null) {
    return;
  }
  const npcSelect = document.getElementById("add-npc-desig");
  const roomSelect = document.getElementById("add-room-desig");
  
  npcSelect.addEventListener("change", function() {
    if (npcSelect.value) {
      roomSelect.disabled = true;
      roomSelect.value = "";
    } else {
      roomSelect.disabled = false;
    }
  });

  roomSelect.addEventListener("change", function() {
    if (roomSelect.value) {
      npcSelect.disabled = true;
      npcSelect.value = "";
    } else {
      npcSelect.disabled = false;
    }
  });
  
});

async function disableOtherButton(){
  if(document.getElementById("update-npc-desig") === null) {
    return;
  }
  const npcSelect = document.getElementById("update-npc-desig");
  const roomSelect = document.getElementById("update-room-desig");
  
  npcSelect.addEventListener("change", function() {
    if (npcSelect.value) {
      roomSelect.disabled = true;
      roomSelect.value = "";
    } else {
      roomSelect.disabled = false;
    }
  });

  roomSelect.addEventListener("change", function() {
    if (roomSelect.value) {
      npcSelect.disabled = true;
      npcSelect.value = "";
    } else {
      npcSelect.disabled = false;
    }
  });
}

initialize();
