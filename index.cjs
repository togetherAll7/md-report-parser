import('./src/MdParser.js')
  .then(parser => {
    module.exports = parser
  })
  .catch(err => {
    console.error(err)
  })
