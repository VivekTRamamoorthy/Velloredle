// VELLOREDLE 

var wordOfTheDay 
var firstSubmit = true;
var guessedWords=[] 
var currentGuess=[];
var letterInFocus=0;
var noOfTries = 0;
var maxNoOfTries=6;
var fiveLetterWords



setupOnScreenKeyboard();

window.addEventListener("keydown",window.fn = function(e){
    pressKey(e.key);    
})



fetch("velloredle/src/wordlists/fiveletter.txt")
.then((result) => {
    result.text()
    .then(data=> {
        fiveLetterWords = data.split("\n");
        getWordOfTheDay();
    })
})


function getWordOfTheDay(){
    // fetching from the database
    let backendURL = "https://3agu6w2r37.execute-api.ap-south-1.amazonaws.com/default/Velloredle";
    let today = new Date();
    let date = today.getDate()+'-'+(today.getMonth()+1).toString()+'-'+today.getFullYear().toString();

    let data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            date:date,
         })
    }
    console.log(data)
    fetch(backendURL,data )
    .then((response)=>{
        return response.json();})
        .then((body)=>{
        let word = body.word;
        if (word){
            wordOfTheDay = word.toUpperCase();
        }
        let wordOfTheDayLocal = localStorage.getItem("wordOfTheDay")
        if (wordOfTheDayLocal != wordOfTheDay ){
            clearLocal();
            localStorage.setItem("wordOfTheDay",wordOfTheDay)
        }
        init();
        fetchLocalStorage();
        return wordOfTheDay;

    })
    .catch(error=>{
        console.log(error)
        wordOfTheDay = "EAGLE";
        init();
        fetchLocalStorage();
        return wordOfTheDay;
    })



}


function fetchLocalStorage(){
    let guessedWordsLocal = localStorage.getItem("guessedWords")
    if(guessedWordsLocal){
        let tempGuessedWords = guessedWordsLocal.split(',')
        guessedWords = [];
        noOfTries = 0;
        tempGuessedWords.forEach(word => submitWord([...word]))
    }
}

function init(){
    // Creating the input boxes
    let elem;
    for (let letterNo = 0; letterNo < wordOfTheDay.length; letterNo++) {
        // creating input element
        elem = document.createElement("div")
        elem.id='inputLetter'+letterNo;
        elem.classList.add("letter");
        elem.classList.add("input");
        let inputSection = document.getElementById("input-section");
        inputSection.appendChild(elem);
        bringToFocus("inputLetter0");
    }
}

function bringToFocus(inputLetterId){
    let allInputLetters=document.querySelectorAll(".letter.input");
    allInputLetters.forEach(elem => elem.classList.remove("infocus"));
    let curentLetterElem = document.getElementById(inputLetterId);
    curentLetterElem.classList.add("infocus");
}

function submitWord(submittedWord){
    // word submit check
    if(   !( fiveLetterWords.includes(submittedWord.join('').toLowerCase()) )   ){
        document.getElementById("input-section").classList.add("not-a-word")
        setTimeout( ()=>{document.getElementById("input-section").classList.remove("not-a-word")} ,200)
        console.log('Not a word')
        return
    }


    // clearing instructions on first submit
    if(firstSubmit){
        let boardElem = document.getElementById("game-board");
        boardElem.innerHTML="";
        firstSubmit =  false;
    }
    
    // checks
    let passed = true
    for (let letterNo = 0; letterNo < wordOfTheDay.length; letterNo++) {
        //  const inputElem = document.getElementById('inputLetter'+letterNo);
        let inputLetter = submittedWord[letterNo];
        if(!isLetter(inputLetter)){
            passed = false;
        }
        submittedWord[letterNo] = inputLetter.toUpperCase();
    }
    
    // if passed
    if (passed){
        // update the set of guessed words in session and local
        guessedWords[noOfTries] = submittedWord.join('');
        localStorage.setItem("guessedWords",guessedWords);
        
        // add to no of tries
        noOfTries = guessedWords.length;
        appendWordToBoard(submittedWord)
        
        //  VICTORY : CONGRATULATIONS
        if(wordOfTheDay == submittedWord.join("")){
            let inputSection = document.getElementById("input-section");
            inputSection.innerHTML = "<div class='congratulations'>Congratulations! </div>";
            let onScreenKeyboard = document.getElementById("onscreen-keyboard");
            onScreenKeyboard.innerHTML = "<div class='congratulations'>Well done! </div>";
            pressKey = function(){};
            return
            
        }
        // GAME OVER
        if (noOfTries>=maxNoOfTries){
            let inputSection = document.getElementById("input-section");
            inputSection.innerHTML = "<div class='congratulations'>GAME OVER! </div>";
            let onScreenKeyboard = document.getElementById("onscreen-keyboard");
            onScreenKeyboard.innerHTML = "<div class='congratulations'> The answer was:"+ wordOfTheDay+ " </div>";
            pressKey = function(){};
            return
        }
        // clear current word after submitting a word
        for (let letterNo = 0; letterNo < currentGuess.length; letterNo++) {
            let letterElem = document.getElementById("inputLetter"+letterNo);
            letterElem.innerText="";
            currentGuess[letterNo]="";
        }
        // bring focus to  the first letter
        letterInFocus =0;
        bringToFocus("inputLetter"+letterInFocus)
    }
}

function isLetter(str) {// "a" -> true "." -> false
    if(str){
        return str.length === 1 && str.match(/[a-z]/i);
    }
}

function clearLocal(){
    localStorage.removeItem("guessedWords")
    localStorage.removeItem("wordOfTheDay")
    return 0;
}

function appendWordToBoard(currentGuess){
    let currentGuessElement = document.createElement("div");
    currentGuessElement.classList.add("previous-word");
    currentGuess.forEach((letter,index) =>{
        let letterElem= document.createElement("div");
        letterElem.classList.add("letter")
        let letterKey = document.getElementById("key-"+letter.toUpperCase())
        if (wordOfTheDay[index]===letter){
            letterElem.classList.add("correct");
            letterKey.classList.add("correct")
        }else if(wordOfTheDay.includes(letter)){
            letterElem.classList.add("shuffled")
            letterKey.classList.add("shuffled")
        }else{
            letterElem.classList.add("none")
            letterKey.classList.add("none")
        }
        letterElem.innerText=letter;
        
        currentGuessElement.appendChild(letterElem)
    })
    let boardElem = document.getElementById("game-board");
    boardElem.appendChild(currentGuessElement)
}

function setupOnScreenKeyboard(elemId){
    let keys = document.querySelectorAll(".key");
    keys.forEach(keyElem=>{
        let keyId=keyElem.id;
        let splitId = keyId.split('-');
        let key=splitId[splitId.length-1];
        keyElem.addEventListener('touchstart',function(event){
            event.preventDefault();
            let keyId=event.target.id;
            let splitId = keyId.split('-');
            let key=splitId[splitId.length-1];
            pressKey(key);
        })
        keyElem.addEventListener('click',function(event){
            event.preventDefault();
            let keyId=event.target.id;
            let splitId = keyId.split('-');
            let key=splitId[splitId.length-1];
            pressKey(key);
            
        })
    })
}

function pressKey(key){
    if(key.includes("Enter")){
        submitWord(currentGuess);
        return
    }
    if(key.includes("Backspace")){
        let currentLetterElem = document.getElementById("inputLetter"+letterInFocus);
        if(currentLetterElem.innerText==""){
            letterInFocus = Math.max(letterInFocus-1,0);
            // remove focus from all elements
            let allInputLetters=document.querySelectorAll(".letter.input");
            allInputLetters.forEach(elem => elem.classList.remove("infocus"));
            // bring current element in focus
            currentLetterElem = document.getElementById("inputLetter"+letterInFocus);
            currentLetterElem.classList.add("infocus");
        }else{
            currentLetterElem.innerText="";
        }
        return
    }
    if(isLetter(key)){
        let currentLetterElem = document.getElementById("inputLetter"+letterInFocus);
        currentLetterElem.innerText = key.toUpperCase();
        currentGuess[letterInFocus]=key.toUpperCase();
        letterInFocus = Math.min(letterInFocus+1,wordOfTheDay.length-1);
        
        bringToFocus('inputLetter'+letterInFocus)
    }
}
