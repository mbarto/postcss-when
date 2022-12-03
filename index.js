let conditions = 1

function getFormula(expression) {
  const supportedExpression = /var\((.*?)\) (=|>|<|<=|>=|!=) ([0-9]+)/.exec(expression)
  if (supportedExpression) {
    const variableName = supportedExpression[1]
    const operator = supportedExpression[2]
    const value = supportedExpression[3]
    switch(operator) {
      case "=": return `calc((${value} - var(${variableName})) * 1s)`
      case ">": return `calc(clamp(0, ${value} - var(${variableName}) ,1) * 1s)`
      default: throw new Error(`Operator not supported ${operator}`)
    }

  }
  throw new Error(`Unsupported when expression: ${expression}`)

}

module.exports = () => {
  return {
    postcssPlugin: 'postcss-when',

    Once () {
      conditions = 1
    },
    AtRule: {
      when: (atRule, {Declaration, AtRule, Rule}) => {
        const animationName = `when-animation-${conditions++}`
        const keyFrames = new AtRule({
          name: "keyframes", params: animationName
        })
        const fromRule = new Rule({
          selector: "from"
        })
        keyFrames.append(fromRule)
        for (let i = 0; i < atRule.nodes.length; i++) {
          fromRule.append(atRule.nodes[i])
        }
        atRule.root().append(keyFrames)
        atRule.parent.append(new Declaration({
          prop: "animation-delay", value: getFormula(atRule.params)
        }))
        atRule.replaceWith(new Declaration({
          prop: "animation", value: `1s ${animationName} paused`
        }))
      }
    }
  }
}

module.exports.postcss = true
