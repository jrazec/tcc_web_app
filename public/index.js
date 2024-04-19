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
function deleteRequest(deleteId) {

  fetch('/admin/setup/npc/delete/' + deleteId, {
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
  let id = document.forms["update-form"]["npc-id"].value;
  let name = document.forms["update-form"]["npc-name"].value;
  let desc = document.forms["update-form"]["npc-desc"].value;
  let image = document.forms["update-form"]["npc-image"].value;
  let coordinates = document.forms["update-form"]["coordinates"].value;

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
   const npcIdList = document.querySelectorAll('.npcPkId');

    let id = document.forms["add-form"]["add-npc-id"].value;
    let name = document.forms["add-form"]["add-npc-name"].value;
    let desc = document.forms["add-form"]["add-npc-desc"].value;
    let image = document.forms["add-form"]["add-npc-image"].value;
    let coordinates = document.forms["add-form"]["add-coordinates"].value;

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

// Initializing Of All Lists
async function initialize() {
  floorList = await initializeFloor();
  bldgList = await initializeBuilding();
  availNpcList = await initializeAvailNpcs();
  availRoomsList = await initializeAvailRooms();
  updateFloorOptions(floorList);
  updateBldgOptions(bldgList);
  putAvailNpcsRooms(availNpcList,availRoomsList);
  console.log("Building List:", bldgList[0].name);
  console.log("Floor List:", floorList);
}

// Once the DOMContent is loaded, will set event listeners
document.addEventListener("DOMContentLoaded", function() {
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

initialize();
