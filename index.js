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
    
  callAI(lang, text);

}

console.log("index.js");

translateForm.addEventListener("submit", eventHandler);

//const { OPENAI_API_KEY } = process.env.OPENAI_API_KEY;

async function callAI(language, text) {
    
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

    const url = '/.netlify/functions/fetchAI';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'text/plain',
            },
            body: JSON.stringify(messages)
        });

        const data = await response.json();
        console.log(data);


        console.log(data.reply.choices[0].message.content);

        const translation = data.reply.choices[0].message.content;

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

