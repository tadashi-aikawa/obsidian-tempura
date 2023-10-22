import {
  insert,
  getActiveLine,
  attachTextToListItem,
  use,
  getSelectionLines,
  setTextToSelection,
  sortSelectionLines,
} from "./functions";

module.exports = () => ({
  use,
  insert,
  getActiveLine,
  getSelectionLines,
  setTextToSelection,
  attachTextToListItem,
  sortSelectionLines,
});
