const textToSpeech = (text, lang) => {
  const speech = new SpeechSynthesisUtterance(text)
  speech.lang = lang
  speechSynthesis.speak(speech)
}

export default textToSpeech
