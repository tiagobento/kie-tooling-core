module.exports = {
  reporters: [
    'default',
    [
      'jest-junit',
      {
        /*
         * Removes spaces from test titles and makes first
         * letter of each word capitalized.
         *
         * unit test -> UnitTest
         *
         * See junit.xml report for resulting look.
         */
        titleTemplate: vars => {
          var str = vars.title.toLowerCase()
          str = str.split(' ')
          for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
          }
          var result = str.join('')
          return result.replace(',')
        }
      }
    ]
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testRegex: '/__tests__/.*\\.test\\.(jsx?|tsx?)$',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  }
}
