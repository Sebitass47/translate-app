/* Importación de módulos*/
import { useState } from 'react'
/* Importación de archivos svg*/
import expandir_svg from './svg/expandir_svg.svg'
import reproducir_svg from './svg/reproducir_svg.svg'
import copiar_svg from './svg/copiar_svg.svg'
import traducir_svg from './svg/traducir_svg.svg'
import intercambiar_svg from'./svg/intercambiar_svg.svg'
import logo from'./svg/logo.svg'
import copyToClipboard from './Functions/copyToClipboard'
import textToSpeech from './Functions/textToSpeech'
/* Importación de archivos css*/
import './App.css'

const App = () => {
  const [recuentoPalabras, setRecuentoPalabras] = useState(0)
  const [textInput, setTextInput] = useState('')
  const [textOutput, setTextOutput] = useState('')
  const [languageInput, setLanguageInput] = useState('Autodetect')
  const [languageOutput, setLanguageOutput] = useState('English')
  const [isOpenInput, setIsOpenInput] = useState(false)
  const [isOpenOutput, setIsOpenOutput] = useState(false)
  const [optionLanguageInput, setOptionLanguageInput] = useState('Spanish')
  const [optionLanguageOutput, setOptionLanguageOutput] = useState('Spanish')

  const idiomas = {
    Spanish: 'es',
    Arabic: 'ar',
    Bengali: 'bn',
    Chamorro: 'ch',
    Welsh: 'cy',
    Danish: 'da',
    German: 'de',
    Greek: 'el',
    Irish: 'ga',
    Gaelic: 'gd',
    Manx: 'gv',
    Croatian: 'hr',
    Hungarian: 'hu',
    Italian: 'it',
    Korean: 'ko',
    Cornish: 'kw',
    Lingala: 'ln',
    Malay: 'ms',
    Dutch: 'nl',
    Portuguese: 'pt',
    Sindhi: 'sd',
    Serbian: 'sr',
    Swati: 'ss',
    Swedish: 'sv',
    Swahili: 'sw',
    Tamil: 'ta',
    Tswana: 'tn',
    Turkish: 'tr',
    Urdu: 'ur',
    'Mandarin Chinese': 'zh'
  }

  const fetchData = async e => {
    e.preventDefault()
    const idiomasAdicionales = {
      Autodetect: 'Autodetect',
      English: 'en',
      French: 'fr',
    }
    const idiomasCompletos = {...idiomas, ...idiomasAdicionales}
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${textInput}!&langpair=${idiomasCompletos[languageInput]}|${idiomasCompletos[languageOutput]}`
    )
    const data = await response.json()
    setTextOutput(data['responseData']['translatedText'])
    if ('detectedLanguage' in data['responseData']) {
      const idiomaOrigen = obtenerNombreIdioma(data['responseData']['detectedLanguage'].split('-')[0], idiomasCompletos)
      if (idiomaOrigen != null){
        setLanguageInput(idiomaOrigen)
        if (!['English', 'French'].includes(idiomaOrigen))
        setOptionLanguageInput(idiomaOrigen)
      }
    }
  }


  const handleOptionClick = (option, value) => {
    if (option == 'input') {
      setLanguageInput(value)
      setOptionLanguageInput(value)
      setIsOpenInput(false)
    } else {
      setLanguageOutput(value)
      setOptionLanguageOutput(value)
      setIsOpenOutput(false)
    }
  }

  const handleExchange = () => {
    if (!['Autodetect', null, undefined].includes(languageInput)){
      const lenguajeEntrada = languageOutput
      setLanguageOutput(languageInput)
      setLanguageInput(lenguajeEntrada)
      const opcionLenguajeEntrada =  optionLanguageOutput
      setOptionLanguageOutput(optionLanguageInput)
      setOptionLanguageInput(opcionLenguajeEntrada)
    }
    const textoEntrada = textOutput
    setTextOutput(textInput)
    setTextInput(textoEntrada)
  }


  const obtenerNombreIdioma = (codigoIdioma, idiomas) => {
    for (let nombreIdioma in idiomas) {
      if (idiomas[nombreIdioma] === codigoIdioma) {
        return nombreIdioma;
      }
    }
    return null; // Retorna null si no se encuentra el código de idioma en el objeto
  }
  


  const handleTextInput = event => {
    const nuevoTexto = event.target.value
    const textoSinSaltosRepetidos = nuevoTexto.replace(/\n{3,}/g, '\n')
    const textoSinEspaciosRepetidos = textoSinSaltosRepetidos.replace(
      / {2,}/g,
      ' '
    )
    setTextInput(textoSinEspaciosRepetidos)
    setRecuentoPalabras(textoSinEspaciosRepetidos.length)
  }

  const handleLanguageInput = (e, language) => {
    e.preventDefault()
    setLanguageInput(language)
  }

  const handleLanguageOutput = (e, language) => {
    e.preventDefault()
    setLanguageOutput(language)
  }

  return (
    <section className='App'>
      <img src={logo} className='logo' />
      <article className='cuadroEntrada'>
        <div>
          <button
            className={
              languageInput == 'Autodetect'
                ? 'botonIdioma idiomaSeleccionado'
                : 'botonIdioma'
            }
            onClick={e => handleLanguageInput(e, 'Autodetect')}
          >
            Detect Language
          </button>
          <button
            className={
              languageInput == 'English'
                ? 'botonIdioma idiomaSeleccionado'
                : 'botonIdioma'
            }
            onClick={e => handleLanguageInput(e, 'English')}
          >
            English
          </button>
          <button
            className={
              languageInput == 'French'
                ? 'botonIdioma idiomaSeleccionado'
                : 'botonIdioma'
            }
            onClick={e => handleLanguageInput(e, 'French')}
          >
            French
          </button>
          <div className='custom-select'>
            <button
              className={
                !['French', 'English', 'Autodetect'].includes(languageInput)
                  ? 'botonIdioma idiomaSeleccionado'
                  : 'botonIdioma'
              }
              onClick = {() => setLanguageInput(optionLanguageInput)}
            >
              {optionLanguageInput} <img src={expandir_svg} className='expandDown'  onClick={() => setIsOpenInput(!isOpenInput)}/>
            </button>
            {isOpenInput && (
              <div className='options'>
                {Object.entries(idiomas).map(([label, value]) => (
                  <div
                    key={value}
                    onClick={() => handleOptionClick('input', label)}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <hr className='lineaSeparacion' />
        <textarea
          className='texto'
          value={textInput}
          onChange={handleTextInput}
        ></textarea>
        <span className='contadorPalabras'>{recuentoPalabras}/500</span>
        <div className='botonesAcciones'>
          <span>
            <button className='botonAccion' onClick={() => textToSpeech(textInput, idiomas[languageInput])}>
              <img src={reproducir_svg} className='imagenAccion' />
            </button>
            <button className='botonAccion' onClick={() => copyToClipboard(textInput)}>
              <img src={copiar_svg} className='imagenAccion'/>
            </button>
          </span>
          <button className='botonTraducir' onClick={e => fetchData(e)}>
            <img src={traducir_svg} className='traducirAccion' />
            Translate
          </button>
        </div>
      </article>
      <article className='cuadroEntrada cuadroSalida'>
        <div className='containerButtons'>
          <button
            className={
              languageOutput == 'English'
                ? 'botonIdioma idiomaSeleccionado'
                : 'botonIdioma'
            }
            onClick={e => handleLanguageOutput(e, 'English')}
          >
            English
          </button>
          <button
            className={
              languageOutput == 'French'
                ? 'botonIdioma idiomaSeleccionado'
                : 'botonIdioma'
            }
            onClick={e => handleLanguageOutput(e, 'French')}
          >
            French
          </button>
          <div className='custom-select'>
            <button
              className={
                !['French', 'English'].includes(languageOutput)
                  ? 'botonIdioma idiomaSeleccionado'
                  : 'botonIdioma'
              }
              onClick = {() => setLanguageOutput(optionLanguageOutput)}
            >
              {optionLanguageOutput} <img src={expandir_svg} className='expandDown' onClick={() => setIsOpenOutput(!isOpenOutput)}/>
            </button>
            {isOpenOutput && (
              <div className='options'>
                {Object.entries(idiomas).map(([label, value]) => (
                  <div
                    key={value}
                    onClick={() => handleOptionClick('output', label)}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className='botonAccion botonIntercambiar' onClick={() => handleExchange(textOutput)}>
              <img src={intercambiar_svg} className='imagenAccion' />
            </button>
        </div>
        <hr className='lineaSeparacion' />
        <textarea className='texto' readOnly value={textOutput}></textarea>
        <div className='botonesAcciones'>
          <span>
            <button className='botonAccion' onClick={() => textToSpeech(textOutput, idiomas[languageOutput])}>
              <img src={reproducir_svg} className='imagenAccion' />
            </button>
            <button className='botonAccion' onClick={() => copyToClipboard(textOutput)}>
              <img src={copiar_svg} className='imagenAccion'/>
            </button>
          </span>
        </div>
      </article>
    </section>
  )
}

export default App
