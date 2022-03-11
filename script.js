


const wordOfTheDay = "BHARATH"
const answerLetters = [...wordOfTheDay]; // converts to character array
var currentGuess=[]; // will contain the current word guess in char array form
var guessedWords=[]; // will contain array of strings of the words guessed so far

// Retrieving data from local storage
window.addEventListener('load',()=>{
    let guessedWordsLocal = localStorage.getItem("guessedWords")
    console.log(guessedWordsLocal)
    if(guessedWordsLocal){
        guessedWords = guessedWordsLocal;
        console.log("loaded from local storage")
    }
})

function clearLocal(){
    localStorage.setItem("guessedWords",[])
    return 0;
}


// initial set up function
function init(){


    let elem;
    answerLetters.forEach((_letter,letterNo) => {
        elem = document.createElement("input")
        elem.type = "text";
        elem.id='inputLetter'+letterNo;
        elem.name = 'letter'+letterNo;
        elem.classList.add("letter");
        elem.classList.add("input");
        elem.maxLength="1";
        elem.oninput=function(e){
            console.log(e);
            if (e.inputType=="deleteContentBackward"){ // backspace key press
                let prevelem = document.getElementById("inputLetter"+(letterNo-1));
                if (prevelem){
                    prevelem.focus(); // focus prev letter 
                }
                return
            }
            if (!isLetter(e.data)){
            document.getElementById('inputLetter'+letterNo).classList.add('invalid');
            return
            }
            
            let nextelem = document.getElementById("inputLetter"+(letterNo+1));
            if (nextelem){
                nextelem.focus(); // focus next letter automatically
            }
            
        };
        let inputSection = document.getElementById("input-section");
        inputSection.appendChild(elem);
        
        // bring first letter in focus
        document.getElementById("inputLetter0").focus();
        
    })


    
    
}

init()

var firstsubmit = true;
function submit(){
    // clearing instructions on first submit
    if(firstsubmit){
        let boardElem = document.getElementById("game-board");
        boardElem.innerHTML="";
        firstsubmit =  false
    }
    // checks
    let passed = true
    
    for (let letterNo = 0; letterNo < wordOfTheDay.length; letterNo++) {
        const inputElem = document.getElementById('inputLetter'+letterNo);
        let inputLetter = inputElem.value;
        if(!isLetter(inputLetter)){

            passed = false;
        }
        currentGuess[letterNo] = inputLetter.toUpperCase();
        console.log(inputLetter)
    }
    
    if (passed){
        guessedWords.push(currentGuess.join(''));
        localStorage.setItem("guessedWords",guessedWords)
        // add to the board
        
        
        let previousWord = document.createElement("div");
        previousWord.classList.add("previous-word");
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
            
            previousWord.appendChild(letterElem)
        })
        let boardElem = document.getElementById("game-board");
        boardElem.appendChild(previousWord)

        // word found
        if(wordOfTheDay == currentGuess.join("")){
            let inputSection = document.getElementById("input-section");
            inputSection.innerHTML = "<div class='congratulations'>Congratulations! </div>";
            let submitButton = document.getElementById("submit-button");
            submitButton.style="display:none";

        }

        // clear after submitting a word
        for (let letterNo = 0; letterNo < answerLetters.length; letterNo++) {
            let letterElem = document.getElementById("inputLetter"+letterNo);
            letterElem.value=""

            
        }

        // bring focus to  the first letter
        document.getElementById("inputLetter0").focus();


    }
    
    
    
    
}

window.addEventListener("keydown",function(e){
    console.log(e)
    if (e.keyCode ===13){
        submit();
    }
    if (e.key=="Backspace"){
    let prevelem = document.getElementById("inputLetter"+(letterNo-1));
                if (prevelem){
                    prevelem.focus(); // focus prev letter 
                }
            }
    
})

function isLetter(str) {
    if(str){
    return str.length === 1 && str.match(/[a-z]/i);
    }
}

