import fs from 'fs'
import path from 'path'
import { scrape } from 'twitter-scraper'

scrape('from:egeste', (error, tweets) => {
  if (error) return console.error(error)

  const outputPath = path.join(__dirname, '..', 'data')
  const outputFile = path.resolve(path.join(outputPath, '@egeste.json'))

  fs.writeFile(outputFile, JSON.stringify(tweets))
})
