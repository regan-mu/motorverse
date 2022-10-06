// List
exports.categoryList = (req, res) => {
    res.send("Categories List");
}

// Detail
exports.categoryDetail = (req, res) => {
    res.send("Category details");
}

// Create
exports.createGet = (req, res) => {
    res.send("Create cat get");
}
exports.createPost = (req, res) => {
    res.send("Create Cat post");
}

// Delete
exports.deleteGet = (req, res) => {
    res.send("Delete Cat Get");
}
exports.deletePost = (req, res) => {
    res.send("Delete Cat Post");
}

// Update
exports.updateGet = (req, res) => {
    res.send("Update Category Get");
}
exports.updatePost = (req, res) => {
    res.send("Update category post")
}