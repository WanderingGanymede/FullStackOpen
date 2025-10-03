const Hello = (props) => {
  console.log(props);
  return (
    <div>
      <p>
        Hello {props.name},you are {props.age} years old
      </p>
    </div>
  );
};

const App = () => {
  const name = "John";
  const age = 34;
  return (
    <>
      <h1>Greetings</h1>

      <Hello name="Frank" age={30} />
      <Hello name="Dave" age={25} />
      <Hello name={name} age={age} />
    </>
  );
};
export default App;
