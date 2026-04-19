import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();

// Initialize Groq client only if API key is available
let groq: Groq | null = null;
try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
} catch (error) {
  console.warn('Groq client initialization failed:', error);
}

/**
 * @swagger
 * /api/evaluations/evaluate:
 *   post:
 *     summary: Evaluate student level based on answers
 *     tags: [Evaluations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Evaluation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 evaluation:
 *                   type: string
 *       500:
 *         description: Evaluation failed
 */
router.post('/evaluate', async (req, res) => {
  try {
    const { answers } = req.body;

    if (!groq) {
      // Fallback mock response if Groq is not available
      const evaluation = `Évaluation basée sur les réponses fournies : L'étudiant montre un niveau intermédiaire en programmation et gestion de projet. Parcours recommandé : Développement web avancé avec intégration IA.`;
      return res.json({ evaluation });
    }

    const prompt = `Évaluez le niveau de l'étudiant basé sur ces réponses : ${JSON.stringify(answers)}. Fournissez une évaluation détaillée de ses compétences en programmation et gestion de projet. Répondez en français.`;

    const response = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    const evaluation = response.choices[0].message.content || 'Évaluation terminée';
    res.json({ evaluation });
  } catch (error) {
    console.error('Erreur évaluation Groq:', error);
    res.status(500).json({ error: 'Évaluation échouée' });
  }
});

/**
 * @swagger
 * /api/evaluations/recommend-path:
 *   post:
 *     summary: Recommend a personalized PFE path
 *     tags: [Evaluations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               level:
 *                 type: string
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Path recommendation generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 path:
 *                   type: string
 *       500:
 *         description: Path recommendation failed
 */
router.post('/recommend-path', async (req, res) => {
  try {
    const { level, interests } = req.body;

    if (!groq) {
      // Fallback mock response if Groq is not available
      const path = `Parcours personnalisé pour un étudiant niveau ${level} intéressé par ${interests.join(', ')} : 1. Évaluation des compétences, 2. Assignation de mentor, 3. Développement de projet, 4. Évaluation finale.`;
      return res.json({ path });
    }

    const prompt = `En vous basant sur un niveau d'étudiant "${level}" et des intérêts dans ${interests.join(', ')}, recommandez un parcours PFE (Projet de Fin d'Études) personnalisé. Incluez des étapes spécifiques, des technologies recommandées, et des jalons. Répondez en français.`;

    const response = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
    });

    const path = response.choices[0].message.content || 'Recommandation de parcours générée';
    res.json({ path });
  } catch (error) {
    console.error('Erreur recommandation parcours Groq:', error);
    res.status(500).json({ error: 'Recommandation de parcours échouée' });
  }
});

export default router;