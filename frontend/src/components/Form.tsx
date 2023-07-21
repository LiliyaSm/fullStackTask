import React, { useState } from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import InputMask from "react-input-mask";
import { IFormData, IError } from "../types";
import UsersList from "./UsersList";

const server = "http://localhost:3001";
const apiUrl = `${server}/search`;

const Form = (): React.ReactElement => {
  const [email, setEmail] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [users, setUsers] = useState<IFormData[]>([]);
  const [errors, setErrors] = useState<IError[]>([]);
  const [cancelController, setCancelController] =
    useState<AbortController | null>(null);

  const isLoading = !!cancelController;

  const handleSubmit = async () => {
    if (cancelController) cancelController.abort();
    const controller = new AbortController();
    setCancelController(controller);
    const signal = controller.signal;
    setErrors([]);
    setUsers([]);

    let body: IFormData = { email };
    if (number) {
      //removing mask
      body = { ...body, number: number.replace(/\D/g, "") };
    }

    const requestOptions = {
      signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      if (response.status === 200) {
        setUsers(data);
      } else if (response.status === 400) {
        setErrors(data.errors);
      }
      setCancelController(null);
    } catch (error: any) {
      if (error.name !== "AbortError") setCancelController(null);
    }
  };

  const renderErrors = (): JSX.Element => {
    if (errors.length)
      return (
        <ul>
          {errors.map(({ path, msg }) => {
            return (
              <li key={path}>
                <Typography sx={{ m: 1 }} color="error">
                  {path}: {msg}
                </Typography>
              </li>
            );
          })}
        </ul>
      );
    return <></>;
  };

  return (
    <Container
      component="div"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />

          <InputMask
            mask="99-99-99"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          >
            <TextField
              margin="normal"
              fullWidth
              name="number"
              label="Number"
              autoComplete="number"
            />
          </InputMask>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            {isLoading ? "loading..." : "Submit"}
          </Button>
        </Box>
        {renderErrors()}
        <UsersList users={users} isDisplayingErrors={!!errors.length} />
      </Box>
    </Container>
  );
};

export default Form;
