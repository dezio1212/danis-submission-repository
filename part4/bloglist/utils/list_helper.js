const dummy = (_blogs) => 1

const totalLikes = (blogs = []) => {
  return blogs.reduce((sum, b) => sum + (b.likes || 0), 0)
}

const favoriteBlog = (blogs = []) => {
  if (!blogs.length) return null
  const top = blogs.reduce((max, b) => {
    const maxLikes = max?.likes ?? 0
    const bLikes = b?.likes ?? 0
    return bLikes > maxLikes ? b : max
  }, blogs[0])

  return {
    title: top.title,
    author: top.author,
    likes: top.likes ?? 0
  }
}

const mostBlogs = (blogs = []) => {
  if (!blogs.length) return null
  const counts = blogs.reduce((acc, b) => {
    const author = b?.author ?? 'Unknown'
    acc[author] = (acc[author] || 0) + 1
    return acc
  }, {})

  let topAuthor = null
  let maxBlogs = 0
  for (const [author, count] of Object.entries(counts)) {
    if (count > maxBlogs) {
      maxBlogs = count
      topAuthor = author
    }
  }
  return { author: topAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs = []) => {
  if (!blogs.length) return null
  const sumByAuthor = blogs.reduce((acc, b) => {
    const author = b?.author ?? 'Unknown'
    const likes = b?.likes ?? 0
    acc[author] = (acc[author] || 0) + likes
    return acc
  }, {})

  let topAuthor = null
  let maxLikes = 0
  for (const [author, likes] of Object.entries(sumByAuthor)) {
    if (likes > maxLikes) {
      maxLikes = likes
      topAuthor = author
    }
  }
  return { author: topAuthor, likes: maxLikes }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
