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
            letterInFocus =letterNo;
            bringToFocus("inputLetter"+letterInFocus)
        })
        let inputSection = document.getElementById("input-section");
        inputSection.appendChild(elem);
        letterInFocus =0;
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
            
            setTimeout( ()=>{ inputSection.innerHTML = "<div class='congratulations'>"+victoryMessage+"</div>"},6000)
            let onScreenKeyboard = document.getElementById("onscreen-keyboard");
            setTimeout( ()=>{onScreenKeyboard.innerHTML = "<center><button id='shareBtn' class='share-button' onclick='shareResult()'>Share</button></center>";},6000)
            
            pressKey = function(){};
            setTimeout( ()=>{ memeRightWord()},3000)
            return
            
        }
        setTimeout( ()=>{ memeWrongWord()},3000)
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
        setTimeout(()=>{letterElem.classList.add(letterClasses[index]) } , index*400)
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
    if(key.includes("ArrowLeft")){
        letterInFocus = Math.max(letterInFocus-1,0);
        bringToFocus("inputLetter"+letterInFocus)

    }
    if(key.includes("ArrowRight")){
        letterInFocus = Math.min(letterInFocus+1,wordOfTheDay.length-1);
        bringToFocus("inputLetter"+letterInFocus)
    }
    if(key.includes("Delete")){
        let currentLetterElem = document.getElementById("inputLetter"+letterInFocus);
        currentLetterElem.innerText="";
    }
}



function memeRightWord(){
    let urls=["https://c.tenor.com/Mc8uL2wLoygAAAAC/emotional-sad.gif",
    "https://thumbs.gfycat.com/UnawareKeenLarva-max-1mb.gif",
    "https://c.tenor.com/PmqQsPCP7TAAAAAC/vadivelu-theivamey.gif",
    "https://media0.giphy.com/media/2PKiy95Iq819K/giphy.gif",
    "https://c.tenor.com/c2RRYLbF6FQAAAAC/padayappa.gif",
    "https://c.tenor.com/wfLub8QailYAAAAC/neelambari-ramya-krishnan.gif",
    "https://64.media.tumblr.com/835d2fd5c30f474a43e5a9a974c679e8/tumblr_n5sb9yhzqg1tyjnsvo2_400.gifv",
    "https://qph.fs.quoracdn.net/main-qimg-298ac9bf924b7d71c19a1f46c1ec8414",
    "https://c.tenor.com/qjfFFsj8hjYAAAAd/ravindra-jadeja-jadeja-sword-celebration.gif",
    "https://c.tenor.com/Ctry-pVtoT8AAAAC/laugh-sirippu.gif",
    "https://c.tenor.com/qaqVT8FnL2gAAAAM/cjcjcj.gif",
    "https://i.makeagif.com/media/6-02-2018/1ueAX8.gif",
    "https://c.tenor.com/qxEyNnTFAl4AAAAC/thalai-aaturan-premji.gif",
    "https://media.kulfyapp.com/IPxsPD/IPxsPD-shared.gif",
    "https://c.tenor.com/-DJ6CdWSuSIAAAAM/chalmaar-prabhudeva.gif"];
    
    let imageNo = Math.floor(Math.random()*urls.length);
    let memeDiv = document.getElementById("meme-display")
    memeDiv.classList.add("unhide");
    memeDiv.innerHTML = "";
    let image = document.createElement("img");
    image.src = urls[imageNo];
    memeDiv.appendChild(image)
    setTimeout(()=>{document.getElementById("meme-display").classList.remove("unhide");},3000)
    
}

function memeWrongWord(){
    let urls=["https://c.tenor.com/y9o2_bKG71gAAAAM/ahaan-vadivelu.gif",
    "https://cdnaws.sharechat.com/9e0fcaff-c5c1-4e0a-9e3b-61385861e59d-98b8444f-2fd6-49f2-8256-fc48423a7d64_compressed_40.jpg",
    "https://i.pinimg.com/originals/10/83/36/10833618e7697a162f3415cda043635e.jpg",
    "https://qph.fs.quoracdn.net/main-qimg-456dd3c334435b5061d42d756bb211f0.webp",
    "http://commentphotos.com/images/opengraph/CommentPhotos.com_1419362230.jpg",
    "https://doolpictures.files.wordpress.com/2013/11/santhanam_119_35201174620123-e1385189568616.jpg",
    "https://i.pinimg.com/originals/7d/ee/a1/7deea12a7d62a0c0d941d8f21c37bb78.gif",
    "https://thumbs.gfycat.com/JaggedPotableGrouper-size_restricted.gif",
    "https://c.tenor.com/QLqnD4khdNQAAAAM/crying-vadivelu.gif",
    "https://c.tenor.com/vUw6tLZmmasAAAAM/soona-paana.gif",
    "https://c.tenor.com/KSsO31-7NzEAAAAM/lingaa-rajini.gif",
    "https://c-sf.smule.com/s-sf-bck3/arr/31/35/b48fae4f-a161-449d-aa21-bc4a27d91242_1024.jpg",
    "https://c.tenor.com/MSEmLvqfpTQAAAAC/unbelievable-sj-surya.gif",
    "https://i.gifer.com/GT4C.gif",
    "https://c.tenor.com/nXc2HYznzCsAAAAd/santhanam-caught.gif",
    "https://thumbs.gfycat.com/RepentantFavoriteAmericanlobster-max-1mb.gif",
    "https://i.makeagif.com/media/5-26-2020/738LbS.gif",
    "https://media4.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.gif",
    "https://c.tenor.com/IIBUhfm3NJ8AAAAC/padayappa-happy.gif",
    "https://c.tenor.com/ULaISY1NBl8AAAAd/tamil-comedy-goundamani.gif",
    "https://j.gifs.com/vZop69.gif",
    "https://c.tenor.com/TECAbKgnLW8AAAAd/sooriyan-goundamani.gif",
    "https://i.pinimg.com/originals/3a/29/50/3a2950acfe7c9a99b57999a7757146ad.gif",
    "https://thumbs.gfycat.com/FirsthandClassicHeifer-max-1mb.gif",
    "https://c.tenor.com/uNF4dBA5CxwAAAAC/andrew-strauss-shane-warne.gif",
    "https://p.imgci.com/db/PICTURES/CMS/93900/93962.jpg",
    "https://c.tenor.com/9tMyOrcR3Y4AAAAC/senthil-karagattakaran.gif",
    "https://c.tenor.com/rE569gbbrhEAAAAC/senthil-mahaprabhu.gif",
    "https://c.tenor.com/jvIyry4JXq8AAAAC/duck-hunt-nes.gif",
    "https://c.tenor.com/_DUBSvGKLcAAAAAC/crying-kamal-haasan.gif",
    "https://64.media.tumblr.com/3f976e2da2d4308a8222ab14d1104f32/b514ec609de602ae-62/s500x750/8e7e8bd277bce700d73451025d72a068874cf252.gifv",
    "https://media3.giphy.com/media/15DpsBLrIrOa4/200w.gif?cid=82a1493b8af13t843vjczua5c0om4dytj096fcd7a4vw0a2o&rid=200w.gif&ct=g",
    "https://i.makeagif.com/media/6-29-2018/qIOaTR.gif",
    "https://i.pinimg.com/originals/cd/64/cc/cd64cc6d3e8b9000039504f485816fe0.gif",
    "https://www.xwhos.com/photo/what_is_zodiac_sign_vadivelu_2019-03-11_6.webp",
    "https://thumbs.gfycat.com/BestNeedyGoa-max-1mb.gif",
    "https://c.tenor.com/hqTrjCi4fhkAAAAC/riz-vadivel.gif",
    "https://c.tenor.com/GzxmC6ri_kEAAAAM/gifsblo-gifsblog.gif",
    "https://c.tenor.com/Ws1AB_ax83QAAAAC/vera-level-vijay.gif",
    "https://c.tenor.com/X5urDdnOVtEAAAAC/catch-miss-premji.gif",
    "https://c.tenor.com/NH2EMxWsjUQAAAAM/my-gif.gif",
    "https://c.tenor.com/_b997oSH-ucAAAAM/saani-la-adi-vangitan-vivek.gif",
    "https://c.tenor.com/A9Mt86EA1u0AAAAd/feeling-santhanam.gif",
    "https://c.tenor.com/FZo_ZlRMbXYAAAAC/kadallaye-illayam-jamin.gif",
    "https://c.tenor.com/faZbWKDLWqQAAAAC/sarcastic-laugh-prabhu-deva.gif",
    "https://c.tenor.com/YnuUOgMR88sAAAAC/gopal-goppal.gif"];
    
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
    let resultString ="Velloredle "+velloredleEdition+" ("+(noOfTries).toString()+"/6)"+"\n";
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


function displayCredits(){
    Swal.fire('Velloredle',`Guess the 5 letter word in 6 tries. <br><br> <br> 
    Green - Letter is in correct place<br> 
    Yellow - Letter is shuffled <br> 
    Gray - Not present. <br><br> 
    A wordle clone by a group of friends from Vellore: <br> <br>
    Bharath, Ramu & Vivek `,'info')
}
