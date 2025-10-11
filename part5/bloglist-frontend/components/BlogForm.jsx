const BlogForm = ({ addNew, newBlog, handleInputChange }) => {
    return (
        <form onSubmit={addNew}>
            <input value={newBlog} onChange={handleInputChange}></input>
            <button type="submit">add</button>
        </form>
    )
}

export default BlogForm