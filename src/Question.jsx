import './Quiz.css'

export default function Question(props) {

    return (
        <div className="question-wrapper" id={props.id}>
            <p className="question">{props.question}</p>
            <div className="answers-container">{props.answers}</div>
        </div>
    )
}