import axios from "axios";
import personService from "./services/persons";
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
const Person = ({ person, onDeleteClick }) => {
  return (
    <div>
      {person.name} {person.number}
      <button type="button" onClick={onDeleteClick}>
        Delete
      </button>
    </div>
  );
};

const Persons = ({ persons, searchString, onDeleteClick }) => {
  const filteredBySearch =
    searchString.trim().length === 0
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(searchString.trim().toLowerCase()),
        );
  return (
    <>
      {filteredBySearch.map((person) => (
        <Person
          key={person.id}
          person={person}
          onDeleteClick={() => onDeleteClick(person)}
        />
      ))}
    </>
  );
};
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchString, setNewSearchString] = useState("");

  const removePerson = (person) => {
    if (!window.confirm(`really delete ${person.name}`)) {
      console.log("deletion aborted");
      return;
    }
    personService.deletePerson(person.id).then((response) => {
      setPersons(persons.filter((p) => p.id !== response.id));
    });
  };
  const addPerson = (event) => {
    event.preventDefault();
    const duplicate = persons.find((person) => person.name === newName);
    if (duplicate !== undefined) {
      if (
        !window.confirm(
          ` do you want to change number for ${duplicate.name}  ? `,
        )
      )
        return;
      const updated = { ...duplicate, number: newNumber };
      personService.update(duplicate.id, updated).then((updatedPerson) => {
        setPersons(
          persons.map((p) => (p.id === updatedPerson.id ? updatedPerson : p)),
        );
      });
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      personService
        .create(newPerson)
        .then((returnedAddedPerso) =>
          setPersons(persons.concat(returnedAddedPerso)),
        );
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
        onClick={addPerson}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        searchString={searchString}
        onDeleteClick={removePerson}
      />
    </div>
  );
};

export default App;
