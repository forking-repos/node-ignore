const {
  test,
  only
} = require('tap')

const ignore = require('..')
const {
  cases,
  checkEnv,
  SHOULD_TEST_WINDOWS
} = require('./fixtures/cases')

const make_win32 = path => path.replace(/\//g, '\\')

cases(({
  description,
  patterns,
  paths_object,
  test_only,
  paths,
  expect_result
}) => {
  const tt = test_only
    ? only
    : test

  checkEnv('IGNORE_ONLY_FILTER')
  && tt(`.filter():        ${description}`, t => {
    const ig = ignore()
    const result = ig
    .addPattern(patterns)
    .filter(paths)

    expect_result(t, result)
    t.end()
  })

  checkEnv('IGNORE_ONLY_CREATE_FILTER')
  && tt(`.createFilter():  ${description}`, t => {
    const result = paths.filter(
      ignore()
      .addPattern(patterns)
      .createFilter(),
      // thisArg should be binded
      null
    )

    expect_result(t, result)
    t.end()
  })

  const run_ignores = name => {
    tt(`.${name}(path):   ${description}`, t => {
      const ig = ignore().addPattern(patterns)

      Object.keys(paths_object).forEach(path => {
        const should_ignore = !!paths_object[path]
        const not = should_ignore ? '' : 'not '

        t.equal(
          ig[name](path),
          should_ignore,
          `path: "${path}" should ${not}be ignored`
        )
      })
      t.end()
    })
  }

  checkEnv('IGNORE_ONLY_IGNORES')
  && run_ignores('ignores')

  checkEnv('IGNORE_ONLY_CHECK_IGNORE')
  && run_ignores('ignores')

  if (!SHOULD_TEST_WINDOWS) {
    return
  }

  checkEnv('IGNORE_ONLY_WIN32')
  && tt(`win32: .filter(): ${description}`, t => {
    const win_paths = paths.map(make_win32)

    const ig = ignore()
    const result = ig
    .addPattern(patterns)
    .filter(win_paths)

    expect_result(t, result, make_win32)
    t.end()
  })
})
