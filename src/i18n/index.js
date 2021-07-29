import phrases from './phrases.json'

export default function t(key) {
  const phrase = phrases[key]
  if (phrase === undefined) {
    return '⤂ translation key not found! ⤃'
  }

  const langOnlyNoVariant = navigator.language.substring(0,2)

  return phrase[langOnlyNoVariant] || phrase['en']
}
