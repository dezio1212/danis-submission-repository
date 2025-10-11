/// 
// BlogItem menampilkan judul, author, url, upvotes, dan tombol “Upvote”.

const BlogItem = ({ blogs, onUpVote, onDelete}) => {
  return (
    <ul>
      {blogs.map((blog) => (
        <li key={blog.id}>
          <p>Title: {blog.title}</p>
          <p>Author: {blog.author}</p>
          <p>URL: {blog.url}</p>
          <p>Upvotes: {blog.upvotes}</p>
          <button type="button" onClick={() => onUpVote(blog.id, blog.upvotes)}>vote</button>
          <button onClick={() => onDelete(blog.id)}>delete</button>
        </li>
    ))}
    </ul>
  );
};

export default BlogItem;
