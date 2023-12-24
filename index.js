import OpenAI from "openai";

let eventHandler = function(e) {
  e.preventDefault();
  
  //console.log("translate form")

  let lang = ""  ;
  if(document.getElementById('french').checked)
    lang="french";
    else if(document.getElementById('spanish').checked)
        lang='spanish';
    else    
        lang='japanese';

  const text = document.getElementById('text-translate').value;
  
  //console.log(lang)
  //console.log(text)

  // try to get the api key here in the handler
  const KEY = process.env.OPENAI_API_KEY;
  
  callAI(lang, text, KEY);

}

console.log("index.js");

translateForm.addEventListener("submit", eventHandler);

//const { OPENAI_API_KEY } = process.env.OPENAI_API_KEY;

async function callAI(language, text, key) {
    const messages = [
        {
            role: 'system',
            content: `You are a language translator. Translate the given text in english to ${language}`
        },
        {
            role: 'user',
            content: text
        }
    ];

    try {
	console.log("in callai");
	console.log(process.env.OPENAI_API_KEY);
        const openai = new OpenAI({
		dangerouslyAllowBrowser: true,
		apiKey: key
        })
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages
        });
        console.log(response.choices[0].message.content);
        //document.body.innerText = response.choices[0].message.content
        document.getElementById('original').src = "./assets/original-text.png";
        document.getElementById('translate-text').src = "./assets/your-translation.png";
        document.getElementsByClassName('radio-buttons')[0].style.display = "none";
        const text_display = document.getElementsByClassName('translated-text');
        //console.log(text_display)
        text_display[0].style.display = "block";
        text_display[0].innerText = response.choices[0].message.content;
        const btn = document.getElementsByClassName('translate-btn')[0];
        btn.innerText = "Start Over";
        
        //btn.style.width = "90%"
        btn.style.marginInline = "0.5rem";
        document.getElementsByClassName('input-text')[0].style.justifyContent = "center";
        
        const eventHdl = document.getElementsByClassName('translate-btn')[0];
        
        translateForm.removeEventListener("submit", eventHandler);
        eventHdl.addEventListener('click', function() {
            window.location.reload();
        })

    } catch (err) {
        console.log('Error:', err);
        //loadingArea.innerText = 'Unable to access AI. Please refresh and try again'
    }
}

//callAI()

// not used
function renderWarning(obj) {
  const keys = Object.keys(obj);
  const filtered = keys.filter((key) => obj[key]);
  document.body.innerText =
    `Your response has been flagged for the following reasons: ${filtered.join(", ")}.`;
}

