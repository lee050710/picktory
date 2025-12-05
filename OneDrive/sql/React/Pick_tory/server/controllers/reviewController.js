// reviewController.js
const Review = require('../models/Review');

/**
 * getReviews: 리뷰 목록 (페이징/필터 param 적용 가능)
 * query params: page, limit, category, tag
 */
const getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, tag } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("author", "username");

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const getReview = async (req, res, next) => {
  try {
    const rv = await Review.findById(req.params.id).populate("author", "username");
    if (!rv) return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });
    res.json(rv);
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { title, text, images, category, tags } = req.body;
    const review = await Review.create({
      author: req.user.id,
      title,
      text,
      images: images || [],
      category,
      tags: tags || []
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

module.exports = { getReviews, getReview, createReview };
