import React, { useState, ChangeEvent } from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import InputMask from "react-input-mask";
// import { IMaskInput } from "react-imask";
const server = "http://localhost:3001";

const Form = () => {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async () => {
    if (isLoading) return;
    setErrors([]);
    setIsLoading(true);
    const apiUrl = `${server}/search`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, number: number.replace(/\D/g, '' )}),
    };

    try {
      console.log({ email, number });
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (data?.errors) {
        console.log(data.errors);
        setErrors(data.errors);
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  return (
    <Container
      component="div"
      maxWidth="xs"
      sx={{
        backgroundColor: "white",
        borderRadius: "10px",
        p: 2,
        pb: 4,
        mt: 18,
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
            maskChar=" "
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
      </Box>
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
    </Container>
  );
};

export default Form;
