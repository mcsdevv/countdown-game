const letters = {
    consonants: ["B", "B", "C", "C", "D", "D", "D", "D", "F", "F", "G", "G", "G", "H", "H", "J", "K", "L", "L", "L", "L", "M", "M", "N", "N", "N", "N", "N", "N", "P", "P", "Q", "R", "R", "R", "R", "R", "R", "S", "S", "S", "S", "T", "T", "T", "T", "T", "T", "V", "V", "W", "W", "X", "Y", "Y", "Z"],
    vowels: ["A", "A", "A", "A", "A", "A", "A", "A", "A", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "I", "I", "I", "I", "I", "I", "I", "I", "I", "O", "O", "O", "O", "O", "O", "O", "O", "U", "U", "U", "U"],
};
const selectors = {
    letterDisplay: document.querySelector('.letter--display'),
    consButton: document.querySelector('.consonant--button'),
    vowelButton: document.querySelector('.vowel--button'),
    timerDisplay: document.querySelector('.timer--container'),
    wordInput: document.querySelector('.word--input'),
    wordSubmit: document.querySelector('.word--submit'),
    resultAlert: document.querySelector('.result--alert'),
    resultWord: document.querySelector('.result--word'),
    resultDefinition: document.querySelector('.result--definition'),
    resetGame: document.querySelector('.play--again')
}

const selectLetters = {
    chosenLetters: [],
    countedLetters: {},
    addConsListener: selectors.consButton.addEventListener("click", function () {
        selectLetters.chooseLetter(letters.consonants, 56)
    }), 
    addVowelListener: selectors.vowelButton.addEventListener("click", function () {
        selectLetters.chooseLetter(letters.vowels, 42)
    }),
    randomNum(num) {
        return Math.floor(Math.random() * (num));
    },
    chooseLetter(type, num) {
        if (this.chosenLetters.length < 9) {
            selectLetters.chosenLetters.push(type[selectLetters.randomNum(num)])
            this.displayLetter(selectLetters.chosenLetters)
            if (this.chosenLetters.length === 9) {
                this.countLetters(this.countedLetters, this.chosenLetters)
                clock.countdown()
            }
        }        
    },
    displayLetter(letter) {
        for (let i = 0; i < letter.length; i++) {
            selectors.letterDisplay.children[i].textContent = letter[i]
        }
    },
    countLetters(obj, letters) {
        for (let i = 0; i < letters.length; i++) {
            let letter = letters[i].toUpperCase();
            if (obj[letter]) {
               obj[letter]++;
            } else {
               obj[letter] = 1;
            }
        }
    }
}

const validateInput = {
    countedLetters: {},
    userSubmitClick: selectors.wordSubmit.addEventListener("click", function () {
        validateInput.countInput(selectors.wordInput.value)
        clock.clear()
    }),
    userInputEnter: selectors.wordInput.addEventListener("keydown", function () {
        if (event.key === "Enter") {
            validateInput.countInput(selectors.wordInput.value)
            clock.clear()
        }
    }),
    countInput(word) {
        word = word.split("")
        selectLetters.countLetters(this.countedLetters, word)
        this.checkValidWord()
    },
    checkValidLetters(chosenKeys, usedKeys) {
        for (let i = 0; i < usedKeys.length; i++) {
            if (!(usedKeys[i] in selectLetters.countedLetters)) {
                return false
            }
        }
        return true
    },
    checkLetterFreq() {
        let chosenLettersKeys = Object.keys(selectLetters.countedLetters)
        let usedLettersKeys = Object.keys(validateInput.countedLetters)
        if (this.checkValidLetters(chosenLettersKeys, usedLettersKeys) === true) {
            for (let i = 0; i < usedLettersKeys.length; i++) {
                let key = usedLettersKeys[i]
                if (!(validateInput.countedLetters[key] <= selectLetters.countedLetters[key])) {
                    return 2
                }
            }
            return 1
        }
        return 3
    },
    checkValidWord() {
        let code = this.checkLetterFreq()
        let word = selectors.wordInput.value.toLowerCase();
        if (code === 1) {
            let url = "http://api.wordnik.com/v4/word.json/" + word + "/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
            fetch(url)
            .then((resp) => resp.json())
            .then(function(data) {
                if (data.length > 0) {
                    displayResults.successMessage(word, data[0].text)
                } else {
                    displayResults.failureMessage(word, 1)
                }
            })
            .catch(function(error) {
            console.log(error)
            });
        } else {
            displayResults.failureMessage(word, code)
        }
    }
}

const displayResults = {
    successMessage(word, definition) {
        word = word.charAt(0).toUpperCase() + word.slice(1)
        selectors.resultAlert.textContent = "Well done, you managed to make a " + word.length + " letter word. Hit play again for another go."
        selectors.resultWord.textContent = word
        selectors.resultDefinition.textContent = definition
    },
    failureMessage(word, error) {
        const text = selectors.resultAlert
        // Invalid word
        if (error === 1) {
            text.textContent = "Uh oh, it looks like  " + word + " isn't a real word! Hit play again for another go."
        } else if (error === 2) {
            text.textContent = "Uh oh, it looks like you've used a letter more times than allowed! Hit play again for another go."
        } else if (error === 3) {
            text.textContent = "Uh oh, it looks like you've used a letter that wasn't chosen! Hit play again for another go."            
        }
    }
}

const clock = {
    timer: 30,
    interval: 0,
    clear() {      
      clearInterval(this.interval);
      this.timer = 30;
      this.interval = 0;
      selectors.timerDisplay.textContent = clock.timer
    },
    countdown() {
        this.interval = setInterval(() => {
            selectors.timerDisplay.textContent = clock.timer
            this.timer--;
            console.log(this.timer)
            if (this.timer < 0) {                
                clearInterval(this.interval)
                selectors.wordSubmit.click();
            }
        }, 1000);
    },
}

const reset = {
    addResetListener: selectors.resetGame.addEventListener("click", function () {
        clock.clear()
        reset.resetChosenLetters()
        selectors.wordInput.value = ""
        selectors.resultAlert.textContent = ""
        selectors.resultWord.textContent = ""
        selectors.resultDefinition.textContent = ""

    }),
    resetChosenLetters() {
        selectLetters.chosenLetters = []
        selectLetters.countedLetters = {}
        validateInput.countedLetters = {}
        selectLetters.displayLetter(["","","","","","","","",""])
    }
}