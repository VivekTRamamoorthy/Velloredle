


const wordOfTheDay = "VELLORE"
const answerLetters = [...wordOfTheDay];
var currentGuess=[];
var guessedWords=[];
function init(){
    let inputSection = document.getElementById("input-section")
    answerLetters.forEach((letter,letterNo) => {
        elem = document.createElement("input")
        elem.type = "text";
        elem.id='inputLetter'+letterNo;
        elem.name = 'letter'+letterNo;
        elem.classList.add("letter");
        elem.classList.add("input");
        console.log(letter)
        elem.maxLength="1";
        elem.oninput=function(e){
            console.log(e);
            nextelem = document.getElementById("inputLetter"+(letterNo+1));
            if (nextelem){
                nextelem.focus(); // focus next letter automatically
            }
            
        };
        inputSection.appendChild(elem);
        
        
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
            document.getElementById('inputLetter'+letterNo).classList.add('invalid');
            setTimeout(document.getElementById('inputLetter'+letterNo).classList.remove('invalid'),2000)
            passed = false;
        }
        currentGuess[letterNo] = inputLetter.toUpperCase();
        console.log(inputLetter)
    }
    
    if (passed){
        guessedWords.push(currentGuess);
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
    }
    
    
    
    
}

window.addEventListener("keydown",function(e){
    console.log(e)
    if (e.keyCode ===13){
        submit();
    }
    
})

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

