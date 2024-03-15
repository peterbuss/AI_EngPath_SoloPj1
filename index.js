import OpenAI from "openai";
//import { Context } from "netlify/edge-functions";


let lang=""
let text=""
let KEY="";

let eventHandler = function(e) {
  e.preventDefault();
  
  //console.log("translate form")

  if(document.getElementById('french').checked)
    lang="french";
    else if(document.getElementById('spanish').checked)
        lang='spanish';
    else    
        lang='japanese';

  text = document.getElementById('text-translate').value;
  
  //console.log(lang)
  //console.log(text)

  // try to get the api key here in the handler
  //KEY = process.env.OPENAI_API_KEY;
  KEY = "" ;  // import.meta.env.VITE_OPENAI_API_KEY ;
  //console.log("KEY:", KEY); don't expose key
  //KEY = Context.Netlify.env.get("OPENAI_API_KEY");
  
  callAI(lang, text, KEY);

}

console.log("index.js");

translateForm.addEventListener("submit", eventHandler);

//const { OPENAI_API_KEY } = process.env.OPENAI_API_KEY;

async function callAI(language, text, key) {

    const url = '/.netlify/functions/fetchAI';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain',
        },
        body: JSON.stringify(text)
    });
    const data = await response.json();
    console.log(data);

    return

    if(key===0) {
	console.log("key not defined");
	return;
    }
	
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
	
        const openai = new OpenAI({
		dangerouslyAllowBrowser: true,
		apiKey: key
        })
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages
        });

        console.log(response.choices[0].message.content);

        const translation = response.choices[0].message.content;

        const input_field = document.querySelector(".translator") ;

        const new_html = `<div class="top-text">
                            <p class="output-text">Original Text 👇</p>
                          </div>
                         <div class="input-field">
                            <textarea class="input-text" id="text-translate" name="text-input">${text}</textarea>
                         </div>
                         <div class="top-text">
                            <p class="output-text">Your Translation 👇</p>
                        </div>
                        <div class="translated-text">
                            <p>${translation}</p>
                        </div>
                        <div>
                            <button class="translate-btn">Start Over</button>
                        </div>
        `;
        
        input_field.innerHTML = new_html;
                
        const text_display = document.querySelector('.translated-text');
        text_display.style.display = "block";

        const eventHdl = document.querySelector('.translate-btn');

        eventHdl.style.width= "90%";
        
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

