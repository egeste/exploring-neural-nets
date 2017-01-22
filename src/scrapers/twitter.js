import fs from 'fs'
import path from 'path'
import { scrape } from 'twitter-scraper'

export default query => {
  scrape(query, (error, tweets) => {
    if (error) return console.log(error)

    const outputPath = path.join(__dirname, '..', '..', 'data')
    const outputFile = path.resolve(path.join(outputPath, `twitter (${query}).json`))

    fs.writeFile(outputFile, JSON.stringify(tweets))
  })
}
