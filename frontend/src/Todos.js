import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";


import {
  Container,
  Typography,
  Button,
  Icon,
  Paper,
  Box,
  TextField,
  Checkbox,
} from "@material-ui/core";


import RLDD from 'react-list-drag-and-drop/lib/RLDD';

const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
  todosContainer: { marginTop: 10, padding: 10 },
  todoContainer: {
    borderTop: "1px solid #bfbfbf",
    marginTop: 5,
    "&:first-child": {
      margin: 0,
      borderTop: "none",
    },
    "&:hover": {
      "& $deleteTodo": {
        visibility: "visible",
      },
    },
  },
  todoTextCompleted: {
    textDecoration: "line-through",
  },
  deleteTodo: {
    visibility: "hidden",
  },
});

function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((todos) => setTodos(todos));
  }, [setTodos]);

  function addTodo(text) {
    fetch("http://localhost:3001/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ text }),
    })
      .then((response) => response.json())
      .then((todo) => setTodos([...todos, todo]));
    setNewTodoText("");
  }

  function toggleTodoCompleted(id) {
    fetch(`http://localhost:3001/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      };
      setTodos(newTodos);
    });
  }

  function deleteTodo(id) {
    fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>
      <Paper className={classes.addTodoContainer}>
        <Box display="flex" flexDirection="row">
          <Box flexGrow={1}>
            <TextField
              fullWidth
              value={newTodoText}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  addTodo(newTodoText);
                }
              }}
              onChange={(event) => setNewTodoText(event.target.value)}
            />
          </Box>
          <Button
            className={classes.addTodoButton}
            startIcon={<Icon>add</Icon>}
            onClick={() => addTodo(newTodoText)}
          >
            Add
          </Button>
        </Box>
      </Paper>
      {todos.length > 0 && (
        <Paper className={classes.todosContainer}>
          <RLDD
            items={todos}
            itemRenderer={(item, index) => {
            return (
                <Box key={item._id}
                     display="flex"
                     flexDirection="row"
                     alignItems="center"
                     className={classes.todoContainer}>
                  <Checkbox
                      checked={item.completed}
                      onChange={() => toggleTodoCompleted(item.id)}
                  ></Checkbox>
                  <Box flexGrow={1}>
                    <Typography
                        className={item.completed ? classes.todoTextCompleted : ""}
                        variant="body1"
                    >
                      {item.text} {item.id} - {index}
                    </Typography>
                  </Box>
                  <Button
                      className={classes.deleteTodo}
                      startIcon={<Icon>delete</Icon>}
                      onClick={() => deleteTodo(item.id)}
                  >
                    Delete
                  </Button>
                </Box>
            );
          }}
            onChange={handleRLDDChange}
            />
        </Paper>
      )}
    </Container>
  );

 function handleRLDDChange(todos) {
   setTodos(todos);
    console.log(todos);
    //this.setState({ items: reorderedItems });
  }
}

export default Todos;
