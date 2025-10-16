/// 
// BlogItem menampilkan judul, author, url, upvotes, dan tombol “Upvote”.
import Blog from './Blog'

const BlogItem = ({ blogs, onUpVote, onDelete}) => {
  return (
    <div>
      {blogs.map(b => (
        <Blog
          key={b.id}
          blog={b}
          onLike={onUpVote}   
          onDelete={onDelete}
        />
      ))}
    </div>
  )
};

export default BlogItem;
