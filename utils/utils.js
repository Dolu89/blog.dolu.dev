import matter from 'gray-matter'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
dayjs.locale('fr')

export function reformatDate(fullDate) {
    return dayjs(fullDate).format('D MMMM YYYY')
}

export function getPosts(context) {
    const posts = (context => {
        const keys = context.keys()
        const values = keys.map(context)

        const data = keys.map((key, index) => {
            // Create slug from filename
            const slug = key
                .replace(/^.*[\\\/]/, '')
                .split('.')
                .slice(0, -1)
                .join('.')
            const value = values[index]
            // Parse yaml metadata & markdownbody in document
            const document = matter(value.default)
            return {
                frontmatter: document.data,
                markdownBody: document.content,
                slug,
            }
        })
        return data
    })(context)
    return posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
}

export function getPreviousPostSlug(postIndex, posts) {
    if (posts.length - 1 === postIndex) return null
        return posts[postIndex + 1].slug
}

export function getNextPostSlug(postIndex, posts) {
    if (postIndex <= 0) return null
    return posts[postIndex - 1].slug
}