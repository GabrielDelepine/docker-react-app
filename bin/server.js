const fs = require('fs')
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const zlib = require('zlib')

const NODE_ENV = process.env.NODE_ENV

let publicPath
if (path.isAbsolute(process.argv[2])) {
  publicPath = process.argv[2]
} else {
  publicPath = path.resolve(process.cwd(), process.argv[2])
}
const indexHtmlPath = path.join(publicPath, 'index.html')

// check NODE_ENV
if (!['production', 'preproduction', 'development'].includes(NODE_ENV)) {
  console.error(`FATAL: Invalid NODE_ENV (${NODE_ENV})`)
  process.exit(1)
}

// Check if public path exists
if (!fs.existsSync(publicPath)) {
  console.error(`FATAL: Missing dist folder (${publicPath})`)
  process.exit(1)
}

// retreive the content of the index file
let indexHtmlContent
try {
  indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8')
} catch (err) {
  console.error(`FATAL: Cannot read (${indexHtmlPath})`)
  console.error(err)
  process.exit(1)
}

// Replace template variable in the index file content
const varToReplace = '<!-- __EXPRESS_NODE_ENV__ -->'
if (indexHtmlContent.includes(varToReplace)) {
  indexHtmlContent = indexHtmlContent.replace(
    new RegExp(varToReplace, 'g'),
    `<script>window.NODE_ENV="${NODE_ENV}"</script>`
  )
} else {
  console.error(
    `FATAL: Cannot find string %s in %s`,
    varToReplace,
    indexHtmlPath
  )
  process.exit(1)
}

const compressOptions = {
  level: zlib.Z_BEST_COMPRESSION,
}

const staticOptions = {
  etag: true,
  cacheControl: true,
  lastModified: true,
  maxAge: '15d',
  immutable: true,
  index: false,
}

const app = express()

app.use(morgan('combined'))
app.use(compression(compressOptions))
app.use(express.static(publicPath, staticOptions))

app.set('port', process.env.PORT || 9000)

app.disable('x-powered-by')

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8')
  res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0, no-transform')
  res.setHeader('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
  res.send(indexHtmlContent)
})

app.all('*', (_, res) => {
  res.status(405).end()
})

app.listen(app.get('port'), () => {
  if (NODE_ENV !== 'production') {
    console.warn(`⚠ NODE_ENV is not set to production (currently ${NODE_ENV})`)
  }

  console.info(
    '✓ App is listening at http://localhost:%s in %s mode',
    app.get('port'),
    app.get('env')
  )
})
