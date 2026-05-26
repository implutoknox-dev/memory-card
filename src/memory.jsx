import { useEffect, useState } from "react";

function Card({ key,name, handleClick, url }) {

console.log(url)
    return (<div className="card" onClick={ handleClick }>
        <h1 className="cardText" key={ key } >{name}</h1>
                <img src={ url } alt="" />
    </div>
    )
}

function MemoryGame() {
    const [gameWon, setGameWon ] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [ clicked, setClicked ] = useState([])
    const [ score, setScore ] = useState(0)
    const [ highScore, setHighScore] = useState(0)
    const [ originalCards, setOriginalCards] = useState([])

    const url = "https://pokeapi.co/api/v2/pokemon/"

    const [ cards, setCards ] = useState([
        { id: 1, name: "Ditto", url: ""},
        { id: 2, name: "Bulbasaur", url: ""},
        { id: 3, name: "Charizard",  url: ""},
        { id: 4, name: "Pikachu", url: ""},
        { id: 5, name: "Blastoise", url: ""},
        { id: 6, name: "Butterfree", url: ""}
    ])
 

    function resetGame() {
        setClicked([])
        setScore(0)
        setHighScore(0)
        setCards(originalCards)
        setGameOver(false)
        setGameWon(false)
        
    }

    function shuffle(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    }

    const handleClick = (id) => {
    
        if (clicked.includes(id)) {
            setGameOver(true)
            return
        }
        const nextClicked = [...clicked,id]
        const nextScore = score + 1
        setClicked( nextClicked )
        setScore( nextScore )

        if (nextScore > highScore) {
            setHighScore(nextScore)
        }
        
        if (nextClicked.length === cards.length) {
            setGameWon(true)
            return
        }
        
        setCards(prev => shuffle(prev))
        
    }
    useEffect(() => {
        async function fetchPokemon() {
            
            const fetchedCards = await Promise.all(cards.map( async (card) => {
                
                const response = await fetch(url + card.name)
                const data = await response.json();
                
                
                return {...card, url: data.sprites.front_default }
                
            }));
            
        setCards(fetchedCards)
        setOriginalCards(fetchedCards)

        }

        fetchPokemon()

    }, [])
    

if(gameWon) {
    return(<div
      className="game-won"
      onClick={resetGame}
    >
      <h1 className="game-won">You beat the game! Congrats!</h1>
      <h1 className="game-won">Score: {score}</h1>
      <h1 className="game-won">Click anywhere to play again</h1>
    </div>)
}


if(gameOver) {
    return(<div
      className="game-over"
      onClick={resetGame}
    >
      <h1 className="game-over">Game Over!</h1>
      <h1 className="game-over">Score: {score}</h1>
      <h1 className="game-over">Click anywhere to play again</h1>
    </div>)
}
    return( 
    <div id="gameContainer">
        <h1>Current Score: { score }</h1>
        <h1>Highscore: {highScore}</h1>
        <div id="cardContainer">
            { cards.map( card => {
            return < Card key={ card.id } name={card.name} handleClick={ () => handleClick(card.id) } url={ card.url}/>
            })}
        </div>
    </div>
)}

export { MemoryGame }