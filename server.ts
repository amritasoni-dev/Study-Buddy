import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

// Fallback intelligent responder for study help if API key is not present or offline
function generateFallbackResponse(prompt: string, context?: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('math') || lower.includes('calculate') || lower.includes('formula') || lower.includes('equation')) {
    return `🤖 *Buddy Math Assistant:*\n\nHere is a step-by-step approach to solve problems of this type:\n1. **Identify Knowns & Unknowns:** Write down the given variables and what you need to find.\n2. **Select the core principle:** Check your relevant formulas or theorems.\n3. **Substitute with Units:** Keep track of units to avoid algebraic slips.\n4. **Double Check:** Verify the boundary conditions.\n\n*Tip from Buddy:* If you want full step-by-step calculations, you can also paste this equation directly into the **Brainly** tool on our left menu for community verified steps!`;
  }
  
  if (lower.includes('schedule') || lower.includes('plan') || lower.includes('weekly') || lower.includes('study')) {
    return `🤖 *Buddy Study Optimizer:*\n\nHere is a high-yield study structure for you:\n- **Deep Focus Block (45 min):** Tackle your hardest subject first while brain energy is peak (e.g. Math or Physics).\n- **Active Recall (25 min):** Quiz yourself without looking at notes.\n- **Quick Pomodoro Break (10 min):** Hydrate and stretch!\n- **Review & Flashcards (20 min):** Quick end-of-day reinforcement.\n\n*Check the Weekly Tasks or Weekend Plans tab on the left to add this directly to your calendar!*`;
  }
  
  if (lower.includes('exam') || lower.includes('test') || lower.includes('nervous') || lower.includes('stress')) {
    return `🤖 *Buddy Cheer & Exam Strategy:*\n\nTake a deep breath! You've got this! ✨\n1. **Prioritize high-weightage topics:** Review past year exam questions and syllabus milestones.\n2. **Teach it back:** Explain tricky definitions aloud as if teaching a classmate.\n3. **Sleep well before the test:** Memory consolidation happens during rest—don't pull an all-nighter.\n\n*I added your upcoming exam countdown right in the Tests & Exams tab!*`;
  }
  
  return `🤖 *Buddy is right here!* 💡\n\nRegarding "*${prompt.slice(0, 70)}...*":\n\nHere is the key takeaway to keep in mind:\n- Break this down into 2-3 manageable sub-points.\n- Relate it to real-world examples to anchor your conceptual memory.\n- Use the active study tools in the sidebar (like Google Scholar or Brainly) if you need specialized diagrams.\n\n*Keep shining, student buddy! Every step forward counts!* ✨`;
}

// Endpoint: Ask Gemini Study Buddy
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      return res.json({
        reply: generateFallbackResponse(prompt, context),
        source: 'local-buddy'
      });
    }

    const systemInstruction = `You are "Buddy", a cheerful, supportive, and clever student buddy robot companion.
You speak in a warm, encouraging student-friendly tone, with occasional cute robot touches (🤖, ⚡, ✨, 📚), and italic accents (*study smart!*).
You help students with homework explanations, essay outlines, math steps, exam revision tactics, coding debugging, and motivational boosts.
Context: ${context || 'College / High School Student'}.
Format your responses with clean Markdown, bullet points, and actionable tips.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      reply: response.text || generateFallbackResponse(prompt, context),
      source: 'gemini'
    });
  } catch (err: any) {
    console.error('Gemini API chat error:', err?.message || err);
    res.json({
      reply: generateFallbackResponse(req.body?.prompt || '', req.body?.context),
      source: 'local-buddy'
    });
  }
});

// Endpoint: Generate Custom Study Plan / Weekly Tasks
app.post('/api/gemini/generate-plan', async (req, res) => {
  try {
    const { type, subjects, goals, intensity } = req.body;
    
    if (!ai) {
      // Return high quality structured student tasks
      const defaultTasks = [
        { day: 'Monday', title: `${subjects?.[0] || 'Core Subject'}: Chapter Review & Formulas`, duration: '50 mins', priority: 'High', type: 'Study' },
        { day: 'Tuesday', title: `${subjects?.[1] || 'Secondary Subject'}: Assignment Problem Set`, duration: '45 mins', priority: 'Medium', type: 'Assignment' },
        { day: 'Wednesday', title: `${subjects?.[0] || 'Core Subject'}: Practice Quiz & Flashcards`, duration: '35 mins', priority: 'High', type: 'Quiz Prep' },
        { day: 'Thursday', title: `${subjects?.[2] || 'Elective'}: Research & Summary Notes`, duration: '40 mins', priority: 'Medium', type: 'Study' },
        { day: 'Friday', title: 'Weekly Recap & College Assignment Submissions', duration: '60 mins', priority: 'High', type: 'Review' },
      ];
      return res.json({ tasks: defaultTasks, source: 'curated' });
    }

    const promptText = `Generate a realistic student study plan for ${type || 'weekly tasks'}.
Subjects: ${(subjects || ['Mathematics', 'Computer Science', 'Physics']).join(', ')}.
Specific Goals: ${goals || 'Keep up with coursework and prepare for upcoming tests'}.
Intensity: ${intensity || 'Balanced'}.
Return a strict JSON array of objects with keys: "day" (string, e.g. "Monday", "Saturday", etc.), "title" (string, descriptive student task), "duration" (string, e.g. "45 mins"), "priority" ("High" | "Medium" | "Low"), "type" ("Study" | "Assignment" | "Revision" | "Fun").
Only return valid JSON array, without markdown backticks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      }
    });

    let tasks = [];
    try {
      const rawText = response.text?.trim() || '[]';
      tasks = JSON.parse(rawText);
    } catch {
      tasks = [
        { day: 'Monday', title: 'Deep Work: Core Subject Chapters', duration: '50 mins', priority: 'High', type: 'Study' },
        { day: 'Tuesday', title: 'Solve Practice Assignment Problems', duration: '45 mins', priority: 'Medium', type: 'Assignment' },
        { day: 'Wednesday', title: 'Review Test Syllabus & Flashcards', duration: '40 mins', priority: 'High', type: 'Revision' },
        { day: 'Thursday', title: 'Lab Work / Coding Practice & Notes', duration: '60 mins', priority: 'Medium', type: 'Study' },
        { day: 'Friday', title: 'Weekly Wrap-up & Submission Check', duration: '30 mins', priority: 'High', type: 'Review' }
      ];
    }

    res.json({ tasks, source: 'gemini' });
  } catch (err: any) {
    console.error('Plan generation error:', err?.message || err);
    res.json({
      tasks: [
        { day: 'Monday', title: 'Lecture Notes Synthesis & Formula Sheet', duration: '45 mins', priority: 'High', type: 'Study' },
        { day: 'Tuesday', title: 'Tutorial Sheet & Problem Sets', duration: '50 mins', priority: 'Medium', type: 'Assignment' },
        { day: 'Wednesday', title: 'Midterm Prep: Practice Questions', duration: '60 mins', priority: 'High', type: 'Revision' },
        { day: 'Thursday', title: 'Lab Writeup & Code Submission', duration: '40 mins', priority: 'Medium', type: 'Assignment' },
        { day: 'Friday', title: 'Organize Next Week & Final Polish', duration: '30 mins', priority: 'Low', type: 'Review' }
      ],
      source: 'fallback'
    });
  }
});

// Setup Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🤖 Student Buddy server running on port ${port}`);
  });
}

startServer();
