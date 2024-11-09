import { useState } from 'react'
import blob1 from './assets/blob1.svg'
import blob2 from './assets/blob2.svg'
import Quiz from './Quiz'
import './fonts.css'
import './index.css'

export default function App() {
  const [gameStarted, setGameStarted] = useState(false)

  function startQuiz(){
    setGameStarted(prevState => !prevState)
  }

  return (
    <main>
      {!gameStarted && 
        <section className="initial-wrapper">
          <img src={blob2} className="top-right-blob" alt="yellow blob doodle in the top-right screen corner" />
          <h1 className="app-title">Quizzical</h1>
          <h2 className="app-description">Think You're a Film Expert? Take the Quiz!</h2>
          <button className="start-quiz-btn" onClick={startQuiz}>Start quiz</button>
          <img src={blob1} className="bottom-left-blob" alt="blue blob doodle in the bottom-left screen corner" />
        </section>}
      {gameStarted && <Quiz hasStarted={gameStarted} />}
    </main>
  )
}