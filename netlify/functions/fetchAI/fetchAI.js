import OpenAI from "openai";

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
      const input  = JSON.parse(event.body)

      const openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: process.env.OPENAI_API_KEY
      })

      const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: input
      })
  
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: response }),
        // // more keys you can return:
        // headers: { "headerName": "headerValue", ... },
        // isBase64Encoded: true,
      }

    } catch (error) {
      return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }
