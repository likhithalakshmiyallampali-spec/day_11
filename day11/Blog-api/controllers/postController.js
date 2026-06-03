const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/posts.json');

// Helper function to read/write file
const getPosts = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const savePosts = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

exports.getAllPosts = (req, res) => {
    const posts = getPosts();
    let { page = 1, limit = 5 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPages = Math.ceil(posts.length / limit);

    // Edge case: No posts found
    if (posts.length === 0) return res.json({ message: "No posts available", posts: [] });

    // Edge case: Invalid page number
    if (page > totalPages || page < 1) {
        return res.status(404).json({ message: "Invalid page number" });
    }

    const paginatedPosts = posts.slice(startIndex, endIndex);
    res.json({
        totalPosts: posts.length,
        totalPages,
        currentPage: page,
        posts: paginatedPosts
    });
};

exports.createPost = (req, res) => {
    const { title, content, author } = req.body;
    const posts = getPosts();

    // Validation Requirements
    if (!title || title.length < 5) {
        return res.status(400).json({ message: "Error: Title must be min 5 chars" });
    }
    if (!content || content.length < 20) {
        return res.status(400).json({ message: "Error: Content must be min 20 chars" });
    }

    const newPost = {
        id: Date.now(),
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    posts.push(newPost);
    savePosts(posts);
    res.status(201).json(newPost);
};

exports.getPostById = (req, res) => {
    const post = getPosts().find(p => p.id == req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
};

exports.updatePost = (req, res) => {
    let posts = getPosts();
    const index = posts.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Post not found" });

    const { title, content } = req.body;
    if (title && title.length < 5) return res.status(400).json({ message: "Title too short" });
    if (content && content.length < 20) return res.status(400).json({ message: "Content too short" });

    posts[index] = { 
        ...posts[index], 
        title: title || posts[index].title, 
        content: content || posts[index].content,
        updatedAt: new Date().toISOString() 
    };

    savePosts(posts);
    res.json(posts[index]);
};

exports.deletePost = (req, res) => {
    let posts = getPosts();
    const filteredPosts = posts.filter(p => p.id != req.params.id);
    if (posts.length === filteredPosts.length) return res.status(404).json({ message: "Post not found" });

    savePosts(filteredPosts);
    res.json({ message: "Post deleted successfully" });
};