import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

let posts = [];


// Post Constructor
function Post(title, content) {
    this.title = title;
    this.content = content;
    this.rawDate = new Date();
    this.date = this.rawDate.toLocaleString();
}

// Add Post
function addPost(title, content) {
    let post = new Post(title, content);
    posts.push(post);
}

// Delete Post
function deletePost(index) {
    posts.splice(index, 1);
}
// Edit Post
function editPost(index, title, content) {
    posts[index] = new Post(title, content);
}

// Midleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));


// Todo All paths

// Home
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/all-blogs", (req, res) => {
    res.render("/all-blogs.ejs", {posts: posts} );
});

app.get("/view/:id", (req, res) => {
    let index = req.params.id;
    let post = posts[index];
    res.render("/view.ejs", {postId: index, title: post.title, content: post.content});
});

// Delete Post
app.post("/delete", (req, res) => {
    let index = req.body["postId"];
    deletePost(index);
    res.redirect("/all-blogs");
});

// Edit Post Page
app.get("/edit/:id", (req, res) => {
    let index = req.params.id;
    let post = posts[index];
    res.render("/create-blog.ejs", {postId: index, title: post.title, content: post.content});
});

// Update
app.post("/update", (req, res) => {
    let title = req.body["title"];
    let content = req.body["content"];
    let index = req.body["index"];
    editPost(index, title, content);
    res.redirect("/all-blogs");
});

// Create Post Page
app.get("/create-blog", (req, res) => {
    res.render("/create-blog.ejs");
});

// Save Post
app.post("/save", (req, res) => {
    let title = req.body["title"];
    let content = req.body["content"];
    
    addPost(title, content);
    console.log(posts);
    res.redirect("/all-blogs");
});


app.get("/about", (req, res) => {
    res.render("/about.ejs");
});

app.get("/contact", (req, res) => {
    res.render("/contact.ejs");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})