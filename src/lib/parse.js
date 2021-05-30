import { ObjectID } from "mongodb";

const getString = (value) => (value || "").toString();

const getObjectIDIfValid = (value) =>
  ObjectID.isValid(value) ? new ObjectID(value) : null;

const isNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);

const getNumberIfValid = (value) =>
  isNumber(value) ? parseFloat(value) : null;

const getNumberIfPositive = (value) => {
  const n = getNumberIfValid(value);
  return n >= 0 ? n : null;
};

const getArrayIfValid = (value) => (Array.isArray(value) ? value : null);

const getBoolean = (value) => {
  if (value === "true" || value === true) {
    return true;
  }
  return false;
};

const getArrayOfObjectID = (value) => {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((id) => getObjectIDIfValid(id)).filter((id) => !!id);
  }
  return [];
};

export default {
  getString,
  getObjectIDIfValid,
  getNumberIfPositive,
  getArrayIfValid,
  getBoolean,
  getArrayOfObjectID,
};
