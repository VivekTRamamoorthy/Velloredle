// VELLOREDLE 

var wordOfTheDay 
var firstSubmit = true;
var guessedWords=[] 
var currentGuess=[];
var letterInFocus=0;
var noOfTries = 0;
var maxNoOfTries=6;
var fiveLetterWords
var victoryMessage =  "Good Job!";
var velloredleEdition = getVelloredleEdition();


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

function getVelloredleEdition(){
    const beginning = new Date('3/18/2022');
    const today = new Date();
    const diffTime = Math.abs(today - beginning);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const edition = diffDays;
    document.getElementById("title").innerText="Velloredle "+edition.toString();
    return edition
}

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
    fetch(backendURL,data )
    .then((response)=>{
        return response.json();
    })
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
            // fetchLocalStorage();
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
            elem.addEventListener('click',()=>{
                bringToFocus("inputLetter"+letterNo)
            })
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
            setTimeout( ()=>{document.getElementById("input-section").classList.remove("not-a-word")} ,400)
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
                if(noOfTries==5){victoryMessage = "Excellent!";}
                if(noOfTries==4){victoryMessage = "Marvellous!";}
                if(noOfTries==3){victoryMessage = "Brilliant!";}
                if(noOfTries==2){victoryMessage = "Wow!";}
                if(noOfTries==1){victoryMessage = "Are you a wizard or what!";}

                inputSection.innerHTML = "<div class='congratulations'>"+victoryMessage+"</div>"
                let onScreenKeyboard = document.getElementById("onscreen-keyboard");
                onScreenKeyboard.innerHTML = "<center><button id='shareBtn' class='share-button' onclick='shareResult()'>Share</button></center>";
            
                pressKey = function(){};
                memeRightWord()
                return
                
            }
            memeWrongWord()
            // GAME OVER
            if (noOfTries>=maxNoOfTries){
                let inputSection = document.getElementById("input-section");
                inputSection.innerHTML = "<div class='congratulations'>Game Over! </div>";
                let onScreenKeyboard = document.getElementById("onscreen-keyboard");
                onScreenKeyboard.innerHTML = "<div class='congratulations'> The answer was: <br>"+ wordOfTheDay+ " </div>";
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
        
        let wordArray = wordOfTheDay.split("");
        let guessArray = currentGuess;
        let letterClasses = new Array(wordOfTheDay.length).fill("none");
        // SHOULD IT BE GREEN?
        for (let iGuess = 0; iGuess < guessArray.length; iGuess++) {
            if(guessArray[iGuess] == wordArray[iGuess] ){
                letterClasses[iGuess] = "correct";
                wordArray[iGuess] = '_'; // this letter will no longer be considered
            }
        }
        // SHOULD IT BE YELLOW?
        for (let iGuess = 0; iGuess < guessArray.length; iGuess++) {
            if(letterClasses[iGuess] != "correct" ){
                for (let iWord = 0; iWord < wordArray.length; iWord++) {
                    if (guessArray[iGuess] == wordArray[iWord] && iGuess !=iWord  ){
                        letterClasses[iGuess] = "shuffled";
                        wordArray[iWord] = '_'; // this letter will no longer be considered
                    }
                    
                }
            }
        }
        
        
        currentGuess.forEach((letter,index) =>{
            let letterElem= document.createElement("div");
            letterElem.classList.add("letter")
            let letterKey = document.getElementById("key-"+letter.toUpperCase())
            if (wordOfTheDay[index]===letter){
                letterKey.classList.add("correct");
                letterKey.classList.remove("none")
                letterKey.classList.remove("shuffled")
            }else if(wordOfTheDay.includes(letter)){
                letterKey.classList.add("shuffled")
                letterKey.classList.remove("none")
            }else{
                letterKey.classList.add("none")
            }
            letterElem.classList.add(letterClasses[index])
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
                currentLetterElem.innerText="";
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
    
    
    
    function memeRightWord(){
        let urls=["https://c.tenor.com/Mc8uL2wLoygAAAAC/emotional-sad.gif",
        "https://static.toiimg.com/thumb/msid-18315515,width-800,height-600,resizemode-75,imgsize-9872,pt-32,y_pad-40/18315515.jpg"];
        
        let imageNo = Math.floor(Math.random()*urls.length);
        let memeDiv = document.getElementById("meme-display")
        memeDiv.classList.add("unhide");
        memeDiv.innerHTML = "";
        let image = document.createElement("img");
        image.src = urls[imageNo];
        memeDiv.appendChild(image)
        setTimeout(()=>{document.getElementById("meme-display").classList.remove("unhide");},2000)
        
    }
    
    function memeWrongWord(){
        let urls=["https://www.researchgate.net/profile/Mallika_Vijaya_Kumar/publication/332812427/figure/fig1/AS:999987974516750@1615427120724/Few-memes-of-English-dialogues-from-Tamil-movies_Q320.jpg",
        "https://cdnaws.sharechat.com/9e0fcaff-c5c1-4e0a-9e3b-61385861e59d-98b8444f-2fd6-49f2-8256-fc48423a7d64_compressed_40.jpg",
        "https://i.pinimg.com/originals/10/83/36/10833618e7697a162f3415cda043635e.jpg",
        "https://qph.fs.quoracdn.net/main-qimg-456dd3c334435b5061d42d756bb211f0.webp",
        "http://commentphotos.com/images/opengraph/CommentPhotos.com_1419362230.jpg",
        "https://doolpictures.files.wordpress.com/2013/11/santhanam_119_35201174620123-e1385189568616.jpg"];
        
        let imageNo = Math.floor(Math.random()*urls.length);
        let memeDiv = document.getElementById("meme-display")
        memeDiv.classList.add("unhide");
        memeDiv.innerHTML = "";
        let image = document.createElement("img");
        image.src = urls[imageNo];
        memeDiv.appendChild(image)
        setTimeout(()=>{document.getElementById("meme-display").classList.remove("unhide");},2000)
        
}

function shareResult(){
    let green  = "🟩";
    let yellow = "🟨";
    let black  = "⬛";
    let today = new Date();
    let resultString ="Velloredle"+velloredleEdition+" ("+(noOfTries).toString()+"/6)"+"\n";
    for (let i = 0; i < guessedWords.length; i++) {
        let wordArray = wordOfTheDay.split("");
        let guessArray = guessedWords[i].split("");
        let letterClasses = new Array(wordOfTheDay.length).fill(black);
        // SHOULD IT BE GREEN?
        for (let iGuess = 0; iGuess < guessArray.length; iGuess++) {
            if(guessArray[iGuess] == wordArray[iGuess] ){
                letterClasses[iGuess] = green;
                wordArray[iGuess] = '_'; 
            }
        }
        // SHOULD IT BE YELLOW?
        for (let iGuess = 0; iGuess < guessArray.length; iGuess++) {
            if(letterClasses[iGuess] != green ){
                for (let iWord = 0; iWord < wordArray.length; iWord++) {
                    if (guessArray[iGuess] == wordArray[iWord] && iGuess !=iWord  ){
                        letterClasses[iGuess] = yellow;
                        wordArray[iWord] = '_'; 
                    }
                    
                }
            }
        }
        resultString=resultString.concat(letterClasses.join("")+"\n")
    }
    console.log(resultString); 
    if (navigator.share === undefined){
        navigator.clipboard.writeText(resultString)
        .then(()=>{
            Swal.fire('Copied to clipboard')

        })
        .catch((err) =>{
            Swal.fire('Failed to copy');
        })
    }
    else{
        let shareButton = document.getElementById("shareBtn")
        shareButton.addEventListener("click", () => {
            navigator.share({ title: "Velloredle "+velloredleEdition, text: resultString })
            .then(()=>{
                console.log("Shared successfully");
            })
            .catch(()=>{
                console.log("Share failed.");
            })
        })
    }
}



