import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { decode } from 'he'
import blob1Quiz from './assets/blob1-quiz.svg'
import blob2Quiz from './assets/blob2-quiz.svg'
import Question from './Question'
import './Quiz.css'

export default function Quiz(props){
    const [questionsArr, setQuestionsArr] = useState([])
    const [loading, setLoading] = useState(true)
    const [userAnswers, setUserAnswers] = useState({})
    const [isPressed, setIsPressed] = useState(false)
    const [gameIsFinished, setGameIsFinished] = useState(false)
    const [asnwersScore, setAnswersScore] = useState(0)

    useEffect(() => {
        fetchData()
    }, [props.hasStarted])

    function fetchData() {
        fetch("https://opentdb.com/api.php?amount=5&category=11&difficulty=medium&type=multiple")
            .then(response => response.json())
            .then(data => { 
                const shuffledData = data.results.map(element => {
                    return {
                        ...element,
                        id: nanoid(),
                        shuffledAnswers: shuffleArray([...element.incorrect_answers, element.correct_answer])
                    }
                })
                setQuestionsArr(shuffledData)
                setLoading(false)
            })
    }

    const questionElements = questionsArr.map(element => {
        return <Question 
            key={element.id}
            id={element.id}
            question={decode(element.question)}
            answers={element.shuffledAnswers.map(ans => {
                const answerId = nanoid()
                const isSelected = userAnswers[decode(element.question)] === decode(ans)
                const isCorrect = decode(ans) === decode(element.correct_answer)
                let classes = "answer-label"
                if (isPressed) {
                    if (isSelected && isCorrect) {
                        classes = "correct"
                    } else if (isSelected && !isCorrect) {
                        classes = "incorrect"
                    } else if (isCorrect) {
                        //if no selected answer on a question, differentiate the correct unselected from the correct selected
                        classes = userAnswers[decode(element.question)] ? "correct" : "unselected-correct"
                    } else classes //if it's not selected, keep the default class
                }

                return <div key={answerId} className="answer-option">
                    <input type="radio" 
                        id={`radio-${answerId}`} 
                        name={decode(element.question)} 
                        value={decode(ans)}
                        checked={userAnswers[decode(element.question)] === decode(ans)}
                        onChange={handleChange} 
                        disabled={gameIsFinished} //prevent answer selection after game is finished
                    />
                    <label htmlFor={`radio-${answerId}`} className={classes}>{decode(ans)}</label>
                </div>
                })
            }
        />
    })

    function handleChange(event) {
        const {value, name} = event.target
        setUserAnswers(prevAnswers => ({...prevAnswers, [name]: value}))
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {                
          const j = Math.floor(Math.random() * (i + 1));          
          [arr[i], arr[j]] = [arr[j], arr[i]];                    
        }
        return arr
    }

    function checkAnswers() {
        setIsPressed(prev => !prev)
        setGameIsFinished(prev => !prev)
        questionsArr.map(q => (
            userAnswers[decode(q.question)] === q.correct_answer ? setAnswersScore(prev => prev + 1) : asnwersScore
        ))
    }

    function resetGame() {
        setIsPressed(false)
        setGameIsFinished(false)
        setLoading(true)
        setAnswersScore(0)
        setQuestionsArr([])
        setUserAnswers({})

        fetchData()
    }

    return (
        <>
            <img src={blob1Quiz} className="top-right-quiz" alt="yellow blob doodle in the top-right screen corner" />
            <section className="questions-container">
                {questionElements}
                {gameIsFinished ? (
                    <div className="results-container">
                        <p className="score-text">You scored {asnwersScore}/5 correct answers</p>
                        <button className="reset-btn" onClick={resetGame}>Play again</button>
                    </div> )
                    : (  //only load button when the api request is resolved
                        !loading && ( 
                        <div className="results-container">
                            <button className="check-ans-btn" onClick={checkAnswers}>Check answers</button>
                        </div> ) 
                    ) 
                } 
            </section>
            <img src={blob2Quiz} className="bottom-left-quiz" alt="blue blob doodle in the bottom-left screen corner" />
        </>
    )
}