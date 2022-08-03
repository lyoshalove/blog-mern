import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useEffect } from "react";
import axios from '../axios';
import ReactMarkdown from 'react-markdown';

export const FullPost = () => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then(res => {
        setPost(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.warn(error);
        alert('Ошибка при получении статьи');
      });
  }, [])

  if(loading) {
    return (<Post isLoading={loading} />)
  }

  return (
    <>
      <Post
        id={post._id}
        title={post.title}
        imageUrl={post.imageUrl}
        user={post.user}
        createdAt={post.createdAt}
        viewsCount={post.viewsCount}
        commentsCount={3}
        tags={post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.text} />
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
