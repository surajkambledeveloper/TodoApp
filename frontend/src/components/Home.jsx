import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const [todos, setTodos] = useState([]);
  // error state if something went wrong we showing error in o reamainig tudos section
  const [error, setError] = useState(null);
  // show loading page before fetch data
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodos] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchtodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4001/todo/fetch", {
          // here Credential true because jo bhi backend se reponse ayega lelo
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response.data.todos);
        // data object ke andar tudos hai or is tudos mai data hai isliye response.data.tudtos
        setTodos(response.data.todos);
        // after successfully data fetch set error null
        setError(null);
      } catch (error) {
        console.log(error);
        if (error.response) {
          toast.error(error.response.data.errors || "server error");
        } else {
          toast.error("Cannot connect to the server. Please try again later.");
        }
      } finally {
        // after data fetched successfully setLoading false
        setLoading(false);
      }
    };
    fetchtodos();
  }, []);

  const todoCreate = async () => {
    // if user not typeing on input but he trying to add tudo thats we use if condition and return keyword
    if (!newTodo) return;
    try {
      const response = await axios.post(
        "http://localhost:4001/todo/create",
        {
          // here we are passing values ,here the user typed new value and here we are storing thise new value in text property
          // and completed property initial value is false means not clicked yet
          text: newTodo,
          completed: false,
        },
        {
          withCredentials: true,
        }
      );
      // console.log(response.data.newTodo)
      // here ...todos, means all todos data stored in todos varibale we need to show all todos data and response.data newly created todo also
      setTodos([...todos, response.data.newTodo]);
      // setNewTodos(""); : after adding new todo set input filed empty
      setNewTodos("");
    } catch (error) {
      // toast.error("failed to create tudo");
      if (error.response) {
        toast.error(error.response.data.errors || "server error");
      } else {
        toast.error("Cannot connect to the server. Please try again later.");
      }
    }
  };

  const todoStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);

    try {
      const response = await axios.put(
        `http://localhost:4001/todo/update/${id}`,
        {
          // ...todo : which tudo we are updating show updated value here
          ...todo,
          // set completed true
          completed: !todo.completed,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data.todo);
      // if both id true forntend and backend then set updated data to (tudos variable) to update like cross mark if not true set old old value
      // setTudos((oldTodo)=> oldTodo.map((t)=>(t._id===id ? response.data?.todo :t)))
      setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errors || "server error");
      } else {
        toast.error("Cannot connect to the server. Please try again later.");
      }
    }
  };

  const todoDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/todo/delete/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errors || "server error");
      } else {
        toast.error("Cannot connect to the server. Please try again later.");
      }
    } finally {
      setLogoutLoading(false);
    }
  };

  const logout = async () => {
    setLogoutLoading(true);
    try {
      await axios.get("http://localhost:4001/user/logout", {
        withCredentials: true,
      });
      toast.success("User logged out successfully");
      navigateTo("/login");
      localStorage.removeItem("jwt");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errors || "server error");
      } else {
        toast.error("Cannot connect to the server. Please try again later.");
      }
    } finally {
      setLogoutLoading(false);
    }
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;
  // console.log(remainingTodos + " Remaining Todo  " )

  return (
    <div className=" my-10 bg-gray-100 max-w-lg lg:max-w-xl rounded-lg shadow-lg mx-8 sm:mx-auto p-6">
      <h1 className="mb-5 text-4xl font-extrabold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-transparent bg-clip-text drop-shadow-md animate-pulse">
        Todo App
      </h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a new todo"
          className="flex-grow p-2 border rounded-l-md focus:outline-none"
          value={newTodo}
          onChange={(e) => setNewTodos(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && todoCreate()}
        ></input>
        <button
          onClick={todoCreate}
          className="bg-blue-600 rounded-r-md text-white px-4 py-4 hover:bg-blue-900 duration-300"
        >
          Add
        </button>
      </div>

      {loading ? (
        <div className="text-center justify-center">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold">{error}</div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo, index) => (
            <li
              key={todo._id || index}
              className="flex items-center border justify-between p-3 bg-gray-100 rounded-md"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => todoStatus(todo._id)}
                  className="mr-2 w-5 h-5 accent-blue-600 cursor-pointer transition-transform duration-300 ease-in-out transform checked:scale-110"
                ></input>
                <span
                  className={`${
                    todo.completed
                      ? "line-through text-gray-800 font-semibold"
                      : ""
                  }`}
                >
                  {todo.text}
                </span>
              </div>

              <button
                onClick={() => todoDelete(todo._id)}
                className="bg-red-400 text-white border border-red-500 px-3 py-1.5 rounded-md transition-all duration-300 hover:bg-transparent hover:text-red-500 hover:shadow-md"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-center text-sm text-green-700">
        {remainingTodos} Todo Remaining
      </p>
      <button
        onClick={() => logout()}
      
        
        className="mt-6 block mx-auto px-6 py-3 text-white font-semibold rounded-md bg-blue-500 shadow-lg transform transition-all duration-300 hover:scale-105"
        disabled={logoutLoading}
      >
        {logoutLoading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}

export default Home;
