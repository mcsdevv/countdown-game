const letters = {
    consonants: ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"],
    vowels: ["A", "E", "I", "O", "U"],
};
const selectors = {
    letterDisplay: document.querySelector('.letter--display'),
    consButton: document.querySelector('.consonant--button'),
    vowelButton: document.querySelector('.vowel--button'),
    timerDisplay: document.querySelector('.timer--container'),
    wordInput: document.querySelector('.word--input'),
    wordSubmit: document.querySelector('.word--submit'),
    resultAlert: document.querySelector('.result--alert')
}

const selectLetters = {
    chosenLetters: [],
    countedLetters: {},
    addConsListener: selectors.consButton.addEventListener("click", function () {
        selectLetters.chooseLetter(letters.consonants, 21)
    }), 
    addVowelListener: selectors.vowelButton.addEventListener("click", function () {
        selectLetters.chooseLetter(letters.vowels, 5)
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
    userSubmit: selectors.wordSubmit.addEventListener("click", function () {
        validateInput.countInput(selectors.wordInput.value)
        clearInterval(clock.countdown.interval)
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
                    return false
                }
            }
            return true
        }
        return false
    },
    checkValidWord() {
        if (this.checkLetterFreq() === true) {
            let word = selectors.wordInput.value.toLowerCase();
            let url = "http://api.wordnik.com/v4/word.json/" + word + "/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
            fetch(url)
            .then((resp) => resp.json())
            .then(function(data) {
                if (data.length > 0) {
                    console.log('YOU CAN SPELL')
                    console.log(word)
                    console.log(data[0].text)
                } else {
                    console.log('LEARN TO SPELL')
                }
            })
            .catch(function(error) {
            console.log(error)
            });
        } else {
            console.log('false')
        }
    }
}

const displayResults = {

}

const clock = {
    timer: 30,
    countdown() {
        let interval = setInterval(function () {
            selectors.timerDisplay.textContent = clock.timer
            clock.timer--
            if (clock.timer === -1) {
                clearInterval(interval)
                selectors.wordSubmit.click();
            }
        }, 1000)
    }
}