import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from 'react-hook-form';
import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin, selectIsAuth } from "../../redux/authSlice";
import { Navigate } from "react-router-dom";

export const Login = () => {
  const dispatch = useDispatch();
  const {register, handleSubmit, setError, formState: {errors, isValid}} = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });
  const isAuth = useSelector(selectIsAuth);

  const onSubmit = async (values) => {
    const data = await dispatch(fetchLogin(values));

    if(!data.payload) {
      alert("Не удалось авторизоваться.. :(");
    }

    if(data.payload.token) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if(isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          fullWidth
          type="email"
          {...register("email", { required: "Укажите почту" })}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          fullWidth
          type="password"
          {...register("password", { required: "Укажите пароль" })}
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Войти
        </Button>
      </form>
    </Paper>
  );
};
