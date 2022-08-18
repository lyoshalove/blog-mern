import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { fetchRegister, selectIsAuth } from "../../redux/authSlice";
import { Navigate } from "react-router-dom";
import styles from './Login.module.scss';

export const Registration = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      avatarUrl: "",
    },
    mode: "onChange",
  });
  const isAuth = useSelector(selectIsAuth);

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      alert("Не удалось зарегаться.. :(");
    }

    if (data.payload.token) {
      window.localStorage.setItem("token", data.payload.token);
    }

    console.log(values);
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form action="#" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Полное имя"
          fullWidth
          error={Boolean(errors.fullname?.message)}
          helperText={errors.fullname?.message}
          {...register("fullname", { required: "Укажите полное имя" })}
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          fullWidth
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Укажите почту" })}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          fullWidth
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Укажите пароль" })}
        />
        <TextField
          className={styles.field}
          label="Ссылка на аватарку"
          fullWidth
          type="text"
          error={Boolean(errors.avatarUrl?.message)}
          helperText={errors.avatarUrl?.message}
          {...register("avatarUrl")}
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
