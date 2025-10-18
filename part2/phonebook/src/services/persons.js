import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const create = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const url = `${baseUrl}/${id}`;
  const request = axios.delete(url);
  return request.then((response) => response.data);
};

const update = (id, newPerson) => {
  const url = `${baseUrl}/${id}`;
  const request = axios.put(url, newPerson);
  return request.then((response) => response.data);
};
export default {
  create,
  deletePerson,
  update,
};
