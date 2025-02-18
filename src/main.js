
import { personalityTypes} from './api.js';
import { Client, Databases, ID, Query } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_PROJECT_ID);

const databases = new Databases(client);

// Loads api into the database
// let promises = []
// for(let i = 0; i < personalityTypes.length; i++) {
// const promise = databases.createDocument(
//     import.meta.env.VITE_DATABASE_ID,
//     import.meta.env.VITE_COLLECTION_ID,
//     ID.unique(), 
//       personalityTypes[i]
//     )
//     promises.push(promise);
//   }

// Promise.all(promises).then(function (response) {
//     console.log(response);
// }, function (error) {
//     console.log(error);
// });

async function returnMeme(archetype, politic, confident){
  let result
  if (politic == 'unanswered') {
    result = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID, 
      import.meta.env.VITE_COLLECTION_ID, 
        [
          Query.equal('archetype', 'happy'),
          Query.equal('politic', 'conservative'),
          Query.equal('confident', false),
        ]
      )
  } else {
    result = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID, 
      import.meta.env.VITE_COLLECTION_ID, 
        [
          Query.equal('archetype', archetype),
          Query.equal('politic', politic),
          Query.equal('confident', confident),
        ]
      )
  }
  
  console.log(result.documents[0])
  let myMeme =  document.getElementById('myMeme')
  myMeme.src=`${result.documents[0]['meme-img-url']}`

  let myInfo = document.getElementById('myInfo')
  myInfo.classList.toggle('hidden')

  let myCaption = document.getElementById('myCaption')
  myCaption.innerText=`${result.documents[0]['caption']}`
 
  let quiz = document.getElementsByClassName('quiz')
  quiz[0].classList.add('hidden')
  quiz[1].classList.add('hidden')
  
  let restart = document.getElementById('restart')
  restart.addEventListener('click', function () {location.reload()})
}


let happy = 0
let sad = 0
let surprised= 0
let fearful = 0
let angry = 0

const submitButton = document.querySelector('button[type="submit"]')
submitButton.addEventListener('click', calculateMeme)

function calculateMeme(e) {
  for (let i = 1; i <6; i++) {
    const selectedRadio = document.querySelector(`input[name="question${i}"]:checked`)
    if (selectedRadio) {
      const selectedValue = selectedRadio.value;
      if (selectedValue == 'happy') happy++
      if (selectedValue == 'sad') sad++
      if (selectedValue == 'surprised') surprised++
      if (selectedValue == 'fearful') fearful++
      if (selectedValue == 'angry') angry++
    } else {
      console.log('No option selected');
    }
  }
  let feelings = ['happy', 'sad', 'surprised', 'fearful', 'angry']
  let feeling = max([happy, sad, surprised, fearful, angry])  
  let archetype = feeling.length == 1? feelings[feeling] : 'confused'
  let politic = !document.querySelector(`input[name="question6"]:checked`)? 'unanswered': document.querySelector(`input[name="question6"]:checked`).value
  let confident = !document.querySelector(`input[name="question7"]:checked`)? false: document.querySelector(`input[name="question7"]:checked`).value == 'confident' ? true : false
  returnMeme(archetype, politic, confident)
}

function max(arr) {
  var max = -1;
  var maxIndices = [];
  for (var i = 0; i < arr.length; i++) {
      if (arr[i] === max) {
        maxIndices.push(i);
      } else if (arr[i] > max) {
          maxIndices = [i];
          max = arr[i];
      }
  }
  return maxIndices;
}