import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const Filter = ({ searchString, searchInputChange }) => {
  return (
    <>
      filter search with:{" "}
      <input value={searchString} onChange={searchInputChange} />
    </>
  );
};

const PersonForm = ({
  newName,
  onNameChange,
  newNumber,
  onNumberChange,
  onClick,
}) => {
  return (
    <form>
      <div>
        name: <input value={newName} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit" onClick={onClick}>
          add
        </button>
      </div>
    </form>
  );
};
const Person = ({ person }) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  );
};

const Persons = ({ persons, searchString }) => {
  const filteredBySearch =
    searchString.trim().length === 0
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(searchString.trim().toLowerCase()),
        );
  return (
    <>
      {filteredBySearch.map((person) => (
        <Person key={person.id} person={person} />
      ))}
    </>
  );
};
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchString, setNewSearchString] = useState("");

  const addName = (event) => {
    event.preventDefault();
    const duplicate = persons.find((person) => person.name === newName);
    if (duplicate !== undefined) {
      window.alert(`${newName} already exists in the phonebook`);
    } else {
      const id = persons.length + 1;
      setPersons(persons.concat({ id: id, name: newName, number: newNumber }));
    }
    setNewName("");
    setNewNumber("");
  };
  const nameInputChange = (event) => {
    setNewName(event.target.value);
  };
  const numberInputChange = (event) => {
    setNewNumber(event.target.value);
  };

  const searchInputChange = (event) => {
    setNewSearchString(event.target.value);
  };

  const hook = () => {
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("response data", response.data);
      setPersons(response.data);
    });
  };

  useEffect(hook, []);
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        searchString={searchString}
        searchInputChange={searchInputChange}
      />
      <h2>Add new</h2>
      <PersonForm
        newName={newName}
        onNameChange={nameInputChange}
        newNumber={newNumber}
        onNumberChange={numberInputChange}
        onClick={addName}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} searchString={searchString} />
    </div>
  );
};

export default App;
