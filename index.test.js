const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('valid @when rule', async () => {
  await run('.panel {visibility: hidden; @when (var(--selected-tab) = 1) { visibility: visible; }}', '.panel {visibility: hidden; animation: 1s when-animation-1 paused; animation-delay: calc((1 - var(--selected-tab)) * 1s)}\n@keyframes when-animation-1 {\nfrom { visibility: visible}}', {})
})

it('invalid @when rule', async () => {
  await expect(postcss([plugin({})]).process('.panel {visibility: hidden; @when (var(--selected-tab) > 1) { visibility: visible; }}', { from: undefined })).rejects.toThrow(Error)
})
