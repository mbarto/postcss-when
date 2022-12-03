const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('valid @when rule', async () => {
  await run(
    '.panel {visibility: hidden; @when (var(--my-var) = 1) { visibility: visible; }}',
    '.panel {visibility: hidden; animation: 1s when-animation-1 paused; animation-delay: calc((1 - var(--my-var)) * 1s)}\n@keyframes when-animation-1 {\nfrom { visibility: visible}}'
  )
})

it('invalid @when rule', async () => {
  await expect(postcss([plugin({})])
    .process('.panel {visibility: hidden; @when (anything) { visibility: visible; }}', { from: undefined }))
    .rejects.toThrow(Error)
})

it('unsupported operator', async () => {
  await expect(postcss([plugin({})])
    .process('.panel {visibility: hidden; @when (var(--my-var) # 1) { visibility: visible; }}', { from: undefined }))
    .rejects.toThrow(Error)
})

it('greater condition', async () => {
  await run(
    '.panel {visibility: hidden; @when (var(--my-var) > 10) { visibility: visible; }}',
    '.panel {visibility: hidden; animation: 1s when-animation-1 paused; animation-delay: calc(clamp(0, 10.000001 - var(--my-var), 1) * 1s)}\n@keyframes when-animation-1 {\nfrom { visibility: visible}}'
  )
})

it('greater or equal condition', async () => {
  await run(
    '.panel {visibility: hidden; @when (var(--my-var) >= 10) { visibility: visible; }}',
    '.panel {visibility: hidden; animation: 1s when-animation-1 paused; animation-delay: calc(clamp(0, 10 - var(--my-var), 1) * 1s)}\n@keyframes when-animation-1 {\nfrom { visibility: visible}}'
  )
})

it('less condition', async () => {
  await run(
    '.panel {visibility: hidden; @when (var(--my-var) < 10) { visibility: visible; }}',
    '.panel {visibility: hidden; animation: 1s when-animation-1 paused; animation-delay: calc(clamp(0, var(--my-var) - 9.999999, 1) * 1s)}\n@keyframes when-animation-1 {\nfrom { visibility: visible}}'
  )
})

it('less or equal condition', async () => {
  await run(
    '.panel {visibility: hidden; @when (var(--my-var) <= 10) { visibility: visible; }}',
    '.panel {visibility: hidden; animation: 1s when-animation-1 paused; animation-delay: calc(clamp(0, var(--my-var) - 10, 1) * 1s)}\n@keyframes when-animation-1 {\nfrom { visibility: visible}}'
  )
})

it('not equal condition', async () => {
  await run(
    '.panel {visibility: hidden; @when (var(--my-var) != 10) { visibility: visible; }}',
    '.panel {visibility: hidden; animation: 1s when-animation-1 paused; animation-delay: calc((1 - max(10 - var(--my-var), -1 * (10 - var(--my-var)))) * 1s)}\n@keyframes when-animation-1 {\nfrom { visibility: visible}}'
  )
})
