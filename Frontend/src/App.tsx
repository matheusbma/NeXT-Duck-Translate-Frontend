import { useState } from 'react'
import axios from "axios";
import logo from './assets/logo.png'
import { IconOriginTarget } from "./assets/iconOriginTarget"
import TextareaAutosize from 'react-textarea-autosize'
import ClipLoader from "react-spinners/ClipLoader"

const translationTypeBoxStyle = 'flex gap-2 pt-16 pb-2 sm:pt-[72px] xl:pt-[75px] xl:pb-[10px] ml-3 transition-all'
const buttonStyle = 'h-9 px-6 md:text-lg  text-orange-500 tracking-wide  hover:text-white active:text-white bg-white hover:bg-orange-500 active:bg-orange-500 border-[1px] border-solid border-orange-500 rounded transition-colors'

const languageSelectionBoxStyle = 'flex md:text-lg justify-between items-center border-y xl:border-x border-solid border-orange-500 rounded transition-all'
const textStyle = 'w-[45%] py-2 text-center tracking-wide rounded text-orange-500 hover:text-white appearance-none hover:bg-orange-500 transition-colors'

function App() {
  const [translationType, setTranslationType] = useState(true)
  const [originValue, setOriginValue] = useState('')
  const [targetValue, setTargetValue] = useState('en')
  const [text, setText] = useState('')
  const [translation, setTranslation] = useState('')
  const [uploadedFile, setUploadedFile] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOnClickSetTranslationTypeText = () => {
    setTranslationType(true);
  }
  
  const handleOnClickSetTranslationTypeSpeechToText = () => {
    setTranslationType(false);
  }

  const handleOnSelectOrigin = (e: any) => {
    setOriginValue(e.target.value);
  }

  const handleOnChangeOriginToTarget = () => {
    if (originValue === '') {
      return alert('Escolha uma linguagem de origem ou insira um texto.')
    } else {
      let oldTargetValue = targetValue
      let oldOriginValue = originValue
  
      setOriginValue(oldTargetValue);
      setTargetValue(oldOriginValue);
  
      (document.getElementById('originLanguage') as HTMLInputElement).value=oldTargetValue;
      (document.getElementById('targetLanguage') as HTMLInputElement).value=oldOriginValue;   
    }
  }

  const handleOnSelectTarget = (e: any) => {
    setTargetValue(e.target.value);
  }

  const handleOnChange = (e: any) => {
    setText(e.target.value);
  }

  const handleOnSubmit = (e: any) => {
    setUploadedFile(e.target.files[0])
  }

  const handleOnClickTranslationText = (e: any) => {
    setLoading(true);
    axios.post(`http://127.0.0.1:5000/translations/source-language`, {
      text: text
    })
    .then(function (response: any) {
      let source = response.data.source;
      setOriginValue(source);
      (document.getElementById('originLanguage') as HTMLInputElement).value=source;
    })
    .catch(function (error: any) {
      alert(`${error}\nNão foi possível determinar a língua do texto`);
    });
    axios.post(`http://127.0.0.1:5000/translations/target/${targetValue}`, {
    text: text
  })
  .then(function (response: any) {
    setLoading(false);
    setTranslation(response.data.translation);
  })
  .catch(function (error: any) {
    setLoading(false);
    alert(`\nPara traduzir, é preciso inserir um texto abaixo`);
  });
  }

  const handleOnClickTranslationAudio = (e: any) => {
    const formData = new FormData();
    formData.append("file",uploadedFile)
    setLoading(true)
    axios.post(`http://127.0.0.1:5000/speech-to-text/${originValue}/${targetValue}`, 
    formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  .then(function (response) {
    setLoading(false)
    setText(response.data.text);
    setTranslation(response.data.translation);
  })
  .catch(function (error) {
    setLoading(false)
    alert(`${error}\nNão é possível detectar o idioma do arquivo de áudio. \nPor favor, escolha o idioma base`);
  });
  }

  return (
    <div className="App">
      <header className='w-full h-14 sm:h-[65px] px-4 sm:px-5 flex fixed border-b-[3px] bg-orange-500 border-gray-500/20 transition-all'>
        <div className="flex items-center">
          <a className="flex items-center content-center gap-[13px]" href="/">
            <img src={logo} className="w-8 h-8 invert" alt="logo do duck translate" />
            <h2 className='text-white font-bold text-xl tracking-wider'>DUCK TRANSLATE</h2>
          </a>
        </div>
      </header>

      <div id='wrapper' className='xl:max-w-[1240px] xl:px-12 xl:m-auto transition-all'>

        <div id='translationType' className={translationTypeBoxStyle}>
          <button 
          onClick={handleOnClickSetTranslationTypeText}
          className={buttonStyle}
          >
          Texto
          </button>

          <button 
          onClick={handleOnClickSetTranslationTypeSpeechToText}
          className={buttonStyle}
          >
          Áudio
          </button>
        </div>

        <div id='languageSelector' className={languageSelectionBoxStyle}>
          <select id='originLanguage' name='originLanguage' onChange={handleOnSelectOrigin} className={textStyle}>
            <option value="">Detectar Idioma</option>
            <option value="pt">Português</option>
            <option value="en">Inglês</option>
            <option value="de">Alemão</option>
            <option value="es">Espanhol</option>
            <option value="fr">Francês</option>
          </select>
          
          <button onClick={handleOnChangeOriginToTarget} className="flex items-center rounded h-10 w-12 hover:bg-orange-500 transition-all">
            <div className='flex w-20 p-[10px] -rotate-90 active:rotate-0 fill-orange-500 hover:fill-white transition-all'>
              <IconOriginTarget/>
            </div>  
          </button>

          <select id='targetLanguage' name='targetLanguage' onChange={handleOnSelectTarget} className={textStyle}>
            <option value="en">Inglês</option>
            <option value="pt">Português</option>
            <option value="de">Alemão</option>
            <option value="es">Espanhol</option>
            <option value="fr">Francês</option>
          </select>
        </div>

        {!translationType?
          <div className='flex flex-col items-center justify-center mt-3'>
            <div className='flex justify-center px-12 xl:px-20 py-3 border-solid border-[1px] border-orange-500 rounded transition-all'>
              <input className='text-orange-500 ' type="file" onChange={handleOnSubmit}/>
            </div>

            <div className='flex py-3 justify-center'>
              {loading?
              <div>
                <ClipLoader className='flex ' color={'#FFAD08'} loading={loading} size={30} />
              </div>
              :
              <button 
                className={buttonStyle}
                onClick={handleOnClickTranslationAudio}
                >
                Enviar
              </button>
              }
            </div>

            <div className='flex w-full flex-col justify-center md:flex-row md:gap-[9px] xl:mt-0 transition-all'>
              <TextareaAutosize 
                className='w-full p-2 md:text-lg rounded outline-orange-500 border-solid border-[1px] border-orange-500 transition-all' 
                minRows={6}
                maxRows={70}
                value={text}
                placeholder='Texto do Áudio'
                />

              <div className='py-2'></div>

              <TextareaAutosize 
                className='w-full p-2 md:text-lg rounded outline-orange-500 border-solid border-[1px] border-orange-500 transition-all' 
                value={translation}
                minRows={6}
                maxRows={70}
                placeholder='Tradução do Texto'
                />
            </div>
          </div>
          :
          <div></div>
        }

        {translationType?
        <div className='mt-[10px]'>
          <div className='flex flex-col justify-center md:flex-row md:gap-[9px] transition-all'>
            <TextareaAutosize 
            className='w-full p-2 md:text-lg rounded outline-orange-500 border-solid border-[1px] border-orange-500 transition-all' 
            onChange={handleOnChange}
            minRows={6}
            maxRows={70}
            placeholder='Insira o texto para traduzir:'
            value={text}
            />

            <div className='flex py-3 justify-center md:hidden'>
            {loading?
              <div>
                <ClipLoader className='flex ' color={'#FFAD08'} loading={loading} size={30} />
              </div>
              :
              <button 
                className={buttonStyle}
                onClick={handleOnClickTranslationText}
                >
                Enviar
              </button>
            }
            </div>

            <TextareaAutosize 
            className='w-full p-2 md:text-lg rounded outline-orange-500 border-solid border-[1px] border-orange-500 transition-all' 
            value={translation}
            minRows={6}
            maxRows={70}
            placeholder='Tradução'
            />
            </div>

            <div className='flex mt-1 py-3 justify-center invisible md:visible'>
            {loading?
              <div>
                <ClipLoader className='flex ' color={'#FFAD08'} loading={loading} size={30} />
              </div>
              :
              <button 
                className={buttonStyle}
                onClick={handleOnClickTranslationText}
                >
                Enviar
              </button>
            }
          </div>
        </div>
        :
        <div></div>
        }
        </div>
    </div>
  );
}

export default App