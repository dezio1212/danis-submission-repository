/// 
// BlogItem menampilkan judul, author, url, upvotes, dan tombol “Upvote”.
import Blog from './Blog'

const BlogItem = ({ blogs, onUpVote, onDelete, currentUser}) => {
  return (
    <div>
      {blogs.map(b => (
        <Blog
          key={b.id}
          blog={b}
          onLike={(id, likesValue) => onUpVote(id, likesValue)}   
          onDelete={onDelete}
          currentUser={currentUser}
        />
      ))}
    </div>
  )
};

export default BlogItem;
