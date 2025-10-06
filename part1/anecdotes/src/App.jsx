import { useState } from "react";
const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const DailyAnecdote = ({ text, voteCount }) => {
  return (
    <>
      <h2>Anecdote of the day</h2>
      <p>{text}</p>
      <p>had {voteCount} votes</p>
    </>
  );
};
const BestAnecdote = ({ text, voteCount }) => {
  return (
    <>
      <h2>Most voted for anecdote</h2>
      <p>{text}</p>
      <p>had {voteCount} votes</p>
    </>
  );
};
const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const [votes, setVotes] = useState(new Uint16Array(anecdotes.length));
  const [selected, setSelected] = useState(0);

  const voteForCurrentQuote = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };
  const selectRandomQuote = () => {
    const r = Math.floor(Math.random() * anecdotes.length);
    setSelected(r);
  };

  var highestVoteIdx = 0;
  var highestVote = 0;
  for (let i = 0; i < votes.length; i++) {
    if (votes[i] > highestVote) {
      highestVote = votes[i];
      highestVoteIdx = i;
    }
  }

  return (
    <>
      <DailyAnecdote text={anecdotes[selected]} voteCount={votes[selected]} />
      <Button onClick={selectRandomQuote} text="random quote" />
      <Button onClick={voteForCurrentQuote} text="Vote" />
      <BestAnecdote
        text={anecdotes[highestVoteIdx]}
        voteCount={votes[highestVoteIdx]}
      />
    </>
  );
};

export default App;
