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
          onLike={(id, likesValue) => onUpVote(id, likesValue)}   
          onDelete={onDelete}
        />
      ))}
    </div>
  )
};

export default BlogItem;
