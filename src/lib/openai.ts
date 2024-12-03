import OpenAI from 'openai';
import { StudyUnit, Language, QuestionType } from '../types/study';
import { chunk } from './utils';

interface OpenAIResponse {
  units: StudyUnit[];
  language: Language;
}

const QUESTION_TYPES: QuestionType[] = [
  'definition',
  'explanation',
  'application',
  'analysis',
  'comparison'
];

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is not configured. Please check your .env file.');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
});

export async function generateUnitsAndFlashcards(
  text: string,
  existingUnits?: StudyUnit[]
): Promise<{ units: StudyUnit[]; language: Language }> {
  // Split text into chunks of 6000 characters to ensure we stay within token limits
  // while leaving room for system prompt and response
  const chunks = chunk(text, 6000);
  let allUnits: StudyUnit[] = [];
  let language: Language = 'en';

  try {
    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Identificar las unidades, capitulos, temas o "UVAs" del documento. Para cada unidad, crear materiales de estudio concisos con respuestas breves (máximo 2-3 oraciones):
            1. Evalúen definiciones y términos clave
            2. Pidan explicaciones de procesos o conceptos
            3. Apliquen conocimiento a nuevas situaciones
            4. Analicen relaciones entre conceptos
            5. Comparen y contrasten diferentes ideas
            
            ${i > 0 ? 'Este es un fragmento adicional del mismo documento. Continuar identificando unidades y conceptos.' : 'Mantener las respuestas claras y concisas. Enfocarse solo en puntos clave.'}
            Retornar un objeto JSON con:
            - 'units': array de unidades de estudio
            - 'language': código del idioma detectado (ej., 'en', 'es')
            
            Para cada unidad incluir:
            - name: tema principal
            - concepts: ideas clave cubiertas
            - flashcards: array de tarjetas con tipos variados de preguntas
            
            Generar todo el contenido en el mismo idioma que el texto de entrada.
            ${i > 0 ? 'Evitar duplicar unidades ya identificadas en fragmentos anteriores.' : ''}`
          },
          {
            role: "user",
            content: `${
            existingUnits 
              ? 'Generar tarjetas de estudio adicionales concisas (respuestas de 2-3 oraciones) diferentes de las existentes.' 
              : 'Crear unidades de estudio con tarjetas concisas (respuestas de 2-3 oraciones).'
          } Texto: ${chunks[i]}${
            existingUnits 
              ? `\n\nUnidades existentes: ${JSON.stringify(existingUnits)}`
              : ''
            }`
          }
        ]
      });

      if (!response.choices[0]?.message?.content) {
        throw new Error('Invalid response from OpenAI API');
      }

      const result = JSON.parse(response.choices[0].message.content) as OpenAIResponse;
      
      if (!result.units || !Array.isArray(result.units)) {
        throw new Error('Invalid response format from OpenAI API');
      }

      // Keep track of the detected language
      if (result.language) {
        language = result.language;
      }

      // Merge units with existing ones
      result.units.forEach(newUnit => {
        const existingUnit = allUnits.find(u => u.name === newUnit.name);
        if (existingUnit) {
          // Merge concepts and flashcards
          existingUnit.concepts = [...new Set([...existingUnit.concepts, ...newUnit.concepts])];
          existingUnit.flashcards = [
            ...existingUnit.flashcards,
            ...newUnit.flashcards.map(card => ({
              ...card,
              type: QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)],
              unit: newUnit.name,
              concept: newUnit.concepts[0] || 'General'
            }))
          ];
        } else {
          // Add new unit
          allUnits.push({
            ...newUnit,
            flashcards: newUnit.flashcards.map(card => ({
              ...card,
              type: QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)],
              unit: newUnit.name,
              concept: newUnit.concepts[0] || 'General'
            }))
          });
        }
      });
    }

    return { units: allUnits, language };
  } catch (error) {
    console.error('Error generating flashcards:', error);
    if (error instanceof Error && error.message.includes('JSON')) {
      throw new Error('Failed to parse AI response. Please try again.');
    }
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to generate flashcards. Please try again.'
    );
  }
}