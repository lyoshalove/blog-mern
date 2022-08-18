import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.status(200).json(posts);
  } catch(e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.status(200).json(tags);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (error, doc) => {
        if(error) {
          return res.status(500).json({
            message: "Не удалось вернуть статью",
          });
        }

        if(!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        return res.json(doc);
      }
    ).populate('user').clone();
  } catch(e) {
    console.log(e);
    return res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $push: {
          comments: [{
            user: req.userId,
            text: req.body.text,
          }],
        },
      },
      {
        returnDocument: "after",
      },
      (error, doc) => {
        if (error) {
          return res.status(500).json({
            message: "Не удалось добавить комментарий",
          });
        }

        return res.json(doc);
      }
    ).populate('user');
  } catch(e) {
    console.log(e);
    return res.status(500).json({
      message: "Не удалось создать комментарий",
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch(e) {
    console.log(e);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndDelete(
      {
        _id: postId,
      }, 
      (error, doc) => {
        if(error) {
          return res.status(500).json({
            message: "Не удалось удалить статью",
          });
        }

        if(!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }

        res.json({
          success: true
        });
      }
    );

  } catch(e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });

  } catch(e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};