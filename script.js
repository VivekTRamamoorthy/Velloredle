// VELLOREDLE 
// By vetti fellows 

var wordOfTheDay 
var firstsubmit = true;
var guessedWords=[] // will contain array of strings of the words guessed so far

var currentGuess=[];
var letterInFocus=0;
var noOfTries = 0;
// Fetch the word of the day
getWordOfTheDay();

// Retrieving data from local storage if present
// window.addEventListener('load',fetchLocalStorage)



// initialising 
init()



// Get the word of the day from server
function getWordOfTheDay(){
    wordOfTheDay = "CRANE";
    
    // fetching from the databased :
}


function fetchLocalStorage(){
    let guessedWordsLocal = localStorage.getItem("guessedWords")
    console.log({guessedWordsLocal})
    if(guessedWordsLocal){
        guessedWords = guessedWordsLocal;
        noOfTries = guessedWords.length;
        console.log("loaded from local storage")
        guessedWords.forEach(word => submitWord(word))
        
    }
    
    
}

// initial set up function 
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
        
        // bring first letter in focus
        bringToFocus("inputLetter0");
        
    }
    
    
    
    
}

function bringToFocus(inputLetterId){
    // remove focus from all elements
    let allInputLetters=document.querySelectorAll(".letter.input");
    allInputLetters.forEach(elem => elem.classList.remove("infocus"));
    // bring current element in focus
    let curentLetterElem = document.getElementById(inputLetterId);
    curentLetterElem.classList.add("infocus");
    
}

function submitWord(submittedWord){
    
    // clearing instructions on first submit
    if(firstsubmit){
        let boardElem = document.getElementById("game-board");
        boardElem.innerHTML="";
        firstsubmit =  false;
    }
    
    // checks
    let passed = true
    for (let letterNo = 0; letterNo < submittedWord.length; letterNo++) {
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
        guessedWords.push(submittedWord.join(''));
        localStorage.setItem("guessedWords",guessedWords);
        
        appendWordToBoard(submittedWord)
        
        // word found
        if(wordOfTheDay == submittedWord.join("")){
            let inputSection = document.getElementById("input-section");
            inputSection.innerHTML = "<div class='congratulations'>Congratulations! </div>";
            let onScreenKeyboard = document.getElementById("onscreen-keyboard");
            onScreenKeyboard.innerHTML = "<div class='congratulations'>Well done! </div>";
            
        }else{
            
            // clear after submitting a word
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
}

window.addEventListener("keydown",function(e){
    pressKey(e.key);    
})

function isLetter(str) {// "a" -> true "." -> false
    if(str){
        return str.length === 1 && str.match(/[a-z]/i);
    }
}


// function to clear the local storage of guessedWords
function clearLocal(){
    localStorage.setItem("guessedWords",[])
    return 0;
}

//add a word to the board
function appendWordToBoard(currentGuess){
    let currentGuessElement = document.createElement("div");
    currentGuessElement.classList.add("previous-word");
    currentGuess.forEach((letter,index) =>{
        let letterElem= document.createElement("div");
        letterElem.classList.add("letter")
        if (wordOfTheDay[index]===letter){
            letterElem.classList.add("correct")
        }else if(wordOfTheDay.includes(letter)){
            letterElem.classList.add("shuffled")
        }else{
            letterElem.classList.add("none")
        }
        letterElem.innerText=letter;
        
        currentGuessElement.appendChild(letterElem)
    })
    let boardElem = document.getElementById("game-board");
    boardElem.appendChild(currentGuessElement)
}



// ON SCREEN KEYBOARD
setupOnScreenKeyboard()

function setupOnScreenKeyboard(elemId){
    let keys = document.querySelectorAll(".key");
    keys.forEach(keyElem=>{
        let keyId=keyElem.id;
        let splitId = keyId.split('-');
        let key=splitId[splitId.length-1];
        console.log('Key activated: '+key);
        keyElem.addEventListener('touchstart',function(event){
            event.preventDefault();
            let keyId=event.target.id;
            let splitId = keyId.split('-');
            let key=splitId[splitId.length-1];
            pressKey(key);
            
        })
    })
    
    
    
}

function pressKey(key){
    console.log("key press:"+key)
            if(key.includes("Enter")){
                submitWord(currentGuess);
                return
            }
            if(key.includes("Backspace")){
                let curentLetterElem = document.getElementById("inputLetter"+letterInFocus);
                curentLetterElem.innerText="";
                letterInFocus = Math.max(letterInFocus-1,0);
                // remove focus from all elements
                let allInputLetters=document.querySelectorAll(".letter.input");
                allInputLetters.forEach(elem => elem.classList.remove("infocus"));
                // bring current element in focus
                curentLetterElem = document.getElementById("inputLetter"+letterInFocus);
                curentLetterElem.classList.add("infocus");
                
                return
                
            }
            if(isLetter(key)){
                let curentLetterElem = document.getElementById("inputLetter"+letterInFocus);
                curentLetterElem.innerText = key;
                currentGuess[letterInFocus]=key;
                letterInFocus = Math.min(letterInFocus+1,wordOfTheDay.length-1);
                
                bringToFocus('inputLetter'+letterInFocus)
                
            }
}
