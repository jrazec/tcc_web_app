
// // ---------------------- Buttons
// const updateBtns = document.querySelectorAll(`.update-btn`);
// const deleteBtns = document.querySelectorAll(`.delete-btn`);

// // ---------------------- Update Modals
// const npcIdHead = document.querySelector('#npc-id-head');
// const confirmUpdate = document.querySelector('#confirm-update');



// function putRequest(transferData) { // Accepts Objects
//   let options = {
//     method : "PUT",
//     headers :  {
//       'Content-Type' : 'application/json'
//     },
//   }
//   const data = transferData;
//   options.body = JSON.stringify(data);
//   fetch(url, options)
//   .then(res => res.json())
//   .then(data => console.log(data));
// }

// function loadUpdateModalBtn() {
//   confirmUpdate.addEventListener('click',(e)=>{
//     putRequest({
//       npc_id: id,
//       npc_name : "",
//       npc_desc : "",
//       npc_img : "",
//       coordinate : ""
//     });          
//   });
  
// }

// function loadUpdateBtns(){
//   updateBtns.forEach((button)=>{
//     button.addEventListener('click',(e)=>{
//          id = e.target.id;// id here is the class name of the edit button, also the id of primary key
//          npcIdHead.textContent = id; // NPC header is the header of update  
//          console.log(id)
//         // Will store the id of the button which corresponds to the primary key
//         // So there should be a universal variable that corresponds to the id; once a button is clicked, will send update request.
//     });
//   });
//   console.log("LoadUpdateBtns")
// }

// console.log("ds")
 

const addNewBtn = document.querySelector('#add-new');
const addModal = document.querySelector('#add-modal');

addNewBtn.addEventListener('click',()=>{
  $('#add-modal').modal('toggle')
});


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


function clearNpcInput() {
  // For Npc
  document.getElementById('add-npc-id').value = "";
  document.getElementById('add-npc-name').value = "";
  document.getElementById('add-npc-desc').value = "";
  document.getElementById('add-npc-image').value = "";
  document.getElementById('add-npc-coor').value = "";
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


function deleteRequest(deleteId) {

  fetch('/admin/setup/npc/delete/' + deleteId, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id: deleteId
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
