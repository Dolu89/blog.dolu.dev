const puppeteer = require('puppeteer')
const fs = require('fs')
const util = require('util')
const matter = require('gray-matter')

const readdir = util.promisify(fs.readdir);
const readfile = util.promisify(fs.readFile);

async function run() {

    const POSTS_DIR = './posts'
    const THUMBNAILS_DIR = './public/static/thumbnails'

    const posts = (await readdir(POSTS_DIR)).map(post => post.replace('.md', ''))
    const thumbnails = (await readdir(THUMBNAILS_DIR)).map(post => post.replace('.png', ''))

    const thumbnailsToGenerate = posts.filter(x => !thumbnails.includes(x));

    for (const file of thumbnailsToGenerate) {
        console.log(`Generation of ${file}.png`)
        const content = await readfile(`${POSTS_DIR}/${file}.md`)
        const contentMatter = matter(content.toString())
        let browser = await puppeteer.launch({ headless: true })
        let page = await browser.newPage()
        await page.goto(`${contentMatter.data.slides}/fullscreen`)
        await page.waitFor(2000)
        await page.screenshot({ path: `${THUMBNAILS_DIR}/${file}.png`, fullPage: true })
        await page.close()
        await browser.close()
    }

    return 'End'

}

run()
.then(e => console.log(e))
.catch(console.error(e => console.error(e)))