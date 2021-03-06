function result() {
    class Card {
        constructor(face, suit) {
            this._face = face
            this._suit = suit
        }
        get face() {
            return this._face
        }
        set face(face) {
            const validFaces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
            if (!validFaces.includes(face)) {
                throw new Error
            }
            return face
        }
        get suit() {
            return this._suit
        }
        set suit(suit) {
            const validSuits = ['S', 'H', 'D', 'C']
            if (!validSuits.includes(suit)) {
                throw new Error
            }
            return suit
        }
        toString() {
            let suitToChar = {
                'S': '\u2660', // ♠
                'H': '\u2665', // ♥
                'D': '\u2666', // ♦
                'C': '\u2663', // ♣
            }
            return this._face + suitToChar[this._suit]
        }
    }

    function printDeckOfCards(cards) {
        let deck = [];
        for (let cardStr of cards) {
            let face = cardStr.substring(0, cardStr.length - 1);
            let suit = cardStr.substr(cardStr.length - 1, 1);
            try {
                deck.push(new Card(face, suit));
            } catch (err) {
                console.log("Invalid card: " + cardStr);
                return;
            }
        }
        console.log(deck.join(' '));
    }
}
let result = printDeckOfCards(['AS', '10D', 'KH', '2C'])
console.log(result);
