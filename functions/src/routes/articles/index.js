const {Router} = require("express");
const middleware = require("../../middleware");
const getArticles = require("./getArticles");
const postArticle = require("./postArticle");
const publishArticle = require("./publishArticle");

const articleRouter = Router();

const {verifyToken, permissions, fileUpload} = middleware;

articleRouter.get(
	"/",
	(req, res, next) => {
		req.type = "all";
		req.published = true;
		next();
	},
	getArticles
);
articleRouter.get(
	"/unpublished",
	verifyToken,
	(req, res, next) => {
		req.type = "all";
		req.published = false;
		next();
	},
	getArticles
);

articleRouter.get(
	"/:cid",
	(req, res, next) => {
		req.type = "category";
		next();
	},
	getArticles
);

articleRouter.get(
	"/user/:uid",
	verifyToken,
	(req, res, next) => permissions(req, res, next, "articles", "read"),
	(req, res, next) => {
		req.type = 'user';
		next();
	},
	getArticles
);

articleRouter.post(
	"/",
	verifyToken,
	(req, res, next) => permissions(req, res, next, "articles", "create"),
	fileUpload,
	postArticle
);

articleRouter.patch(
	"/publish",
	verifyToken,
	(req, res, next) => permissions(req, res, next, "articles", "update"),
	publishArticle
);

module.exports = articleRouter;
