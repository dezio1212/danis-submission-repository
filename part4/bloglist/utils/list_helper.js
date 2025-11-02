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

module.exports = { dummy, totalLikes, favoriteBlog }
