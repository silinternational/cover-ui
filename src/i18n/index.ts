import phrases from './phrases.json'

export default function t(key: string): string {
  const phraseObj: { [key: string]: { [locale: string]: string } } = phrases
  const phrase = phraseObj[key]
  if (phrase === undefined) {
    console.log(key)
    return '⤂ translation key not found! ⤃'
  }

  const langOnlyNoVariant = navigator.language.substring(0, 2)

  return phrase[langOnlyNoVariant] || phrase['en']
}
