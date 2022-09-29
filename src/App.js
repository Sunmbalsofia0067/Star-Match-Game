
import { useEffect, useState } from 'react';
import './App.css';
import { Utils } from './Utils';

//Color themes
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

const PlayNumber = props => {
  return (
    <button
      className="number"
      style={{ backgroundColor: colors[props.status] }}
      onClick={() => props.onClick(props.number, props.status)}
    >
      {props.number}
    </button>
  )
};

const StarDisplay = props => (
  Utils.range(1, props.count).map(starId =>
    <div key={starId} className='star'>
      <img src='https://cdn-icons-png.flaticon.com/512/1828/1828961.png' alt='' />
    </div>
  )
);

const PlayAgain = props => (
  <div className='game-done'>
    <div className='message' style={{color: props.gameStatus === 'lost' ? 'red' : 'green'}}>
      {props.gameStatus === 'lost' ? 'GameOver' : 'Nice'}
    </div>
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

//
const Game = (props) => {
  const [stars, setStars] = useState(Utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(Utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  const candidatesAreWrong = Utils.sum(candidateNums) > stars;
  // const gameIsWon = availableNums.length === 0;
  // const gameIsLost = secondsLeft === 0;

  const gameStatus = availableNums.length === 0
    ? 'won'
    : secondsLeft === 0 ? 'lost' : 'active'

  useEffect(() => {
    let timerId;
    if (secondsLeft > 0 && availableNums.length > 0) {
      timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    }
    return () => clearTimeout(timerId);
    /*
    console.log('Done rendering');
    return () => console.log('Component is going to render');*/
  });
 /*
  const resetGame = () => {
    setStars(Utils.random(1, 9));
    setAvailableNums(Utils.range(1, 9));
    setCandidateNums([]);
    //secondsLeft(10);
  };*/

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used'
    }

    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }

    return 'available';
  };

  const onNumberClick = (number, currentStatus) => {
    //currentStatus = newStatus
    if (gameStatus !== 'active' || currentStatus === 'used')
      return;

    //candidateNums
    const newCandidateNums =
      currentStatus === 'available'
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);


    if (Utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );

      setStars(Utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  };
  return (
    <div className='game'>
      <div className='help'>
        Pick 1 or more numbers that sum to the number of Stars
      </div>

      <div className='body'>
        <div className='left'>
          {gameStatus !== 'active' ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
          ) : (
            <StarDisplay count={stars} />
          )}
        </div>

        <div className='right'>
          {Utils.range(1, 9).map(number =>
            <PlayNumber
              key={number}
              status={numberStatus(number)}
              number={number}
              onClick={onNumberClick}
            />
          )}
        </div>

      </div>
      <div className='timer'> Time Remaining: {secondsLeft}</div>
    </div>
  );
};
//<img src='https://cdn-icons-png.flaticon.com/512/1828/1828961.png' alt='' />


const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  return <Game key={gameId} startNewGame = {() => setGameId(gameId+ 1)}/>;
}


function App() {
  return (
    <div className="App">
      <StarMatch />
    </div>
  );
}

export default App;
