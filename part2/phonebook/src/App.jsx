import axios from "axios";
import personService from "./services/persons";
import Notification from "./Notification";
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
    <li className="person">
      {person.name} {person.number}
      <button type="button" onClick={onDeleteClick}>
        Delete
      </button>
    </li>
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
      <ul>
        {filteredBySearch.map((person) => (
          <Person
            key={person.id}
            person={person}
            onDeleteClick={() => onDeleteClick(person)}
          />
        ))}
      </ul>
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchString, setNewSearchString] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const removePerson = (person) => {
    if (!window.confirm(`really delete ${person.name}`)) {
      console.log("deletion aborted");
      return;
    }
    personService
      .deletePerson(person.id)
      .then((response) => {
        setPersons(persons.filter((p) => p.id !== response.id));
      })
      .catch((error) => {
        setErrorMessage(person.name, " already deleted");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
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
      personService
        .update(duplicate.id, updated)
        .then((updatedPerson) => {
          setConfirmationMessage(`${updatedPerson.name} updated`);
          setTimeout(() => setConfirmationMessage(null), 3000);
          setPersons(
            persons.map((p) => (p.id === updatedPerson.id ? updatedPerson : p)),
          );
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage(`${updated.name} already deleted`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);

          setPersons(persons.filter((p) => p.id !== updated.id));
        });
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      personService.create(newPerson).then((returnedAddedPerso) => {
        setConfirmationMessage(`${newPerson.name} added`);
        setTimeout(() => setConfirmationMessage(null), 3000);
        setPersons(persons.concat(returnedAddedPerso));
      });
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
      <Notification message={confirmationMessage} type="confirmation" />
      <Notification message={errorMessage} type="error" />
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
